(function() {
    let popup, popupContent, closeButton, loadingAnimation;
    let lastSelection = '';
    const LOADING_DELAY = 500; // Show loading after 500ms if summary hasn't loaded
  
    function initializeExtension() {
      console.log("Content script loaded and running");
  
      // Create and append popup elements
      popup = document.createElement('div');
      popupContent = document.createElement('p');
      loadingAnimation = document.createElement('div');
      popup.appendChild(popupContent);
      popup.appendChild(loadingAnimation);
  
      // Create a style element for our custom styles
      const style = document.createElement('style');
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;600&display=swap');
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
  
        .loading {
          border: 3px solid #f3f3f3;
          border-top: 3px solid #3498db;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: 10px auto;
        }
      `;
      document.head.appendChild(style);
  
      // Style the popup
      popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: black;
        border: 0 solid #e3e3e3;
        border-radius: 10px;
        padding: 20px;
        max-width: 80%;
        max-height: 80%;
        overflow-y: auto;
        z-index: 10000;
        display: none;
        box-shadow: 0 4px 6px rgba(255, 255, 255, 0.1);
        box-sizing: border-box;
      `;
  
      popupContent.style.cssText = `
        margin: 0;
        font-family: 'Noto Sans', Arial, sans-serif;
        font-size: 0.875rem;
        line-height: 1.25rem;
        color: rgb(236 236 236);
        font-weight: 600;
        text-align: center;
        white-space: pre-wrap;
      `;
  
      loadingAnimation.className = 'loading';
      loadingAnimation.style.display = 'none';
  
      // Add close button with 'X' icon
      closeButton = document.createElement('button');
      closeButton.textContent = 'X';
      closeButton.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background-color: transparent;
        color: white;
        border: none;
        font-size: 20px;
        cursor: pointer;
        padding: 1;
        line-height: .8;
      `;
      closeButton.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        hidePopup();
      };
      popup.appendChild(closeButton);
  
      document.body.appendChild(popup);
  
      addEventListeners();
    }
  
    function showPopup(text) {
      popupContent.textContent = text;
      loadingAnimation.style.display = 'none';
      popupContent.style.display = 'block';
      popup.style.display = 'block';
    }
  
    function showLoading() {
      popupContent.style.display = 'none';
      loadingAnimation.style.display = 'block';
      popup.style.display = 'block';
    }
  
    function hidePopup() {
      popup.style.display = 'none';
    }
  
    function addEventListeners() {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('keydown', handleKeyDown);
    }
  
    function removeEventListeners() {
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    }
  
    function handleMouseUp() {
      let selectedText = window.getSelection().toString().trim();
      console.log("Selected text:", selectedText);
      
      if (selectedText.length > 0 && selectedText !== lastSelection) {
        lastSelection = selectedText;
        
        let loadingTimeout = setTimeout(() => {
          showLoading();
        }, LOADING_DELAY);
  
        chrome.runtime.sendMessage({action: "summarize", text: selectedText}, function(response) {
          clearTimeout(loadingTimeout);
          
          if (chrome.runtime.lastError) {
            console.error("Chrome runtime error:", chrome.runtime.lastError);
            showPopup("Error: Failed to generate summary");
            return;
          }
          if (response.error) {
            console.error("Summarization error:", response.error);
            showPopup("Error: " + response.error);
          } else {
            console.log("Summary:", response.summary);
            showPopup(response.summary);
          }
        });
      } else if (selectedText.length === 0) {
        hidePopup();
        lastSelection = '';
      }
    }
  
    function handleMouseDown(e) {
      if (popup.style.display === 'block' && !popup.contains(e.target)) {
        hidePopup();
      }
    }
  
    function handleKeyDown(e) {
      if (e.key === 'Escape' && popup.style.display === 'block') {
        hidePopup();
      }
    }
  
    // Initialize the extension
    initializeExtension();
  
    // Listen for extension reload
    chrome.runtime.onConnect.addListener(function(port) {
      if (port.name === "ping") {
        port.onDisconnect.addListener(function() {
          console.log("Extension reloaded, reinitializing...");
          removeEventListeners();
          initializeExtension();
        });
      }
    });
  })();
// Replace 'YOUR_API_TOKEN' with your actual Hugging Face API token
const API_TOKEN = '';
const API_URL = 'https://api-inference.huggingface.co/models/facebook/bart-large-cnn';

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "summarize") {
    summarizeText(request.text)
      .then(summary => {
        sendResponse({summary: summary});
      })
      .catch(error => {
        console.error('Error:', error);
        sendResponse({error: error.message || 'Failed to summarize text'});
      });
    return true;  // Indicates that the response is sent asynchronously
  }
});

async function summarizeText(text) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: text,
        parameters: {
          max_length: 60,  // Reduced for shorter summaries
          min_length: 20,  // Reduced for shorter summaries
          num_beams: 4,    // Increased for potentially better quality
          do_sample: false // Deterministic generation
        }
      })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
    }

    const result = await response.json();
    if (result[0] && result[0].summary_text) {
      return limitToTwoSentences(result[0].summary_text);
    } else {
      throw new Error('Unexpected API response format');
    }
  } catch (error) {
    console.error('Summarization error:', error);
    throw error;
  }
}

function limitToTwoSentences(text) {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  return sentences.slice(0, 2).join(' ').trim();
}
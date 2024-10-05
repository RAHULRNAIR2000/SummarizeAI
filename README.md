# SummarizeAI Chrome Extension

## Overview

This Chrome extension provides quick and easy text summarization for selected content on any webpage. It uses the Hugging Face API to generate concise, two-sentence summaries of selected text, enhancing your browsing and research experience.

## Features

- Summarize selected text on any webpage
- Generates a two-sentence summary using AI
- Clean and intuitive user interface
- Loading animation for longer processing times
- Easy-to-use popup interface

## Setup

### Prerequisites

- Google Chrome browser
- A Hugging Face account and API token

### Installation

1. Clone this repository or download the source code.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory containing the extension files.

### Configuration

1. Sign up for a Hugging Face account at [https://huggingface.co/](https://huggingface.co/) if you haven't already.
2. Create an API token in your Hugging Face account settings.
3. Open the `background.js` file in the extension directory.
4. Replace `'YOUR_API_TOKEN'` with your actual Hugging Face API token:

   ```javascript
   const API_TOKEN = 'YOUR_API_TOKEN';
   ```

5. Save the file and reload the extension in Chrome.

## Usage

1. Select any text on a webpage.
2. A popup will appear with a summary of the selected text.
3. For longer processing times, a loading animation will be displayed.
4. Click the 'X' button or press 'Esc' to close the summary popup.

## Files and Structure

- `manifest.json`: Extension configuration file
- `background.js`: Handles API calls and background processes
- `content.js`: Manages user interactions and UI on webpages
- `icons/`: Directory containing extension icons

## Technical Details

- Uses Manifest V3 for Chrome extensions
- Leverages the Hugging Face API for text summarization
- Implements asynchronous processing for better user experience
- Utilizes content scripts for webpage interaction

## Customization

You can customize various aspects of the extension:

- Adjust the `LOADING_DELAY` in `content.js` to change when the loading animation appears.
- Modify the styles in `content.js` to change the appearance of the popup and loading animation.
- Update the summarization parameters in `background.js` to alter the summary length or style.

## Troubleshooting

If you encounter any issues:

1. Ensure your API token is correctly set in `background.js`.
2. Check the console in Chrome DevTools for any error messages.
3. Verify that you have an active internet connection for API calls.

## Contributing

Contributions to improve the extension are welcome. Please feel free to submit pull requests or open issues for bugs and feature requests.


## Acknowledgements

- This project uses the Hugging Face API for text summarization.


---

For any questions or support, please open an issue in this repository.

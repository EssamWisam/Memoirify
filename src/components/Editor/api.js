
import { init, saveSet } from '../../utils';

/**
 * Sends text to a server for processing and retrieves the processed text.
 *
 * @param {string} inputText - The text to be processed.
 * @returns {Promise<string>} The processed text.
 */
export async function processText(inputText) {
    try {
      const response = await fetch(
        'http://127.0.0.1:5001/process_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({
          text: inputText,
        }),
      });
  
      if (!response.ok) throw new Error('Network response was not ok');
  
      const data = await response.json();
      const processedText = data.processed_text;
  
      return processedText;
    } catch (error) {
      console.error('Error:', error);
      throw error; // Re-throw the error to be caught by the caller if needed
    }
  }



  export const handleFileUpload = async (event, setPdfUrl) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5001/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      saveSet(setPdfUrl, 'pdfUrl', `http://127.0.0.1:5001/get_pdf/${data.filename}`);
    } catch (error) {
      console.error('Error uploading PDF:', error);
    }
  };


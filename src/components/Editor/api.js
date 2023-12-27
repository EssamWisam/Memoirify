/**
 * Uploads an image to the server and returns the URL of the uploaded image.
 *
 * @param {File} image - The image file to be uploaded.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
export async function imageUploadHandler(image) {
    // Will work when there is a backend of sorts...
    const formData = new FormData()
    formData.append('image', image)
    // send the file to your server and return 
    // the URL of the uploaded image in the response
    const response = await fetch('./uploads', {
      method: 'POST',
      body: formData
    })
  
    const json = (await response.json())
    alert(json)
    return json.url
  }
  

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





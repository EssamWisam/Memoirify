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
  

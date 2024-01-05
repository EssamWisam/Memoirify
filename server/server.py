from flask import Flask, request, jsonify, send_file
from flask import send_from_directory
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import uuid  
import os

app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['UPLOAD_FOLDER'] = 'uploads'  # Folder to store uploaded images

# check image is valid type
def allowed_file(filename):
    print(filename)
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ['png', 'jpg', 'jpeg', 'gif']

# get random filename in case of collisions
def generate_random_filename(filename):
    random_filename = str(uuid.uuid4()) + secure_filename(filename)
    return random_filename

# Function to handle filename collisions
def handle_filename_collision(filename):
    while os.path.exists(os.path.join(app.config['UPLOAD_FOLDER'], filename)):
        filename = generate_random_filename(filename)
    return filename

# Route to handle image upload
@app.route('/uploads', methods=['POST'])
@cross_origin()
def upload_file():
    # Check if the POST request has the file part
    if 'image' not in request.files:
        return jsonify({'error': 'No file part'})

    file = request.files['image']
    # If the user does not select a file, the browser might
    # submit an empty part without a filename
    if file.filename == '':
        return jsonify({'error': 'No selected file'})

    # Check if the file has an allowed extension
    if file:
        # Secure the filename to prevent malicious attacks
        filename = secure_filename(file.filename)

        # Handle filename collisions
        filename = handle_filename_collision(filename)

        # Save the file to the upload folder with the final filename
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        # Construct the URL for the uploaded image
        uploaded_url = f'/uploads/{filename}'
        # Return the URL in the response
        return jsonify({'url': uploaded_url})
    else:
        return jsonify({'error': 'Invalid file format'})


# route to return an uploaded image
@app.route('/uploads/<filename>')
@cross_origin()
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def allowed_pdf(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['pdf']


# route to upload a PDF
@app.route('/upload', methods=['POST'])
def upload_pdf():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and allowed_pdf(file.filename):
        filename = secure_filename(file.filename)
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        return jsonify({'filename': filename}), 201
    else:
        return jsonify({'error': 'Invalid file type'}), 400


# route to return an uploaded pdf
@app.route('/get_pdf/<filename>')
def get_pdf(filename):
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

    if os.path.exists(filepath):
        return send_file(filepath)
    else:
        return jsonify({'error': 'File not found'}), 404

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['pdf']




from logic import get_sentences, get_bullets_from_sents
@app.route('/process_text', methods=['POST'])
@cross_origin()
def process_text():
    # Get the input text from the POST request
    input_text = request.json.get('text')

    # Check if the 'text' parameter is present in the request
    if input_text is None:
        return jsonify({'error': 'Missing "text" parameter'}), 400

    # Remove white spaces from the input text
    sents = get_sentences(input_text)
    processed_text = get_bullets_from_sents(sents)
    
    # Return the modified text

    return jsonify({'processed_text': processed_text})

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True, port=5001)

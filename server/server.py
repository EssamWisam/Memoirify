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
app.config['ALLOWED_EXTENSIONS'] = {'png', 'jpg', 'jpeg', 'gif', 'pdf'}  # Allowed file extensions


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

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
    if file and allowed_file(file.filename):
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


@app.route('/uploads/<filename>')
@cross_origin()
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

def allowed_pdf(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ['pdf']


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



import string
import nltk
from rake_nltk import Rake
from nltk.tokenize.punkt import PunktSentenceTokenizer, PunktParameters

import re

nltk.download('punkt')  # Download the punkt tokenizer data if not already installed
nltk.download('stopwords')  # Download the punkt tokenizer data if not already installed
rake_nltk_var = Rake()

def get_sentences(paragraph):
    punkt_param = PunktParameters()
    punkt_param.abbrev_types = set(['dr', 'vs', 'mr', 'mrs', 'prof', 'inc', 'eq', 'eqn', 'sec', 'sect', 'et al', 'i.e', 'e.g', 'vs', 'etc', 'fig', 'ref', 'vol', 'cf'])
    sentence_splitter = PunktSentenceTokenizer(punkt_param)
    paragraph = paragraph.replace("\n", " ")
    sentences = sentence_splitter.tokenize(paragraph)
    return sentences

import re

transition_phrases = [
    "additionally",
    "comparatively",
    "in like manner",
    "correspondingly",
    "similarly",
    "equally",
    "in the same way",
    "equally important",
    "like to say nothing of",
    "To this end",
    "likewise",
    "as a matter of fact",
    "furthermore",
    "moreover",
    "identically",
    "not only",
    "uniquely",
    "by the same token",
    "in addition",
    "not to mention",
    "what is more",
    "another key point",
    "important to realize",
    "namely",
    "to clarify",
    "as an illustration",
    "in fact",
    "notably",
    "to demonstrate",
    "in general",
    "to emphasize",
    "in other words",
    "This is to say",
    "This",
    "That",
    "They",
    "Their",
    "Those",
    "These",
    "Its",
    "to enumerate",
    "expressively",
    "in particular",
    "to explain",
    "in this case",
    "significantly",
    "to point out",
    "specifically",
    "to put it another way",
    "for example",
    "indeed",
    "to put it differently",
    "for instance",
    "for one thing",
    "markedly",
    "surprisingly",
    "for this reason",
    "that is to say",
    "to be sure",
    "accordingly",
    "consequently",
    "henceforth",
    "thereupon",
    "as a result",
    "for this reason",
    "in that case",
    "thus",
    "forthwith",
    "therefore",
    "hence",
    "still",
    "be that as it may",
    "in contrast",
    "yet",
    "besides",
    "in spite of",
    "otherwise",
    "after all",
    "conversely",
    "instead",
    "rather",
    "albeit",
    "nevertheless",
    "although",
    "nonetheless",
    "then again",
    "although this may be",
    "even so",
    "notwithstanding",
    "even though",
    "whereas",
    "at the same time",
    "however",
    "on the contrary",
    "in view of",
    "after all",
    "for the most part",
    "in either case",
    "in fact",
    "as has been noted",
    "in brief",
    "in the final analysis",
    "in conclusion",
    "meanwhile",
    "further",
    "next",
    "then",
    "hence",
    "now",
    "henceforth",
    "such a"
]

def correct_hyphenation(text):
    result_string = text.replace('- ', '')
    return result_string

def remove_et_al_pattern(input_string):
    # Remove patterns with "et al" inside parentheses
    pattern_et_al = r'\([^)]*et al[^)]*\)'
    result_string = re.sub(pattern_et_al, '', input_string)

    # Remove spaces before punctuation
    result_string = re.sub(r'\s+([.,;!?])', r'\1', result_string)

    # Replace two or more spaces with one space
    result_string = re.sub(r'\s{2,}', ' ', result_string)

    return result_string


def get_bullet( sentence, level):
    if level == 1:
        bullets_text = "- " + sentence + "\n"
    elif level == 2:
        bullets_text = "  - " + sentence + "\n"
    else:
        bullets_text = "    - " + sentence + "\n"
    return bullets_text


def probably_transition_sentence(sentence, transition_phrases):
    return any(sentence.lower().startswith(phrase.lower()) for phrase in transition_phrases)


def get_bullets_from_sents(sentences, remove_refs=True):
    bullets_text = ""
    init_keywords = []
    prev_keywords = []
    indent_state = 1
    for i, sentence in enumerate(sentences):
        if remove_refs: sentence = remove_et_al_pattern(sentence)
        sentence = correct_hyphenation(sentence)
        colored_sentence, keywords = colorize(sentence)
        if i == 0 : init_keywords = keywords
        overlap_state = get_keyword_overlap(keywords, prev_keywords, init_keywords, i)
        if probably_transition_sentence(sentence, transition_phrases):
            indent_state = 3 if indent_state > 1 else 2
        elif overlap_state == 'previous':
            indent_state = 3 if indent_state == 3 else 2
        elif overlap_state == 'initial':
            indent_state = 2
        else:
            indent_state = 1
            init_keywords = keywords
        if len(sentences) == 2:
            indent_state = 1
        
        bullets_text += get_bullet(colored_sentence, indent_state)
    return bullets_text

def get_keyword_overlap(keywords, prev_keywords, init_keywords, i):
    split_prev_keywords = [word.lower() for keyword in prev_keywords for word in keyword.split()]
    split_init_keywords = [word.lower() for keyword in init_keywords for word in keyword.split()]
    split_keywords = [word.lower() for keyword in keywords for word in keyword.split()]

    # Check the condition
    if any(word in split_prev_keywords for word in split_keywords):
        return 'previous'
    elif i > 0 and any(word in split_init_keywords for word in split_keywords):
        return 'initial'
    else:
        return 'none'




def colorize(sentence, classes=["color-1", "color-2", "color-3", "color-4"]):
    #sentence = sentence.strip().lstrip(string.punctuation).strip()
    keywords_extracted = get_keywords(sentence)
    for i, keyword in enumerate(keywords_extracted):
        if keyword.casefold() in sentence.casefold():
            pattern = re.compile(rf'\b{re.escape(keyword)}\b(?!=)', flags=re.IGNORECASE)
            sentence = re.sub(pattern, lambda match: f"<span class='{classes[(i+1) % 4]}'>{match.group()}</span>", sentence)
    return sentence, keywords_extracted

def get_keywords(sentence):
    rake_nltk_var.extract_keywords_from_text(sentence)
    keywords_extracted = rake_nltk_var.get_ranked_phrases()
    keywords_extracted.sort(key=lambda x: sentence.lower().find(x))
    
   # Create a pattern to match any word that has a hyphen in it
    pattern = re.compile(r"\b\w+-\w+\b")
    words_with_hyphen = pattern.findall(sentence)
    for i, keyword in enumerate(keywords_extracted):                                   
        for word in words_with_hyphen:
            for single_keyword in keyword.split(" "):
                if single_keyword in word:
                    keywords_extracted[i] = word
    
    return list(set([keyword for keyword in keywords_extracted if len(keyword) > 1 and all(char not in string.punctuation for char in keyword)]))


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

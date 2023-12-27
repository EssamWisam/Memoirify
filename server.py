from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin


app = Flask(__name__)
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

import string
import nltk
from rake_nltk import Rake
import re

nltk.download('punkt')  # Download the punkt tokenizer data if not already installed
nltk.download('stopwords')  # Download the punkt tokenizer data if not already installed
rake_nltk_var = Rake()

def get_sentences(paragraph):
    paragraph = paragraph.replace("\n", " ")
    sentences = nltk.sent_tokenize(paragraph)
    return sentences

def get_bullets_from_sents(sentences):
    bullets_text = ""
    for sentence in sentences:
        sentence = colorize(sentence)
        bullets_text += "- " + sentence + "\n"
    return bullets_text

def colorize(sentence, classes=["color-1", "color-2", "color-3", "color-4"]):
    sentence = sentence.strip().lstrip(string.punctuation).strip()
    keywords_extracted = get_keywords(sentence)
    for i, keyword in enumerate(keywords_extracted):
        if keyword.casefold() in sentence.casefold():
            pattern = re.compile(rf'\b{re.escape(keyword)}\b(?!=)', flags=re.IGNORECASE)
            sentence = re.sub(pattern, lambda match: f"<span class='{classes[(i+1) % 4]}'>{match.group()}</span>", sentence)
    return sentence

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
    
    return list(set(keywords_extracted))


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

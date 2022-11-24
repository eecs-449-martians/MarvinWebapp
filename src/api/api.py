from fileinput import filename
import time
import flask
import json
import os
import shutil
import requests
from pathlib import Path
from urllib.parse import urlparse

app = flask.Flask(__name__)

messages = [] # contains message --> [message_type (0: from_user, 1: from_marvin, 2: placeholder), content]

@app.route('/reset')
def reset_app():
    folder = "../pdf_uploads/"
    for filename in os.listdir(folder):
        curr_file = os.path.join(folder, filename)
        try:
            os.unlink(curr_file)
        except Exception as e:
            print('Failed to delete %s. Reason: %s' % (curr_file, e))
    message = "All files successfully deleted"
    return {"message": message}

@app.route('/upload', methods=["POST"])
def upload_pdfs():
    fileobj = flask.request.files["File"]

    # Make sure file is a .pdf
    if not fileobj.filename.endswith(".pdf"):
        return "ERROR"

    # Make sure the file doesnt already exist
    folder = "../pdf_uploads/"
    if (not os.path.exists(Path(folder))):
        os.mkdir(Path(folder))
    if fileobj.filename in os.listdir(folder):
        message = "'" + fileobj.filename + "' is already uploaded"
        return {"message": message, "already_exists": True}
    
    path = Path("../pdf_uploads/" + fileobj.filename)
    fileobj.save(path)
    message = "'" + fileobj.filename + "' was uploaded successfully"
    return {"message": message, "already_exists": False}

@app.route('/get_files')
def get_files():
    json_string = "{\n\"data\": [ "
    folder = os.getcwd() + "/../pdf_uploads/"
    index = 0
    num_files = len(os.listdir(folder))
    for filename in os.listdir(folder):

        #curr_file = "file://" + folder + filename
        curr_file = folder + filename
        json_string += "\n\t{ "
        json_string += "\n\t\t\"file\": { \"name\": \"" + filename + "\", \"url\": \"" + curr_file + "\" }, "
        json_string += "\n\t\t\"index\": \"" + str(index) + "\""
        json_string += "\n\t}"
        if index < num_files - 1:
            json_string += ","
        index += 1
    json_string += "\n]\n}"
    json_object = json.loads(json_string)

    # here I call the pdf api for each .pdf file uploaded.
    # THIS MAY OR MAY NOT BE THE ENPOINT WE WANT TO DO THIS IN, DEPENDING ON IMPLEMENTATION OF CHATBOT LOGIC so the rest of the function is subject to move. 
    pdf_texts = []
    for i in range(len(json_object['data'])):
        query = {'url': json_object['data'][i]['file']['url']}
        pdf_texts.append(requests.post("http://localhost:8001/pdf/to_text/", params=query))

    # here I call the nlp api for each text version of the given files to get question and answers.
    # NOTE: this may or not be correct, I am having trouble testing the nlp flask server 
    # basically this gives a json object of question and answers
    nlp = []
    questions = []
    answers = []
    qas = []
    # untested -> Josh changed query to work with NLP
    for text in pdf_texts:
        rq_body = {"text": text}
        r = requests.post("http://localhost:8000/nlp/genqa/", json=rq_body)
        qas.append(r["qas"])
    
    for qa_pair in qas:
        questions.append(qa_pair["question"])
        answers.append(qa_pair["answer"])
    nlp["questions"] = questions
    nlp["answers"] = answers
    nlp["qas"] = qas
    return flask.jsonify(nlp)

@app.route('/remove_file', methods=["POST"])
def remove_files():
    file_name = flask.request.form['filename']

    folder = "../pdf_uploads/"
    curr_file = os.path.join(folder, file_name)
    try:
        os.unlink(curr_file)
    except Exception as e:
        print('Failed to delete %s. Reason: %s' % (curr_file, e))

    message = "'" + file_name + "' was deleted successfully"
    return {"message": message}

@app.route('/get_messages')
def get_messages():
    all_padding = len(messages) == 0
    index = 0
    padded_messages = messages.copy()
    while (len(padded_messages) < 10):
        padded_messages.append([2, "-"])
    num_messages = len(padded_messages)
    json_string = "{\n\"messages\": [ "
    for message in padded_messages:
        json_string += "\n\t{ "
        json_string += "\n\t\t\"message\": { \"message_type\": \"" + str(message[0]) + "\", \"content\": \"" + message[1] + "\" } "
        json_string += "\n\t}"
        if index < num_messages - 1:
            json_string += ","
        index += 1

    json_string += "\n],"
    json_string += "\n\"all_padding\": " + str(all_padding).lower() + ","

    last_user = 0
    if (len(messages) > 0):
        last_user = messages[-1][0]
    json_string += "\n\"last_message_from_user\": " + str(last_user == 0).lower() + "\n}"
    json_object = json.loads(json_string)
    return json_object

@app.route('/to_marvin', methods=["POST"])
def to_marvin():
    content = flask.request.form['content']
    messages.append([0, content]) 
    # make api call to conv engine

    response_message = "Message sent to Marvin successfully"
    return {"message": response_message}

@app.route('/to_user', methods=["POST"])
def to_user():
    content = flask.request.form['content']
    messages.append([1, content])

    response_message = "Message sent to User successfully"
    return {"message": response_message}

@app.route('/clear_messages')
def clear_messages():
    messages.clear()
    message = "All messages cleared"
    return {"message": message}
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
CHATBOT_CALL = "curl -X POST http://localhost:8003/chatbot/chat  -H 'Content-Type: application/json' -d '{}' > {}"

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
    print(f"     {path}")
    fileobj.save(path)
    print("Just saved with name:", fileobj.filename)
    filename = fileobj.filename
    url = path
    json_payload ={'url': str(url), 'filename': str(filename)}
    fileobj.close()

    print('sending request')
    r = requests.post('http://127.0.0.1:8002/orch/upload_file', json=json_payload)
    print('gettting request')

    if not r.json()['Success']:
        return {"message": f"Error processing file {fileobj.filename}", "already_exists": False}
    message = "'" + fileobj.filename + "' was uploaded successfully"
    return {"message": message, "already_exists": False}

@app.route('/get_files')
def get_files():
    json_string = "{\n\"data\": [ "
    folder = os.getcwd() + "/../pdf_uploads/"
    index = 0
    num_files = len(os.listdir(folder))
    for filename in os.listdir(folder):
        curr_file = "file://" + folder + filename
        curr_file = folder + filename
        json_string += "\n\t{ "
        json_string += "\n\t\t\"file\": { \"name\": \"" + filename + "\", \"url\": \"" + curr_file + "\" }, "
        json_string += "\n\t\t\"index\": \"" + str(index) + "\""
        json_string += "\n\t}"
        if index < num_files - 1:
            json_string += ","
        index += 1
    json_string += "\n]\n}"
    print(json_string)
    json_object = json.loads(json_string)

    
    return flask.jsonify(json_object)

@app.route('/remove_file', methods=["POST"])
def remove_files():
    file_name = flask.request.form['filename']

    #TODO: send matching file delete request to

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
    # index = 0
    padded_messages = messages.copy()
    while (len(padded_messages) < 10):
        padded_messages.append([2, "-"])
    # num_messages = len(padded_messages)
    # json_string = "{\n\"messages\": [ "
    json_messages = []
    for message in padded_messages:
        message_conts = {"message":{"message_type":str(message[0]), "content": message[1] } }
        # json_string += "\n\t{ "
        # json_string += "\n\t\t\"message\": { \"message_type\": \"" + str(message[0]) + "\", \"content\": \"" + message[1] + "\" } "
        # json_string += "\n\t}"
        # if index < num_messages - 1:
        #     json_string += ","
        # index += 1
        json_messages.append(message_conts)
    
    

    # json_string += "\n],"
    # json_string += "\n\"all_padding\": " + str(all_padding).lower() + ","

    last_user = 0
    if (len(messages) > 0):
        last_user = messages[-1][0]
    # json_string += "\n\"last_message_from_user\": " + str(last_user == 0).lower() + "\n}"
    return flask.jsonify(messages=json_messages,all_padding=str(all_padding).lower(), last_message_from_user=str(last_user==0).lower())

# {
# "messages": [ 
# 	{ 
# 		"message": { "message_type": "1", "content": "This course will have a large team-based project that will require designing and building a virtual  assistant. All students are required to observe the Engineering  Honor Code in all assignments and exams.
 
#  Would you like the full passage instead of just a summarization?" } 
# 	}
# ],
# "all_padding": false,
# "last_message_from_user": false
# }


@app.route('/to_marvin', methods=["POST"])
def to_marvin():
    content = flask.request.form['content']
    messages.append([0, content]) 

    # make api call to conv engine
    # json_string = json.dumps({'text': content})
    r = requests.post('http://127.0.0.1:8003/chatbot/chat', json={'text': content})
    print(r)
    response_text = r.json()['text']

    # Append returned response to messages
    messages.append([1, response_text])

    #response_message = "Message sent to Marvin successfully"
    return {"message": response_text}

# @app.route('/to_user', methods=["POST"])
# def to_user(content):
#     #content = flask.request.form['content']
#     messages.append([1, content])

#     #MY STUFF
#     query = {'text': content}
#     r = requests.post("http://localhost:8003/chatbot/chat", json=query)
#     response_message = r.json()['text']
#     return {"message": response_message}

@app.route('/clear_messages')
def clear_messages():
    messages.clear()
    message = "All messages cleared"
    return {"message": message}
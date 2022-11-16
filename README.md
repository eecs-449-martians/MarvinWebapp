# Professor Marvin Web App

- This is the code for Professor Marvin's web app - EECS 449 (Conversational AI) @ University of Michigan
- For optimal experience, please use the web app on the **Google Chrome Browser at 80% zoom**
- Code developed by Arjav Patel (@apatel66) as part of The Martians team

## *Run The App*
1. Download / Clone the repo
2. Navigate into the directory in **two** terminals
3. On one terminal run the command `yarn start-api`
    - Triggers script to start the Flask API used by the web app
4. On the other terminal, run the command `yarn start`
    - Triggers script to compile and run the React web app
5. You will probably need to download the necessary React and Flask dependencies

## *Ports*
- The web app runs on [http://localhost:3000](http://localhost:3000). Open it to view in your browser
- The Flask API runs in the background on [http://localhost:5000](http://localhost:5000)

## *Flask API*
- External Endpoints (Other components should use)
    - `/to_user`
        - Save a message in the list (Marvin --> User)
        - Recieves
            - Filename in the form of `flask.request.files["content"]`
        - Returns
            - `{"message": ...}`
            - Either success or failure message
- Internal Endpoints (Only web app should use)
    - `/reset`
        - Deletes all the files saved in the `../pdf_uploads/` directory
        - Recieves
            - `Nothing (GET Endpoint)`
        - Returns
            - `{"message": ...}`
            - Either success or failure message
    - `/upload`
        - Saves a file to the `../pdf_uploads/` directory
        - Recieves
            - Filename in the form of `flask.request.files["File"]`
        - Returns
            - `{"message": ..., "already_exists": ...}`
            - Either success or failure message and whether or not the file was already in the directory
    - `/get_files`
        - Returns all the files currently in the `../pdf_uploads/` directory
        - Recieves
            - `Nothing (GET Endpoint)`
        - Returns
            - `{"data": [
                  {
                    "file": {"name": ..., "url": ...},
                    "index: ...
                  },
                  ...
                ]}`
            - List of JSON objects, each containing a filename, file_url, and index
    - `/remove_file`
        - Remove a particular file from the `../pdf_uploads/` directory
        - Recieves
            - Filename in the form of `flask.request.files["File"]`
        - Returns
            - `{"message": ...}`
            - Either success or failure message
    - `/get_messages`
        - Gets all messages saved in the list
        - Appends blank messages if not enough already (makes table look nice)
            - `{"messages": [
                  {
                    "message": {"message_type": ..., "content": ...}
                  },
                  ...],
                 "all_padding:" ...,
                 "last_message_from_user:" ...
               }`
            - List of JSON objects, each containing who sent the message (user --> 0, Marvin --> 1, padding --> 2) and what the message contains
            - Also contains whether the list is all padding messages and if the last message is from the user (used to disable the `Send` button)
    - `/to_marvin`
        - Save a message in the list (User --> Marvin)
        - Also makes POST Request to whichever endpoint is recieving messages from the user `**NOT IMPLEMENTED YET!!!**`
        - Recieves
            - Filename in the form of `flask.request.files["content"]`
        - Returns
            - `{"message": ...}`
            - Either success or failure message
    - `/clear_messages`
        - Deletes all messages in the list
        - Recieves
            - `Nothing (GET Endpoint)`
        - Returns
            - `{"message": ...}`
            - Either success or failure message

## *The Web App*
- `About`
    - Contains information about the project and developers
    - Includes links to the various presentations given throughout the semester along with this repository
    - Each developer has a section contianing a picture, role, and connect button, which navigates to their LinkedIn
- `Chat`
    - This is the page where the user converses with Professor Marvin
    - Only accessible from the `Upload` page
    - Includes the `Marvin` component, which is the actual interface
- `Footer`
    - Black bar at the bottom of every page
    - Contains a small copyright symbol to make the web app seem authentic
- `Home`
     - Landing page the user page sees when booting up the web app
     - The component fades in upon mounting
     - Links to the `Upload` and `Instructions` pages
- `Instructions`
    - Contians a list of pictures and text to teach a new user how to use Professor Marvin
    - Links to the `Upload` page once the user finished reading all the instructions
- `Marvin`
    - The interface for the user to talk to Professor Marvin
    - Grey bubbles (Professor Marvin), blue bubbles (User)
    - Text area to type messages
    - Send button (can also press Enter)
        - Disabled if Professor Marvin has not sent a message yet
    - Clear button
        - Disable if there are no messages (mainly for development purposes)
    - The page checks for new messages every second and automatically scrolls to the bottom if it detected one
    - Links to the `Uplaod` page so users can edit their suite of PDF files
- `Navigation`
    - Black bar at the top of every page
    - User utilizes it to navigate to different pages
        - `Chat` is intentionally left off to force the user to access it from the `Upload` page
    - The page the user is currently on is highlighted
- `Upload`
    - This is the page where the user inputs their suite of PDF files
    - Includes the `UploadFiles` component, which is the actual interface
- `UploadFiles`
    - Drag and Drop area (or click to search locally) to upload PDF files
    - Progress Bar to see status of the upload
    - Upload button to actually save the file locally
        - Disabled if no file selected
        - Throws error if not a PDF file or the file is already included
    - List of the saved files
        - Each file has a button next to it to remove it from the suite
    - Delete All button to remove all files at once
        - Disabled if there are no files
    - Links to the `Chat` page
        - Disabled if there are no files saved
        - Should make POST/GET request to API for Marvin to be trained on the PDF suite `**NOT IMPLEMENTED YET!!!**`
- `UploadFiles.service`
    - Handles the GET and POST requests to the Flask API
        - Upload a file
        - Remove a file
        - Get all files
        - Remove all files
        - Send a message
        - Get all messages
        - Clear all messages

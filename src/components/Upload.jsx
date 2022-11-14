import React from "react";
import UploadFiles from "./UploadFiles";

class Upload extends React.Component {
  DragDropFile() {
    return (
      <form id="form-file-upload">
        <input type="file" id="input-file-upload" multiple={true} />
        <label id="label-file-upload" htmlFor="input-file-upload">
          <div>
            <p>Drag and drop your file here or</p>
            <button className="upload-button">Upload a file</button>
          </div> 
        </label>
      </form>
    );
  };

  render() {
    return (
      <div className="about">
        <div className="container">
          <div className="align-items-center my-5">
            <div className="">
              <h1>Upload</h1>
              <p>
                Upload .pdf files in this page
              </p>
              <UploadFiles></UploadFiles>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Upload;

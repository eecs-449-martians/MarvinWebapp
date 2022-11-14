import React, { Component } from "react";
import Dropzone from "react-dropzone";
import './UploadFiles.css';
import UploadService from "./services/upload-files.service";

export default class UploadFiles extends Component {
    constructor(props) {
        super(props);    
        this.state = {
          selectedFiles: undefined,
          currentFile: undefined,
          progress: 0,
          delay: 0,
          message: "",
    
          fileInfos: [],
        };
      }

    delay = ms => new Promise(res => setTimeout(res, ms));

    onDrop = (files) => {
        if (files.length > 0) {
          this.setState({ selectedFiles: files });
        }
    }
    componentDidMount = () => {
        UploadService.getFiles().then((files) => {
          this.setState({
            fileInfos: files.data['data'],
          });
        });
    }

    upload = async () => {
        let currentFile = this.state.selectedFiles[0];

        this.setState({
          progress: 0,
          currentFile: currentFile,
        });
        
        await UploadService.upload(currentFile)
          .then((response) => {
            this.setState({
              message: response.message,
            });

            if (response.already_exists) {
              this.setState({
                delay: 0,
                progress: 0
              });
            }
            else {
              this.setState({
                delay: 500,
                progress: 100
              });
            }

            return UploadService.getFiles();
          })
          .then((files) => {
            this.setState({
              fileInfos: files.data['data'],
            });
            
          })
          .catch(() => {
            console.log('failed');
            this.setState({
              progress: 0,
              delay: 0,
              message: "ERROR: File is not a PDF",
              currentFile: undefined,
            });
          });

        await this.delay(this.state.delay);
        this.setState({
          selectedFiles: undefined,
          progress: 0,
        });
    }

    removeFile = async (filename) => {     
      await UploadService.removeFile(filename)
        .then((response) => {
          this.setState({
            message: response.message,
          });
          return UploadService.getFiles();
        })
        .then((files) => {
          this.setState({
            fileInfos: files.data['data'],
          });
        })
        .catch(() => {
          this.setState({
            message: "ERROR: File unable to be deleted",
          });
        });
    }

    deleteAll = async () => {
      await UploadService.resetApp()
        .then((response) => {
          this.setState({
            message: response.message,
          });
          return UploadService.getFiles();
        })
        .then((files) => {
          this.setState({
            fileInfos: files.data['data'],
          });
        })
        .catch(() => {
          this.setState({
            message: "ERROR: Unable to delete all files",
          });
        });
    }

    render() {
        const { selectedFiles, currentFile, progress, message, fileInfos } = this.state;
    
        return (
          <div>
            {currentFile && (
              <div className="progress mb-3">
                <div
                  className="progress-bar progress-bar-info progress-bar-striped"
                  role="progressbar"
                  aria-valuenow={progress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                  style={{ width: progress + "%" }}
                >
                  {progress}%
                </div>
              </div>
            )}
    
            <Dropzone onDrop={this.onDrop} multiple={false}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps({ className: "dropzone" })}>
                    <input {...getInputProps()} />
                    {selectedFiles && selectedFiles[0].name ? (
                      <div className="selected-file">
                        {selectedFiles && selectedFiles[0].name}
                      </div>
                    ) : (
                      "Drag and drop file here, or click to select file"
                    )}
                  </div>
                  <aside className="selected-file-wrapper">
                    <button
                      className="btn btn-success"
                      disabled={!selectedFiles}
                      onClick={this.upload}>
                      Upload
                    </button>
                  </aside>
                </section>
              )}
            </Dropzone>
    
            <div className="alert alert-light" role="alert">
              {message}
            </div>
            
            {fileInfos.length > 0 && (
              <div className="card">
                <div className="card-header">List of Uploaded Files</div>
                <ul className="list-group list-group-flush">
                  {fileInfos.map((currFile) => (
                    <li className="list-group-item" key={currFile.index}>
                      <div>
                        <a className="card-text-big" href={/*require("./../pdf_uploads/"+currFile.file.name)*/"/static/media/"+currFile.file.name} target="_blank" rel="noreferrer">{currFile.file.name}</a>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <button className="btn btn-delete" onClick={async () => {await this.removeFile(currFile.file.name);}}>Remove</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <aside className="selected-file-wrapper">
              <br></br>
              <button 
                className="btn btn-delete-all"
                disabled={this.state.fileInfos.length === 0}
                onClick={this.deleteAll}>
                Delete All Files
              </button>
            </aside>

            <aside>
              <br></br>
              <a href="/chat">
                <button 
                  className="btn btn-go-to-chat"
                  disabled={this.state.fileInfos.length === 0}>
                  Get Studying &gt;
                </button>
              </a>
            </aside>
            <br></br>
            <br></br>
          </div>
        );
    }    
}
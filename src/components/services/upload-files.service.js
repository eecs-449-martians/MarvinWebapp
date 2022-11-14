import http from "./http-common.js";

class UploadFilesService {
  upload = async (file) => {
    let formData = new FormData();

    formData.append('File', file);

    let response = await fetch('/upload',
      {
        method: 'post',
        body: formData,
      },
    );
    let res = await response.json();

    return res;
  }

  removeFile = async (filename) => {
    let formData = new FormData();
    formData.append('filename', filename);

    let response = await fetch('/remove_file',
      {
        method: 'post',
        body: formData,
      },
    );
    let res = await response.json();
    return res;
  }

  resetApp = async () => {
    let response = await fetch('/reset',
      {
        method: 'get',
      },
    );
    let res = await response.json();
    return res;
  }

  getFiles() {
    return http.get("/get_files");
  }

  sendMessage = async (content) => {
    let formData = new FormData();
    formData.append('content', content);

    let response = await fetch('/to_marvin',
      {
        method: 'post',
        body: formData,
      },
    );
    let res = await response.json();

    return res;
  }

  clearMessages = async () => {
    let response = await fetch('/clear_messages',
      {
        method: 'get',
      },
    );
    let res = await response.json();
    return res;
  }

  getMessages() {
    return http.get("/get_messages");
  }
}

export default new UploadFilesService();
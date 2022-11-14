import React, { Component } from "react";
import './Marvin.css';
import UploadService from "./services/upload-files.service";

export default class ProfessorMarvin extends Component {
    constructor(props) {
        super(props);    
        this.state = {
          selectedFiles: undefined,
          currentFile: undefined,
          progress: 0,
          delay: 0,
          messages: [],
          disable_clear: false,
          disable_send: false,
          user_message: 'Type a message...'
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.bottomRef = React.createRef();
        this.executeScroll = () => {this.bottomRef.current.scrollIntoView()};
      }

    delay = ms => new Promise(res => setTimeout(res, ms));

    componentDidMount = async () => {
        UploadService.getMessages().then((message_list) => {
          this.setState({
            messages: message_list.data['messages'],
            disable_clear: message_list.data['all_padding'] === true,
            disable_send: message_list.data['last_message_from_user'] === true,
          });
        });
        await this.delay(50);
        this.listenForMessages();
    }

    listenForMessages = async () => {
      while(true) {
        var last_num_messages = 0;
        if (this.state.messages) {
          last_num_messages = this.state.messages.length;
        }

        await UploadService.getMessages()
        .then((message_list) => {
          this.setState({
            messages: message_list.data['messages'],
            disable_clear: message_list.data['all_padding'] === true,
            disable_send: message_list.data['last_message_from_user'] === true,
          });
        })
        .catch(() => {
          this.setState({
            message: "ERROR: Could not fetch messages",
          });
        });
        await this.delay(50);

        var curr_num_messages = 0;
        if (this.state.messages) {
          curr_num_messages = this.state.messages.length;
        }

        if (curr_num_messages > last_num_messages) {
          this.executeScroll();
        }
        await this.delay(1000);
      }
    }

    clearMessages = async (event) => {
      event.preventDefault(); 
      await UploadService.clearMessages()
        .then((response) => {
          this.setState({
            message: response.message,
          });
          return UploadService.getMessages();
        })
        .then((message_list) => {
          this.setState({
            messages: message_list.data['messages'],
            disable_clear: message_list.data['all_padding'] === true,
            disable_send: message_list.data['last_message_from_user'] === true,
          });
        })
        .catch(() => {
          this.setState({
            message: "ERROR: Unable to delete all messages",
          });
        });
    }

    handleChange(event) {
      this.setState({user_message: event.target.value});
    }
  
    handleSubmit = async (event) => {
      event.preventDefault(); 
      await UploadService.sendMessage(this.state.user_message)
      .then((response) => {
      })
      .catch(() => {
        this.setState({
          message: "ERROR: Unable to send message to Professor Marvin",
        });
      });

      var getValue= document.getElementById("message-field");
      if (getValue.value !== "") {
          getValue.value = "";
          this.setState({user_message: ""});
      }
    }



    render() {    
        const { messages } = this.state;
        return (
          <div>
            
            <aside>
              <div className="card message-box">
                <table className="table-border">
                  <thead className="header">
                    <tr key="header"><td colSpan="3" >&nbsp;&nbsp;&nbsp;Professor Marvin</td></tr>
                  </thead>
                  <tbody className="body">
                    {messages.map((currMessage, index) => (
                        (currMessage.message.message_type === "0") ?
                          <tr key={index}><td><div className="placeholder"></div></td><td><div className="box-user">{currMessage.message.content}</div></td></tr>
                        :
                          (currMessage.message.message_type === "1") ?
                            <tr key={index}><td><div className="box-marvin">{currMessage.message.content}</div></td><td><div className="placeholder"></div></td></tr>
                          :
                            <tr key={index}><td><div className="placeholder">{currMessage.message.content}</div></td><td><div className="placeholder">{currMessage.message.content}</div></td></tr>
                    ))}
                  </tbody>
                </table>
                <div ref={this.bottomRef}/>
              </div>
            </aside>

            <aside>
              <div>
                <form className="messages-input-div">
                  <input onChange={this.handleChange} placeholder="Type a message..."  id="message-field" className="messages-input-field" type="text"/>‍
                  <button onClick={this.handleSubmit} className="messages-input-button" disabled={this.state.disable_send}>Send!</button>
                  <button onClick={this.clearMessages} className="btn btn-clear" disabled={this.state.disable_clear} >Clear</button>
                </form>
              </div>
            </aside>


            <aside>
              <br></br>
              <a href="/upload_page">
                <button 
                  className="btn btn-go-to-upload">
                  &lt; Edit Files
                </button>
              </a>
            </aside>
          </div>
        );
    }    
}
import React from "react";
import './Instructions.css';
import instruction_1 from './images/navigate.jpg'
import instruction_2 from './images/drag_drop.jpg'
import instruction_3 from './images/get_studying.jpg'
import instruction_4 from './images/chat.jpg'
import instruction_5 from './images/clear_chat.jpg'
import instruction_6 from './images/edit_files.jpg'

function single_instruction(caption, picture, pic_name){
  return (
    <div>
      <li className="list-entry">{caption}</li>
      <img className="instruction-pic" src={picture} alt={pic_name}></img>
      <br></br>
    </div>
  );
}

function Instructions() {
  return (
    <div className="contact">
      <div className="container">
        <div className="align-items-center my-5">
          <div className="">
            <h1>Instructions</h1>
              <p>
                Learn how to use Professor Marvin
              </p>
              <ol>
                {single_instruction("Navigate to the upload page", instruction_1, "Instruction_1")}
                {single_instruction("Drag, drop, and delete .pdf files as needed<", instruction_2, "Instruction_2")}
                {single_instruction("Provide at least 1 file and press 'Get Studying'", instruction_3, "Instruction_3")}
                {single_instruction("Chat with Professor Marvin. Ask him questions or answer his questions", instruction_4, "Instruction_4")}
                {single_instruction("Delete messages with the 'Clear Chat' Button", instruction_5, "Instruction_5")}
                {single_instruction("Change files by clicking 'Edit Files'", instruction_6, "Instruction_6")}
              </ol>
              <form className="center btn-padding" action="/upload_page">
                <button className="btn btn-go-to-upload-from-instructions" type="submit">Ready To Get Started?</button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instructions;

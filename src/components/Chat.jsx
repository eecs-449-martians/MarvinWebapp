import React from "react";
import ProfessorMarvin from "./Marvin.jsx";

function Chat() {
  return (
    <div className="chat">
      <div className="container">
        <div className="my-5">
          <div className="">
            <h1>Chat</h1>
            <p>
              Chat with Professor Marvin as if he's your personal tutor
            </p>
            <ProfessorMarvin></ProfessorMarvin>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;

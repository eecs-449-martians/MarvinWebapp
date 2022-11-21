import React from "react";
import './About.css';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import project_pitch from "./static_files/project_pitch.pdf";
import midpoint_update from "./static_files/midpoint_update.pdf";
import final_presentation from "./static_files/midpoint_update.pdf";
import zach from "./images/zach.jpg";
import ray from "./images/arjav.jpg";
import connor from "./images/arjav.jpg";
import joe from "./images/arjav.jpg";
import alex from "./images/alex.jpg";
import arjav from "./images/arjav.jpg";
import josh from "./images/josh.jpg";

function person(name, pic, role, link) {
  return (
    <td className="check-table">
      <Card style={{ width: '80%', borderRadius: '8%' }}>
        <Card.Img style={{ borderTopRightRadius: '8%', borderTopLeftRadius: '8%' }} src={pic} />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Text>
            {role}
          </Card.Text>
          <a href={link} target="_blank"><Button className="connect-btn" variant="primary">Connect</Button></a>
        </Card.Body>
      </Card>
    </td>
  );
}

function About() {
  return (
    <div className="about">
      <div className="container">
        <div className="row align-items-center my-5">
          <div>
            <h1>About</h1>
            <p>
              Frustrated with the inefficiencies of conventional studying, we created Professor Marvin to automate parts of the process
              <br></br>
              Professor Marvin was developed for EECS 449 (Conversational AI) @ The University of Michigan
            </p>
            <br></br>
            <section>
              <h4 style={{ fontWeight: '600' }}>
                Click on the links below to see how the project evolved over the semester
              </h4>
              <ul>
                <li><a className="list-entry" href={project_pitch} target="_blank">Project Pitch</a></li>
                <li><a className="list-entry" href={midpoint_update} target="_blank">Midpoint Update</a></li>
                <li><a className="list-entry" href={final_presentation} target="_blank">Final Presentation</a></li>
                <li><a className="list-entry" href="https://github.com/eecs-449-martians/ProfessorMarvin" target="_blank">GitHub Repo</a></li>
              </ul>
            </section>
            <br></br>
            <h4 style={{ fontWeight: '600' }}>
              Meet the <s style={{ textDecorationLine: 'line-through', textDecorationThickness: '14%' }}>Creators</s> Martians
            </h4>
            <table>
              <tbody>
                <tr>
                  {person("Zach Eichenberger", zach, "PDF Extraction", "https://www.linkedin.com/in/zachary-eichenberger")}
                  {person("Ray Jin", ray, "Front-End Developer", "https://www.linkedin.com/in/arjavpa/")}
                  {person("Connor Landay", connor, "Front-End Developer", "https://www.linkedin.com/in/arjavpa/")}
                  {person("Joe Massa", joe, "Front-End Developer", "https://www.linkedin.com/in/arjavpa/")}
                </tr>
                <tr>
                  {person("Alex Pakkala", alex, "Orchestrator", "https://www.linkedin.com/in/alexander-pakkala-7934911b6/")}
                  {person("Arjav Patel", arjav, "Front-End and UI", "https://www.linkedin.com/in/arjavpa/")}
                  {person("Josh Silverberg", josh, "NLP", "https://www.linkedin.com/in/joshua-silverberg/")}
                </tr>
              </tbody>
            </table>

          </div>
        </div>
      </div>
    </div>
  );
}

export default About;

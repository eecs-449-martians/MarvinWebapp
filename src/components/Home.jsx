import React, { Component } from "react";
import './Home.css';
import marvin_logo from './images/marvin_logo.png'

export default class Home extends Component{

  delay = ms => new Promise(res => setTimeout(res, ms));

  async componentDidMount() {
    let el = document.querySelector('.home');
    el.classList.remove('landing-page');
    el.classList.remove('fade-in');
    await this.delay(200);
    el.classList.add('landing-page');
    el.classList.add('fade-in');
  }

  render() {
    return (
      <div className="home">
        <div className="container">
          <div className="my-5">
            <h1 className="title-text">Meet Professor Marvin - Your New Private Tutor!</h1>
            <h5 className="sub-text">EECS 449 Final Project - The Martians</h5>
            <br></br>
            <img className="logo" src={marvin_logo} alt="Marvin Logo"></img>
            <br></br>
            <p className="sub-text">Simply upload some files and get ready to study!</p>
            <br></br>
            <form className="center btn-padding" action="/upload_page">
              <button className="btn btn-go-to-upload-from-start" type="submit">Get Started!</button>
            </form>
            <form className="center btn-padding" action="/instructions">
              <button className="btn btn-go-to-upload-from-start" type="submit">Read Instructions</button>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

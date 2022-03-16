import React from 'react';
import ReactDOM, { render } from 'react-dom';
import App from '../App';
import reportWebVitals from '../reportWebVitals';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    useNavigate
  } from "react-router-dom";
import DisplayRecommendations from './DisplayRecommendations.jsx';
import './SignUp.css';
import { Component } from 'react';
  

  
 const SignUp = () => {


    const navigate = useNavigate();

    const handleSubmit = () => {
       navigate("/test");
    }

    const handleChange = ({target}) => {
        this.setState({
            userInput: target.value
        })
    }


    return (
            <>
            <div>
                <ul>
                    <li>Song Search</li>
                </ul>
            </div>
            <div class="center">
                <form >

                    <input
                        placeholder='Please input your email'
                        type="text" 
                        name="usernsame"
                        onChange={handleChange}
                    />
                </form>
            </div>
            <div>
                <button onClick={handleSubmit}> Submit</button>
            </div>
        </>
    )

  }

  export default SignUp;
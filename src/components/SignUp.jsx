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
import DisplayRecommendations from './DisplayRecommendations';
  

  
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
            <form>

                <input
                    placeholder='Please input your email'
                    type="text" 
                    name="usernsame"
                    onChange={handleChange}
                />
            </form><button onClick={handleSubmit}> Submit</button>
        </>
    )

  }

  export default SignUp;
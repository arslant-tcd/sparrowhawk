import React, { useState } from "react";
import {
    useNavigate
  } from "react-router-dom";
import './SignUp.css';
import axios from "axios";
  
  
 const SignUp = () => {

    const [email, setEmail] = useState("");

    const addUser = async (userInput) => {

        axios
        .post("http://127.0.0.1:5000/addUser", {"email": userInput})
        .then(res => {
        if(res.data['status code'] === "200"){
            console.log(userInput)
        }
        }).catch((error) => {
        //this.setState({errorMessage: error.message})
            console.log(userInput)
        });
        
    }

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        console.log({email})
        addUser({email});
        navigate("/test");
    }


    
    return (
            <>
            <div>
                <ul>
                    <li>Song Search</li>
                </ul>
            </div>
            <div className="center">
                <form >

                    <input
                        placeholder='Please input your email'
                        type="text" 
                        name="usernsame"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
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
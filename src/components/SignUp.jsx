import React, { useState } from "react";
import Form from './Form';
import '../style/SignUp.css';
import axios from "axios";
  

class SignUp extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            email:""
        }
    }

    // Send the email to the addUser API and then trigger the parentCallbak function to change state and component in App.js
    addUser = async (userInput) => {

        axios
        .post("http://127.0.0.1:5000/addUser", {email: userInput})
        .then(res => {
        if(res.data['status code'] === "200"){
            console.log(userInput)
            this.props.parentCallback(res.data.isPresent)
        }
        }).catch((error) => {
        //this.setState({errorMessage: error.message})
            console.log(userInput)
        });
        
    }

    // Update the email that the user has inputted
    handleSubmit = () => {
       // console.log({email})
        this.addUser(this.state.email);
    }


    render(){
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
                            value={this.state.email}
                            onChange={e => this.setState({email: e.target.value})}
                        />
                    </form>
                </div>
                <div>
                    <button onClick={this.handleSubmit}> Submit</button>
                </div>
            </>
        )
    }
}

  export default SignUp;

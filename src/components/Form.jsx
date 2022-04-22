import React, { useState } from "react";
import '../style/SignUp.css';
import axios from "axios";
import { render } from "@testing-library/react";
import '../style/Form.css'
  

 // Form to display random songs, artists, genres and decades 
 // User will choose preference giving model specific data to user
 class Form extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            songs: [],
            artists: []
        }
    }

    // Call API to fetch the song and artists that the user will choose from
    populateSuggestions = async () => {
        /*
        axios
        .post("http://127.0.0.1:5000/getFormSuggestions", {email: this.props.email})
        .then(res => {
        if(res.data['status code'] === "200"){
           // console.log(userInput)
            this.props.parentCallback(res.data.isPresent)
        }
        }).catch((error) => {
        //this.setState({errorMessage: error.message})
            console.log(userInput)
        });
        */
        
    }
    
    componentDidMount = () => {
        this.populateSuggestions();
    }

    // When artist and song are selected, send Artist and Song ID to backend and update state variables
    handleSubmit = () => {
        this.props.parentCallback()
    }
    

    render(){
        return (
                <>
                <div>
                    <ul>
                        <li>Song Search</li>
                    </ul>
                </div>
                <div>
                    <div>
                        <div> </div>
                        <button> Submit</button>
                    </div>
                    
                </div>
            </>
        )
    }
}

export default Form;
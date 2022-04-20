import React, { useState } from "react";
import '../style/SignUp.css';
import axios from "axios";
  


 // Form to display random songs, artists, genres and decades 
 // User will choose preference giving model specific data to user
 const Form = () => {
    const steps = [];
    for (let i = 1; i <= 5; i++) {
        steps.push(<button key={i}>Song</button>);
    }
    
    return (
            <>
            <div>
                <ul>
                    <li>Song Search</li>
                </ul>
            </div>
            <div>
                <div>
                    <div> {steps}</div>
                    <button> Submit</button>
                </div>
                
            </div>
        </>
    )

  }

  export default Form;
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import App from '../App';
import reportWebVitals from '../reportWebVitals';
import { useNavigate } from "react-router-dom";
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
import './DisplayRecommendations.css';
  

export class DisplayRecommendations extends React.Component {


    constructor(props){
        super(props)
        this.state = {
            userInput: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }



    handleSubmit (){
        this.props.parentCallback(this.state.userInput)
        this.setState({userInput: ""})
    }

    handleChange({target}){
        this.setState({
            userInput: target.value
        })
    }

    render() {
        return (
            <>
            <div>
                <ul>
                    <li>Song Search</li>
                </ul>
            </div>


            <div >
                <div class="search" > 
                    <form>
                        <input
                            placeholder="Enter Song Title or Artist name"
                            type="text" 
                            name="usernsame"
                        />
                    </form>
                    <div>
                    </div>
                </div>

                <div class="display">
                    <div >
                            <h2>Liked Songs:</h2>
                            <div>

                            </div>
                        </div>

                        <div >
                            <h2>Recommendations: </h2>
                            <div>

                            </div>
                        </div>
                    </div>
            </div>
            </>
        )
    }

  }

  export default DisplayRecommendations;
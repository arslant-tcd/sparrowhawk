import React, { useState, useEffect } from "react";
import '../style/DisplayRecommendations.css';
import axios from "axios";


class DisplayRecommendations extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            songs: ""
        }
    }

    getReccommendations = async () => await axios
        .get("http://127.0.0.1:5000/getDataByArtist")
        .then(res => {
            this.setState({songs: res.data})
            if(res.status === "200"){
                
                console.log(res);
                console.log(res.results);
            }
            }).catch((error) => {
            //this.setState({errorMessage: error.message})
                console.log("test")
            });
          


    componentDidMount = () => {
        this.getReccommendations();
    }

    render(){

        return (
            <>
            <div>
                <ul>
                    <li>Song Search</li>
                </ul>
            </div>
            <div >
                <div className="search" > 
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
                <div className="display">
                    <div >
                            <h2>Liked Songs:</h2>
                            <div className="list">
                            {this.state.songs.results?.slice(0,10).map((song) => (
                                 <p key={song.artists}>{song.artists}</p>
                            ))}
                            </div>
                        </div>
                        <div >
                            <h2>Recommendations: </h2>
                            <div className="list">
                            {this.state.songs.results?.slice(0,10).map((song) => (
                                 <p key={song.artists}>{song.artists}</p>
                            ))}
                            </div>
                        </div>
                    </div>
            </div>
            </>
        )
    }
}

  export default DisplayRecommendations;

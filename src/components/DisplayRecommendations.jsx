import React, { useState, useEffect } from "react";
import './DisplayRecommendations.css';
import axios from "axios";


const DisplayRecommendations = () => {

    const [songs, setSongs] = useState([])

    const getReccommendations = async () => await axios
          .get("http://127.0.0.1:5000/getDataByArtist")
          .then(res => {
            setSongs(res.data)
            if(res.status === "200"){
                
                console.log(res);
                console.log(res.results);
            }
          }).catch((error) => {
            //this.setState({errorMessage: error.message})
                console.log("test")
          });
          


    useEffect(() => {
        getReccommendations();
      }, []);

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
                            <div>

                            </div>
                        </div>

                        <div >
                            <h2>Recommendations: </h2>
                            <div className="list">
                            {songs.results?.map((song) => (
                                 <p key={song.artists}>{song.artists}</p>
                            ))}
                            </div>
                        </div>
                    </div>
            </div>
            </>
        )
    

  }

  export default DisplayRecommendations;
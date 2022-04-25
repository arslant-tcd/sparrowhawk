import React, { useState, useEffect } from "react";
import '../style/DisplayRecommendations.css';
import axios from "axios";

const SEARCHBAR_ID = "searchBarId"
const SEARCH_SUGGESTIONS_ID = "searchResultsId"
class DisplayRecommendations extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            songs: ""
        }
        this.onSearchBarKeyUp = this.onSearchBarKeyUp.bind(this);
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
                console.log("get Recommendations failed")
            });


    componentDidMount = () => {
        console.log("component did mount")
        //this.getReccommendations();
    }

    onSearchBarKeyUp(event) {
        this.searchDatabase(event.target.value);
        event.preventDefault();
    }

    searchDatabase(searchString) {
        if (searchString){
            axios
            .get("http://127.0.0.1:5000/searchDatabase/" + searchString)
            .then(searchResults => {
                let searchSuggestions = document.getElementById(SEARCH_SUGGESTIONS_ID);
                searchSuggestions.innerHTML = "";
                try{
                    for (let currResult of searchResults.data.results){
                        let li = document.createElement("li");
                        li.appendChild(document.createTextNode(currResult.name + ", " + currResult.artists));
                        searchSuggestions.appendChild(li);
                    }
                    
                    
                    console.log(searchResults.data.results)
                }
                catch(TypeError){
                    //do nothing
                }
                
            })
            .catch((error) => {
                console.log("searchDatabase failed: " + error)
            });
        }
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
                            onKeyUp={this.onSearchBarKeyUp}
                            id = {SEARCHBAR_ID}
                        />
                    </form>
                    <div>
                    </div>
                </div>
                <span>Search Results: </span>
                <ul id={SEARCH_SUGGESTIONS_ID}></ul>
                
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

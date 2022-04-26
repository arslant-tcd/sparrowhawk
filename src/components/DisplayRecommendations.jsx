import React, { useState, useEffect } from "react";
import '../style/DisplayRecommendations.css';
import axios from "axios";

const SEARCHBAR_ID = "searchBarId"
const SEARCH_SUGGESTIONS_ID = "searchResultsId"
// This Component should retrieve the liked songs of the User,
// The recommended songs of the User and the search results from a user query
class DisplayRecommendations extends React.Component {

    constructor(props){
        super(props)
        this.state = {
            email: "",
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

    // When the page renders we want to retrieve the liked songs and the recommended songs of the user
    componentDidMount = () => {
        console.log("component did mount")
        this.getReccommendations();
    }

    onSearchBarKeyUp(event) {
        this.searchDatabase(event.target.value);
        event.preventDefault();
    }

    searchDatabase(searchString) {
        let searchSuggestions = document.getElementById(SEARCH_SUGGESTIONS_ID);
        //clear old results
        searchSuggestions.innerHTML = "";
        if (searchString){
            axios
            .get("http://127.0.0.1:5000/searchDatabase/" + searchString)
            .then(searchResults => {
                    for (let currResult of searchResults.data.results){
                        //create new list element
                        let suggestionElement = document.createElement("li");
                        suggestionElement.appendChild(document.createTextNode(currResult.name + ", " + currResult.artists));
                        suggestionElement.classList.add("searchElement");
                        let songIdMap = {};
                        songIdMap[currResult.songId] = currResult.name

                        //add callback when search result is clicked
                        suggestionElement.onclick = () => {
                            axios.post("http://127.0.0.1:5000/addLikedSong/",{email: this.props.email, song: songIdMap})
                            .catch((error) => {
                                console.log("addLikedSong failed: " + error)
                            });
                        }
                        //add search element to list
                        searchSuggestions.appendChild(suggestionElement);
                    }
                }
            )
            .catch((error) => {
                console.log("searchDatabase failed: " + error)
            });
        }
        else{
            
        }
    }

    render(){
        return (
            <div >
                <div className="header">Song Search</div>
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
                </div>
                <span>Search Results: </span>
                <div className="searchResults">
                    <ul class ="searchList" id={SEARCH_SUGGESTIONS_ID}></ul>
                </div>
                <div className="likedSongs">
                    <h2>Liked Songs:</h2>
                    <div className="list">
                    {this.state.songs.results?.slice(0,10).map((song) => (
                        <p key={song.artists}>{song.artists}</p>
                    ))}
                    </div>
                </div>
                <div className="recommendations">
                    <h2>Recommendations: </h2>
                    <div className="list">
                    {this.state.songs.results?.slice(0,10).map((song) => (
                        <p key={song.artists}>{song.artists}</p>
                    ))}
                    </div>
                </div>       
            </div>
        )
    }
}

export default DisplayRecommendations;

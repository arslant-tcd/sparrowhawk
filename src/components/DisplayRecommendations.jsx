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
            likedSongs: [],
            recommendedSongs: [],
            songs: ""
        }
        this.onSearchBarKeyUp = this.onSearchBarKeyUp.bind(this);
    }

    getLikedSongs = async () => await axios
        .get("http://127.0.0.1:5000/getLikedSongs/" + this.props.email)
        .then(res => {
            console.log("liked songs:" + res);
            this.setState({likedSongs: res.data.likedSongs});
        })
        .catch((error) => {
            console.log("Error retrieving liked songs: " + error)
        });

    getReccommendations = async () => await axios
        .get("http://127.0.0.1:5000/recommend/" + this.props.email)
        .then(res => {
            console.log("recommended: " + res.data);
            this.setState({recommendedSongs: res.data.songs});
            }).catch((error) => {
            //this.setState({errorMessage: error.message})
                console.log("get Recommendations failed: " + error)
            });

    // When the page renders we want to retrieve the liked songs and the recommended songs of the user
    componentDidMount = () => {
        console.log("component did mount")
        this.getReccommendations();
        this.getLikedSongs();
    }

    onSearchBarKeyUp(event) {
        this.searchDatabase(event.target.value);
        event.preventDefault();
        console.log(this.state.likedSongs)
    }

    searchDatabase(searchString) {
        let searchSuggestions = document.getElementById(SEARCH_SUGGESTIONS_ID);
        //clear old results
        searchSuggestions.innerHTML = "";
        if (searchString){
            axios
            .get("http://127.0.0.1:5000/searchDatabase/" + searchString)
            .then(searchResults => {
                    searchSuggestions.innerHTML = "";
                    for (let currResult of searchResults.data.results){
                        //create new list element
                        let suggestionElement = document.createElement("li");
                        suggestionElement.appendChild(document.createTextNode(currResult.name + ", " + currResult.artists));
                        suggestionElement.classList.add("searchElement");
                        let songIdMap = {};
                        songIdMap[currResult.songId] = currResult.name

                        //add callback when search result is clicked
                        suggestionElement.onclick = async () => {
                            await axios.post("http://127.0.0.1:5000/addLikedSong/",{email: this.props.email, song: songIdMap})
                            .then(console.log("onClick"))
                            .catch((error) => {
                                console.log("addLikedSong failed: " + error)
                            });
                            this.getLikedSongs();
                            this.getReccommendations(); 
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
    }

    handleDislike = (song) => {
        var obj = {}
        obj[Object.keys(song)] = Object.values(song)[0]
        console.log(this.props.email)
        console.log(Object.keys(song))
        console.log(Object.values(song)[0])
        console.log(obj)
        axios
        .post("http://127.0.0.1:5000/removeLikedSong/", {email: this.props.email, song: obj})
        .then(res => {
            console.log("disliked: " + res.data);
            this.setState({likedSongs: res.data.songs});
            }).catch((error) => {
            //this.setState({errorMessage: error.message})
                console.log("remove like song failed: " + error)
            });
        this.getLikedSongs();
    }

    handleLike = (song) => {
        var obj = {}
        obj[Object.keys(song)] = Object.values(song)[0]
        axios
        .post("http://127.0.0.1:5000/addLikedSong/", {email: this.props.email, song: obj})
        .then(res => {
            console.log("liked: " + res.data);
            this.setState({likedSongs: res.data.songs});
            }).catch((error) => {
            //this.setState({errorMessage: error.message})
                console.log("add liked song failed: " + error)
            });
        this.getReccommendations();
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
                <div className="searchResults">
                    <ul className="searchList" id={SEARCH_SUGGESTIONS_ID}></ul>
                </div>
                    <h2>Liked Songs:</h2>
                    <div className="list">
                        {this.state.likedSongs?.map((song,i) => (
                            <div>
                                <li key={i}>
                                    {Object.values(song)[0]}
                                    <button className="list-button" onClick={this.handleDislike}>Remove Song</button>
                                </li>
                            </div>
                        ))}
                    </div>
                <div className="recommendations">
                    <h2>Recommendations: </h2>
                    <div className="list">
                        {this.state.recommendedSongs?.map((song,i) => (
                            <li key={i}>
                                {Object.values(song)[0]}
                                <button className="list-button" onClick={this.handleLike(song)}>Like Song</button>
                            </li>
                        ))}
                    </div>
                </div>       
            </div>
        )
    }
}

export default DisplayRecommendations;

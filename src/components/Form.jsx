import React from "react";
import axios from "axios";
import '../style/Form.css'
  

 // Form to display random songs, artists, genres and decades 
 // User will choose preference giving model specific data to user
 class Form extends React.Component {
    
    constructor(props){
        super(props)
        this.state = {
            songs: [],
            artists: [],
            selectedSong: "",
            selectedArtist: ""
        }
    }

    // Call API to fetch the song and artists that the user will choose from
    populateSuggestions = async () => {
        axios
        .get("http://127.0.0.1:5000/getFormSuggestions")
        .then(res => {
            console.log(res)
        if(res["status"] === 200){
            console.log(res.data.results.artists)
            this.setState({
                artists: res.data.results.artists,
                songs: res.data.results.songs
            })
            //this.props.parentCallback(res.data.isPresent)
        }
        }).catch((error) => {
        //this.setState({errorMessage: error.message})
            console.log(error)
        });
        
    }
    
    // When component renders we want the suggested artists/songs to render to the screen
    componentDidMount = () => {
        this.populateSuggestions();
    }

    // When artist and song are selected, send Artist and Song ID to backend and update state variables
    handleSubmit = (id, name) => {
       // this.props.parentCallback(true, this.props.email)

       axios
       .post("http://127.0.0.1:5000/setPreferences", {email: this.props.email, artist: this.state.selectedArtist, song: { ''+id: name} })
       .then(res => {
       if(res.data["status code"] === "200"){
           if(res.data.message === "User Added successfully"){
               this.props.parentCallback(false, userInput)
           }
           else if(res.data.message === "User Already exists"){
               this.props.parentCallback(true, userInput)
           }
       }
       }).catch((error) => {
       //this.setState({errorMessage: error.message})
           console.log(userInput)
       });
    }

    changeColour = () => {
       // this.setState({buttonBlack: "black"})
        //document.documentElement.style.setProperty('--base',this.state.buttonBlack);
    }

    handleSongClick = (song) => {
        console.log(song)
        this.setState({selectedSong: song})
        
    }
    handleArtistClick = (artist) => {
        console.log(artist)
        this.setState({selectedArtist: artist})
        
    }

    render(){
        return (
            <div>
                <div>
                    <h2>Song Search</h2>
                </div>
                <div className="center-div">
                    {this.state.artists?.map((artist, i) => (
                        <button key={i} className="suggestions" style={{ "backgroundColor": artist === this.state.selectedArtist ? "red" : "" }} onClick={(e) => {
                            this.handleArtistClick(artist)
                        }}>
                            {artist}
                        </button>
                    ))}
                </div>


                <div className="center-div">
                    {this.state.songs?.map((song, i) => (
                        <button key={i} className="suggestions" style={{ "backgroundColor": song === this.state.selectedSong ? "blue" : "" }} onClick={(e) => {
                            this.handleSongClick(song)
                        }}>
                            {artist}
                        </button>
                    ))}
                </div>
                <div> <button className="submitButton" onClick={this.handleSubmit(this.state.selectedSong.id, this.state.selectedSong.name)}> Submit </button> </div>
            </div>
        )
    }
}

export default Form;

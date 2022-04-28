import React from "react";
import axios from "axios";
import '../style/Form.css';
import ArtistForm from './FormElements/ArtistForm';
import SongForm from './FormElements/SongForm';
import OccasionForm from './FormElements/OccasionForm';
import { SPORTS, STUDYING } from "./FormElements/OccasionForm";

// Form to display random songs, artists, genres and decades 
// User will choose preference giving model specific data to user
// Took reference from: https://github.com/bradtraversy/react_step_form
 class Form extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            step: 1,
            occasion: "",
            songs: [],
            artists: [],
            selectedSong: "",
            selectedArtist: "",
        }
    }

    // Call API to fetch the song and artists that the user will choose from
    populateSuggestions = async () => {
        await axios
        .get("http://127.0.0.1:5000/getFormSuggestions")
        .then(res => {
        if(res["status"] === 200){
            this.setState({
                artists: res.data.results.artists,
            })
            console.log(this.state.artists)
        }
        }).catch((error) => {
            console.log("Error while populating suggestions: " + error);
        }); 
    }
    
    // When component renders we want the suggested artists/songs to render to the screen
    componentDidMount = () => {
        this.populateSuggestions();
    }

    // When artist and song are selected, send Artist and Song ID to backend and update state variables
    handleSubmit = (song) => {
       axios
       .post("http://127.0.0.1:5000/setPreferences", {email: this.props.email, artist: this.state.selectedArtist, song: song})
       .then(res => {
            if(res.data["status code"] === "200"){
                    this.props.parentCallback(true, this.props.email)
            }
        }).catch((error) => {
                console.log(error)
        });
    }

    // We highlight the song selected and also change the state variable to be submitted
    handleSongClick = (song) => {
        this.setState({selectedSong: song})
    }

    getReccommendations = async () => await axios
        .get("http://127.0.0.1:5000/recommend/" + this.props.email)
        .then(res => {
            console.log("recommended: " + res.data);
            this.setState({songs: res.data.songs});
            }).catch((error) => {
            //this.setState({errorMessage: error.message})
                console.log("get Recommendations failed: " + error)
            });

    nextStep = async () => {
        //update user model after user selected the occasion of the playlist
        if (this.state.step == 1){
            console.log(this.props.email)
            let userParamMap = new Map();
            if (this.state.occasion == STUDYING.get('name')){
                userParamMap = STUDYING
            }
            else if((this.state.occasion == SPORTS.get('name'))){
                userParamMap = SPORTS
            }
            await axios.post("http://127.0.0.1:5000/updateUserModel/" + this.props.email, {
                valence: userParamMap.get('valence'),
                acousticness: userParamMap.get('acousticness'),
                danceability: userParamMap.get('danceability'),
                energy: userParamMap.get('energy'),
                instrumentalness: userParamMap.get('instrumentalness'),
                liveness: userParamMap.get('liveness'),
                loudness: userParamMap.get('loudness'),
                speechiness: userParamMap.get('speechiness'),
                tempo: userParamMap.get('tempo')
            })
            .then(res => {
                this.getReccommendations();
            }).catch((error) => {
                console.log("Error while populating suggestions: " + error);
            });
        }
        const { step } = this.state;
        this.setState({
          step: step + 1
        });
    };
    
    //update state with passed value
    handleChange = input => e => {
        console.log(e.target.value)
        this.setState({ [input]: e.target.value });
    };

    render(){
        const { step } = this.state;
        const { occasion, selectedSong, selectedArtist } = this.state;
        const values = { occasion, selectedSong, selectedArtist };

        switch (step) {
        case 1:
            return (
            <OccasionForm
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                values={values}
                state={this.state}
            />
            );
        case 2:
            return (
            <ArtistForm
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                values={values}
                state={this.state}
                populateSuggestions={this.populateSuggestions}
            />
            );
        case 3:
            return (
            <SongForm
                nextStep={this.nextStep}
                handleChange={this.handleChange}
                values={values}
                state={this.state}
                getReccommendations={this.getReccommendations}
                handleSubmit={this.handleSubmit}
                selectedSong={this.state.selectedSong}
            />
            )
       /* case 4:
            //submit and return to main app
            return (
                <div>
                    {console.log(this.state.selectedSong[0])}
                    <button className="submitButton" onClick={() => this.handleSubmit(this.state.selectedSong)}>Submit</button> 
                </div> 
            )
            */
        default:
            //TODO: add failure response
            return(
                <div>
                    An error occured
                    {console.log("This should not happen")}
                </div>   
            )
        }
    }
}

export default Form;

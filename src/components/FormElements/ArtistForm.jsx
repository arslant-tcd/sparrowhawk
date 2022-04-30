import React from "react";

export class ArtistForm extends React.Component {
    continue = e => {
      e.preventDefault();
      this.props.nextStep();
    };
  
    render() {
      const { values, state, handleChange } = this.props;
      return (
       <div>
           <h3>Select an artist you might like</h3>
           <div className="center-div">
                {state.artists?.map((artist, i) => (
                    <button key={i} value={artist} className="suggestions" style={{ "backgroundColor": artist === values.selectedArtist ? "red" : "" }} 
                    onClick={handleChange('selectedArtist')}>
                        {artist}
                    </button>
                ))}
            </div>
            <div>
              <button color="primary" variant="contained" onClick={this.props.populateSuggestions}>
                  Refresh
              </button>
              <button color="primary" variant="contained" onClick={this.continue}>
                  Continue
              </button>
            </div>
       </div>
      );
    }
  }
  
  export default ArtistForm;
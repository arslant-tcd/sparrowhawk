import React from "react";

export class SongForm extends React.Component {
    

    continue = e => {
      e.preventDefault();
      this.props.nextStep();
    };
  
    render() {
      const { values, state, handleChange, selectedSong } = this.props;
      return (
        <div>
            <h3>Select a song you might like</h3>
            <div className="center-div">
                    {state.songs?.map((song,i) => (
                        <button key={i} value={Object.keys(song)[0]} className="suggestions" style={{ "backgroundColor": Object.keys(song)[0] === values.selectedSong ? "red" : "" }} 
                        onClick={handleChange('selectedSong')}>
                            {Object.values(song)}
                        </button>
                    ))}
            </div>
            <div>
              <button color="primary" variant="contained" onClick={this.props.getReccommendations}>
                  Refresh
              </button>
              {console.log(selectedSong)}
              <button onClick={() => this.props.handleSubmit(selectedSong)}>Submit</button> 
            </div>
            
        </div>
      );
      /**
       * 
       */
    }
  }
  
  export default SongForm;
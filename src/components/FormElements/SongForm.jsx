import React from "react";

export class SongForm extends React.Component {
    continue = e => {
      e.preventDefault();
      this.props.nextStep();
    };
  
    render() {
      const { values, state, handleChange } = this.props;
      return (
        <div>
            <h3>Select a song you might like</h3>
            <div className="center-div">
                    {state.songs?.map((song,i) => (
                        <button key={i} value={Object.values(song)} className="suggestions" style={{ "backgroundColor": Object.values(song)[0] === values.selectedSong ? "red" : "" }} 
                        onClick={handleChange('selectedSong')}>
                            {Object.values(song)}
                        </button>
                    ))}
            </div>
            <button color="primary" variant="contained" onClick={this.continue}>
                    Continue
            </button>
        </div>
      );
      /**
       * 
       */
    }
  }
  
  export default SongForm;
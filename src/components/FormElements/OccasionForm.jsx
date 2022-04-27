import React from "react";

// id of the error message div
const ERROR_MESSAGE_ID = "errMsgID"
export const STUDYING = new Map([
    ['name', 'studying'],
    ['valence', 40.0],
    ['acousticness', 70.0],
    ['danceability', 20.0],
    ['energy', 20.0],
    ['instrumentalness', 70.0],
    ['liveness', 40.0],
    ['loudness', 20.0],
    ['speechiness', 20.0],
    ['tempo', 20.0],
]);

export const SPORTS = new Map([
    ['name', 'sports'],
    ['valence', 80.0],
    ['acousticness', 20.0],
    ['danceability', 60.0],
    ['energy', 90.0],
    ['instrumentalness', 20.0],
    ['liveness', 90.0],
    ['loudness', 90.0],
    ['speechiness', 40.0],
    ['tempo', 70.0],
]);

export class OccasionForm extends React.Component {
    continue = e => {
        //display error message if no occasion was selected
        if (this.props.values.occasion) {
            e.preventDefault();
            this.props.nextStep();
        }
        else {
            let errMsg = document.getElementById(ERROR_MESSAGE_ID);
            errMsg.style.visibility = "visible" ;
        }
    };
  
    render() {
      const { values,state, handleChange } = this.props;
      return (
          <div>
                <fieldset>
                    <h3>Select an occasion for the playlist</h3>
                    <div>
                        <input type="radio" id={STUDYING.get('name')} name="occasion" value={STUDYING.get('name')}
                        onChange={handleChange('occasion')}
                        />
                        <label htmlFor={STUDYING.get('name')}>Studying</label>
                    </div>
                    <div>
                        <input type="radio" id={SPORTS.get('name')} name="occasion" value={SPORTS.get('name')}  onChange={handleChange('occasion')}/>
                        <label htmlFor={SPORTS.get('name')}>Sports</label>
                    </div>
                </fieldset>
                <div id={ERROR_MESSAGE_ID} className="error-message">Select an occasion</div>
                <button color="primary" variant="contained" onClick={this.continue}>
                    Continue
                </button>
        </div>
      );
    }
  }
  
  export default OccasionForm;
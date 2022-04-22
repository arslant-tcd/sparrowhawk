import './App.css';
import React from 'react';
import SignUp from './components/SignUp';
import DisplayRecommendations from './components/DisplayRecommendations';
import Form from './components/Form';
import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';


class App extends React.Component {


  constructor(props){
    super(props)
    this.state = {
      form: false,
      signIn: false
    }
    this.handleCallback = this.handleCallback.bind(this);
  }


  handleCallback = (isUserPresent) => {

    if(isUserPresent === true){
      this.setState({
        form: false,
        signIn: true
  
      })
    }
    else{
      this.setState({
        form: true,
        signIn: true
  
      })
    }
  }

  // Handle submits so that existing user is directed to the display recommendations
  // New users directed to form
  render(){

    return (
           
      <div>
        { this.state.form === false && this.state.signIn === false && < SignUp parentCallback = {this.handleCallback} />}
        { this.state.form === true  &&  this.state.signIn === true  && < Form email = {this.state.email}/>}
        { this.state.form === false && this.state.signIn === true  && < DisplayRecommendations email={this.state.email}/>}
      </div>
    
    );
  }


    
}

export default App;

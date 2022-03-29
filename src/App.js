import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from './components/SignUp';
import DisplayRecommendations from './components/DisplayRecommendations';
import { Component } from 'react';

class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <Routes>
          <Route path ="/" element={<SignUp/>}/>
          <Route path="/test" element={<DisplayRecommendations />} />
        </Routes>
      </ BrowserRouter>
    );
  }
    
}

export default App;

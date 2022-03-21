import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './components/CompNavBar/CompNavbar';
import MainAlert from './components/Alert/Alert';
import Users from './components/Users/Users';
import Songs from './components/Songs/Songs';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

function App() {
  return (
    <div>
      <Router>
        <NavBar/>
        <br/>
        <Routes>
          <Route path="/" element={<MainAlert />} />
          <Route path="/songs" element={<Songs />} />
          <Route path="/users" element={<Users />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

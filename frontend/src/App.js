import './App.css';

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import HomePage from './HomePage';
import Questionnaire from './Questionnaire';
import Voice from "./voice";
import Text from "./Text";
import { VideoProvider } from './VideoContext';

import {useState} from "react";
import Reload from "./reload";
import Login from "./login";
import TopBar from "./TopBar";
import Register from "./register";
import Compare from "./Compare";
import CompareWith from "./compareWith";
import StepperPage from "./Step";
import Profile from "./profile";

function App() {
    const [auth, setAuth] = useState(false);
    const [user, setUser] = useState({ username: '', email: '' });

    const handleAuth = (isLoggedIn, user) => {
        setAuth(isLoggedIn);
        setUser(user);
  };

  return (
      <VideoProvider>
          <Router>
              <TopBar auth={auth} user={user} setAuth={handleAuth} />
              <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path ='login' element={<Login setAuth={handleAuth}/>} />
                  <Route path='register' element={<Register />} />
                  <Route path="/questionnaire" element={<Questionnaire />} />
                  <Route path="/voice" element={<Voice />} />
                  <Route path="/text" element={<Text />} />
                  <Route path='/compare' element={<Compare />} />
                  <Route path='/compare_with' element={<CompareWith />} />
                  <Route path="/reload" element={<Reload />} />
                  <Route path="/step" element={<StepperPage />} />
                  <Route path='/profile' element={<Profile />} />
              </Routes>
          </Router>
      </VideoProvider>
  );
}
export default App;

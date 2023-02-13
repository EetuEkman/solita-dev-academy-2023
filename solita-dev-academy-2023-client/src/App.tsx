import React from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import JourneysPage from './Pages/JourneysPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JourneysPage></JourneysPage>}></Route>
      </Routes>
    </Router>
    
  )
}

export default hot(App);

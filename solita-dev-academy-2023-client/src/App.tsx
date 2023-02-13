import React from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router,Routes, Route, Link } from 'react-router-dom';
import JourneysPage from './Pages/JourneysPage';
import StationsPage from './Pages/StationsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JourneysPage></JourneysPage>}></Route>
        <Route path="/journeys" element={<JourneysPage></JourneysPage>}></Route>
        <Route path="/stations" element={<StationsPage></StationsPage>}></Route>
      </Routes>
    </Router>
    
  )
}

export default hot(App);

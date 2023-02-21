import React from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JourneysPage from './Pages/Journeys/JourneysPage';
import NotFound from './Pages/NotFound/NotFound';
import StationPage from './Pages/Station/StationPage';
import StationsPage from './Pages/Stations/StationsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/journeys"></Navigate>}></Route>
        <Route path="/journeys" element={<JourneysPage></JourneysPage>}></Route>
        <Route path="/stations" element={<StationsPage></StationsPage>}></Route>
        <Route path="/station/:id" element={<StationPage></StationPage>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </Router>
  )
}

export default hot(App);
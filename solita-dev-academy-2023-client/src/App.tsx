import React from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Routes, Route, Link, useRoutes } from 'react-router-dom';
import JourneysPage from './Pages/Journeys/JourneysPage';
import StationsPage from './Pages/Stations/StationsPage';

function App() {
  return (
    <Router>
      <nav className="flex items-center gap-4 p-4 text-yellow-500 bg-bluish_grey-500 shadow-md shadow-bluish_grey-500/50">
        <div className="inline-block font-bold m-2"><span>Helsinki city bikes</span></div>
        <Link to="/journeys">Journeys</Link>
        <Link to="/stations">Stations</Link>
      </nav>
      <Routes>
        <Route path="/" element={<JourneysPage></JourneysPage>}></Route>
        <Route path="/journeys" element={<JourneysPage></JourneysPage>}></Route>
        <Route path="/stations" element={<StationsPage></StationsPage>}></Route>
      </Routes>
    </Router>

  )
}

export default hot(App);

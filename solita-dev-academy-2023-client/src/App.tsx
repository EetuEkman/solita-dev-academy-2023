import React from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Routes, Route, Link, useRoutes } from 'react-router-dom';
import JourneysPage from './Pages/JourneysPage';
import StationsPage from './Pages/StationsPage';

function App() {
  return (
    <Router>
      <nav className="flex flex-row justify-start items-center gap-4 p-4 text-yellow-500 bg-bluish_grey-500">
        <div className="inline-block font-bold m-2">Helsinki city bikes</div>
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

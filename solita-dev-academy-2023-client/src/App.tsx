import React, { useState } from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DEFAULT_FILTER_SORT from './Constants/DefaultFilterSort';
import FetchedStationsPage from './Models/FetchedStationsPage';
import { FilterSort } from './Models/FilterSort';
import JourneysPage from './Pages/Journeys/JourneysPage';
import NotFound from './Pages/NotFound/NotFound';
import StationPage from './Pages/Station/StationPage';
import StationsPage from './Pages/Stations/StationsPage';

function App() {
  // Keep the state of the stations here to persist them between navigating pages. 

  const [stationsPage, SetStationsPage] = useState<FetchedStationsPage | null>(null);

  // Keep the state of the stations filter and sort here to persist them between navigating pages. 

  const [stationsFilterSort, SetStationsFilterSort] = useState<FilterSort>(DEFAULT_FILTER_SORT);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/journeys"></Navigate>}></Route>
        <Route path="/journeys" element={<JourneysPage></JourneysPage>}></Route>
        <Route path="/stations" element={<StationsPage stationsPage={stationsPage} SetStationsPage={SetStationsPage} filterSort={stationsFilterSort} SetFilterSort={SetStationsFilterSort}></StationsPage>}></Route>
        <Route path="/station/:id" element={<StationPage></StationPage>}></Route>
        <Route path="*" element={<NotFound></NotFound>}></Route>
      </Routes>
    </Router>
  )
}

export default hot(App);
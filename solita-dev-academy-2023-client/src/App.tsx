import React from 'react';
import { hot } from "react-hot-loader/root";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import JourneysPage from './Pages/Journeys/JourneysPage';
import NotFound from './Pages/NotFound/NotFound';
import Layout from './Pages/Shared/Layout';
import StationsPage from './Pages/Stations/StationsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<JourneysPage></JourneysPage>}></Route>
          <Route path="/journeys" element={<JourneysPage></JourneysPage>}></Route>
          <Route path="/stations" element={<StationsPage></StationsPage>}></Route>
          <Route path="*" element={<NotFound></NotFound>}></Route>
        </Route>
      </Routes>
    </Router>
  )
}

export default hot(App);

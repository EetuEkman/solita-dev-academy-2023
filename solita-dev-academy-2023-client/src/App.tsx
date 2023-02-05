import React, { useState } from 'react';
import { hot } from "react-hot-loader/root";
import FetchJourneys from './FetchJourneys';
import JourneySearch from './Journeys/JourneySearch';
import JourneyTable from './Journeys/JourneyTable';
import JourneyPage from './Models/JourneyPage';
import SearchOptions from './Models/SearchOptions';

const JOURNEYS_URL = new URL("https://localhost:7263/api/Journey");

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
  DepartureDateFrom: null,
  DepartureDateTo: null,
  ReturnDateFrom: null,
  ReturnDateTo: null,
  CoveredDistanceFrom: "",
  CoveredDistanceTo: "",
  DurationFrom: "",
  DurationTo: "",
  DepartureStationNameFi: "",
  DepartureStationNameSe: "",
  DepartureStationNameEn: "",
  ReturnStationNameFi: "",
  ReturnStationNameSe: "",
  ReturnStationNameEn: "",
}  

function App() {
  const [page, setPage] = useState<JourneyPage>();

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({...DEFAULT_SEARCH_OPTIONS});

  const [isWorking, setIsWorking] = useState(false);

  const handleFetchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isWorking) {
      return;
    }

    fetchJourneys();    
  }

  async function fetchJourneys() {
    setIsWorking(isWorking => true);

    let page = await FetchJourneys(JOURNEYS_URL);

    setPage(p => page);

    setIsWorking(isWorking => false);
  }

  return (
    <div>
      <JourneySearch searchOptions={searchOptions} setSearchOptions={setSearchOptions} onClick={handleFetchClick}></JourneySearch>
      <button onClick={handleFetchClick}>Fetch</button>
      {
        page ?
          <JourneyTable journeys={page?.Journeys}></JourneyTable>
          :
          null
      }
      {JSON.stringify(searchOptions)}
    </div>
  )
}

export default hot(App);

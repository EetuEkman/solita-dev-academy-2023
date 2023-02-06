import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import BuildUrl from './BuildUrl';
import FetchJourneys from './FetchJourneys';
import JourneySearch from './JourneySearch/JourneySearch';
import JourneyPage from './Models/JourneyPage';
import SearchOptions from './Models/SearchOptions';
import Journeys from './Journeys/Journeys';
import DEFAULT_SEARCH_OPTIONS from './Constants/DefaultSearchOptions';

const JOURNEYS_URL = "https://localhost:7263/api/Journey";

function App() {
  const [page, setPage] = useState<JourneyPage>();

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({...DEFAULT_SEARCH_OPTIONS});

  const [isWorking, setIsWorking] = useState(false);

  const [journeyUrl, setJourneyUrl] = useState(new URL(JOURNEYS_URL));

  const handleFetchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isWorking) {
      return;
    }

    fetchJourneys();    
  }

  async function fetchJourneys() {
    setIsWorking(isWorking => true);

    let page = await FetchJourneys(journeyUrl);

    setPage(p => page);

    setIsWorking(isWorking => false);
  }

  useEffect(() => {
    setJourneyUrl(url => BuildUrl(JOURNEYS_URL, searchOptions));
  }, [searchOptions])

  return (
    <div>
      <JourneySearch searchOptions={searchOptions} setSearchOptions={setSearchOptions} onClick={handleFetchClick}></JourneySearch>
      <button onClick={handleFetchClick}>Fetch</button>
      {
        page ?
          <Journeys journeyPage={page}></Journeys>
          :
          null
      }
    </div>
  )
}

export default hot(App);

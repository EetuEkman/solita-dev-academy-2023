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

    let direction = event.currentTarget.getAttribute("data-direction");

    let url: URL;

    switch (direction) {
      case "next":
        url = new URL(page?.Next!)
        break;
      case "previous":
        url = new URL(page?.Previous!);
        break;
      default:
        url = journeyUrl;
        break;
    }

    fetchJourneys(url);
  }

  async function fetchJourneys(url: URL) {
    setIsWorking(isWorking => true);

    let page: JourneyPage;

    page = await FetchJourneys(url);

    setPage(p => page);

    setIsWorking(isWorking => false);
  }

  useEffect(() => {
    setJourneyUrl(url => BuildUrl(JOURNEYS_URL, searchOptions));
  }, [searchOptions])

  return (
    <div>
      <JourneySearch onFetchClick={handleFetchClick} searchOptions={searchOptions} setSearchOptions={setSearchOptions} isWorking={isWorking}></JourneySearch>
      {
        page ?
          <Journeys handleFetchClick={handleFetchClick} page={page}></Journeys>
          :
          null
      }
      {JSON.stringify(page)}
    </div>
  )
}

export default hot(App);

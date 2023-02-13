import React, { useEffect, useState } from 'react';
import { hot } from "react-hot-loader/root";
import BuildUrl from './BuildUrl';
import FetchJourneys from './FetchJourneys';
import JourneySearch from './JourneySearch/JourneySearch';
import JourneyPage from './Models/JourneyPage';
import SearchOptions from './Models/SearchOptions';
import Journeys from './Journeys/Journeys';
import DEFAULT_SEARCH_OPTIONS from './Constants/DefaultSearchOptions';
import FetchError from './Models/FetchError';
import FetchErrors from "./Constants/FetchErrors";

const JOURNEYS_URL = "https://localhost:7263/api/Journey";

function CreateFetchError(error: string): FetchError {
  let fetchError: FetchError = {
      description: FetchErrors.Error
  };

  switch (error) {
      case FetchErrors.NetworkError:
          fetchError = {
              description: FetchErrors.NetworkError,
              message: "The server is unreachable. Please check your internet connectivity."
          }
  }

  return fetchError;
}

function App() {
  const [page, setPage] = useState<JourneyPage | null>();

  const [fetchError, setFetchError] = useState<FetchError | null>(null);

  // The URL and search components are built from SearchOptions.

  const [searchOptions, setSearchOptions] = useState<SearchOptions>({...DEFAULT_SEARCH_OPTIONS});

  // Ongoing fetches etc. asynchronous actions taking place.
  
  const [isWorking, setIsWorking] = useState(false);

  // The current URL from which to fetch the journey page when the fetch button is clicked.

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

    setFetchError(error => null);

    let page: JourneyPage;

    try {
      page = await FetchJourneys(url);
    }
    catch(networkError) {
      setFetchError(error => CreateFetchError(FetchErrors.NetworkError));

      setIsWorking(isWorking => false);

      return;
    }

    setPage(p => page);

    setIsWorking(isWorking => false);
  }

  useEffect(() => {
    setJourneyUrl(url => BuildUrl(JOURNEYS_URL, searchOptions));
  }, [searchOptions])

  return (
    <div className="p-1">
      <JourneySearch onFetchClick={handleFetchClick} searchOptions={searchOptions} setSearchOptions={setSearchOptions} isWorking={isWorking}></JourneySearch>
      {
        fetchError ?
          <div className="py-1 px-2 text-yellow-500 bg-bluish_grey-500 rounded">
            <h1>{fetchError.description}</h1>
            {
              fetchError.message
                ?
                <p>{fetchError.message}</p>
                :
                null
            }
          </div>
          :
          null
      }
      {
        page ?
          <Journeys handleFetchClick={handleFetchClick} page={page} isWorking={isWorking}></Journeys>
          :
          null
      }
    </div>
  )
}

export default hot(App);

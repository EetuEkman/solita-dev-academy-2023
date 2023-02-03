import * as React from 'react';
import { hot } from "react-hot-loader/root";
import FetchJourneys from './FetchJourneys';
import JourneyPage from './Models/JourneyPage';

const BASE_URL = "https://localhost:7263/";

const JOURNEYS_URL = new URL("https://localhost:7263/api/Journey");

function App() {
  const [page, setPage] = React.useState<JourneyPage>();

  const handleFetchClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    fetchJourneys();
  }

  async function fetchJourneys() {
    let page = await FetchJourneys(JOURNEYS_URL);

    setPage(p => page);
  }

  return (
    <div>
      <button onClick={handleFetchClick}>Fetch</button>
      {JSON.stringify(page, null, 2)}
    </div>
  )
}

export default hot(App);

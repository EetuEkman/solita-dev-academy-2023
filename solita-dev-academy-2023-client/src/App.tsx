import * as React from 'react';
import { hot } from "react-hot-loader/root";
import FetchJourneys from './FetchJourneys';
import JourneyTable from './Journeys/JourneyTable';
import JourneyPage from './Models/JourneyPage';

const JOURNEYS_URL = new URL("https://localhost:7263/api/Journey");

function App() {
  const [page, setPage] = React.useState<JourneyPage>();

  const [isWorking, setIsWorking] = React.useState(false);

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
      <button onClick={handleFetchClick}>Fetch</button>
      {
        page ?
          <JourneyTable journeys={page?.Journeys}></JourneyTable>
          :
          null
      }

    </div>
  )
}

export default hot(App);

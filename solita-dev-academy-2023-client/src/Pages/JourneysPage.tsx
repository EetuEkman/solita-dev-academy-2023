import React, { useEffect, useState } from 'react';
import BuildUrl from '../BuildUrl';
import DEFAULT_SEARCH_OPTIONS from '../Constants/DefaultSearchOptions';
import FetchErrors from '../Constants/FetchErrors';
import FetchErrorDisplay from '../FetchErrorDisplay';
import FetchJourneys from '../FetchJourneys';
import Journeys from '../Journeys/Journeys';
import JourneySearch from "../JourneySearch/JourneySearch";
import JourneyPage from '../Models/JourneyPage';
import SearchOptions from '../Models/SearchOptions';

const JOURNEYS_URL = "https://localhost:7263/api/Journey";

interface Props {

}

export default function JourneysPage(props: Props) {
    const [page, setPage] = useState<JourneyPage | null>();

    const [fetchError, setFetchError] = useState("");

    // The URL and search components are built from SearchOptions.

    const [searchOptions, setSearchOptions] = useState<SearchOptions>({ ...DEFAULT_SEARCH_OPTIONS });

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

        setFetchError(error => "");

        let page: JourneyPage;

        try {
            page = await FetchJourneys(url);
        }
        catch (networkError) {
            setFetchError(error => FetchErrors.NetworkError);

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
        <div className="p-0.5">
            <JourneySearch onFetchClick={handleFetchClick} searchOptions={searchOptions} setSearchOptions={setSearchOptions} isWorking={isWorking}></JourneySearch>
            {
                fetchError.length > 0 ?
                    <FetchErrorDisplay fetchError={fetchError}></FetchErrorDisplay>
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
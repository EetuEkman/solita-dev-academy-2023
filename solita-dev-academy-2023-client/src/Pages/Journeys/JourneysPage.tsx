import React, { useEffect, useState } from 'react';
import BuildUrl from '../../Services/BuildJourneysUrl';
import DEFAULT_SEARCH_OPTIONS from '../../Constants/DefaultJourneySearchOptions';
import FetchErrors from '../../Constants/FetchErrors';
import FetchErrorDisplay from '../Shared/FetchErrorDisplay';
import FetchJourneys from '../../Services/FetchJourneys';
import JourneyDisplay from './JourneysDisplay/JourneyDisplay';
import JourneySearch from "./JourneySearch/JourneySearch";
import FetchedJourneysPage from '../../Models/FetchedJourneysPage';
import SearchOptions from '../../Models/JourneySearchOptions';
import Layout from '../Shared/Layout';
import appSettings from "./../../../appSettings.json";

const API_BASE_URL = appSettings.urls.api;

const JOURNEYS_URL = new URL("Journey", API_BASE_URL);

interface Props {

}

export default function JourneysPage(props: Props) {
    const [page, setPage] = useState<FetchedJourneysPage | null>();

    const [fetchError, setFetchError] = useState("");

    // The URL and search components are built from SearchOptions.

    const [searchOptions, setSearchOptions] = useState<SearchOptions>({ ...DEFAULT_SEARCH_OPTIONS });

    // Ongoing fetches etc. asynchronous actions taking place.

    const [isWorking, setIsWorking] = useState(false);

    // The current URL from which to fetch the journey page when the fetch button is clicked.

    const [journeyUrl, setJourneyUrl] = useState(JOURNEYS_URL);

    const HandleFetchPointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
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

        FetchJourneysPage(url);
    }

    async function FetchJourneysPage(url: URL) {
        setIsWorking(isWorking => true);

        setFetchError(error => "");

        let page: FetchedJourneysPage;

        try {
            let response = await fetch(url);

            if (!response.ok) {
                let statusCode = response.status;

                switch (statusCode) {
                    case 400:
                        setFetchError(error => FetchErrors.BadRequest);
                        break;
                    case 500:
                        setFetchError(error => FetchErrors.InternalServerError)
                        break;
                }

                setIsWorking(isWorking => false);

                return;
            }

            let json = await response.json();

            page = json as FetchedJourneysPage;

            // page = await FetchJourneys(url);
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
        <Layout>
            <div className="p-2">
                <JourneySearch OnFetchPointerDown={HandleFetchPointerDown} searchOptions={searchOptions} setSearchOptions={setSearchOptions} isWorking={isWorking}></JourneySearch>
                {
                    fetchError.length > 0 ?
                        <FetchErrorDisplay fetchError={fetchError}></FetchErrorDisplay>
                        :
                        null
                }
                {
                    page ?
                        <JourneyDisplay HandleFetchPointerDown={HandleFetchPointerDown} journeysPage={page} isWorking={isWorking}></JourneyDisplay>
                        :
                        null
                }
            </div>
        </Layout>
    )
}
import React, { useState } from "react";
import DEFAULT_STATION_SEARCH_OPTIONS from "../../Constants/DefaultStationSearchOptions";
import FetchErrors from "../../Constants/FetchErrors";
import FetchedStationsPage from "../../Models/FetchedStationsPage";
import StationSearchOptions from "../../Models/StationSearchOptions";
import FetchStations from "../../Services/FetchStations";
import FetchErrorDisplay from "../Shared/FetchErrorDisplay";
import StationsSearch from "./Search/StationsSearch";
import StationsDisplay from "./StationsDisplay/StationsDisplay";

interface Props {

}

const STATIONS_URL = "https://localhost:7263/api/Station";

export default function StationsPage(props: Props) {
    const [stationSearchOptions, SetStationSearchOptions] = useState<StationSearchOptions>(DEFAULT_STATION_SEARCH_OPTIONS);

    const [stationsUrl, SetStationsUrl] = useState<URL>(new URL(STATIONS_URL));

    const [stationsPage, SetStationsPage] = useState<FetchedStationsPage | null>(null);

    const [fetchError, SetFetchError] = useState("");

    const [isWorking, SetIsWorking] = useState(false);

    function HandleFetchPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
        if (isWorking) {
            return;
        }

        let direction = event.currentTarget.getAttribute("data-direction");

        let url: URL;

        switch (direction) {
            case "next":
                url = new URL(stationsPage?.Next!)
                break;
            case "previous":
                url = new URL(stationsPage?.Previous!);
                break;
            default:
                url = stationsUrl;
                break;
        }

        FetchStationPage(url);
    }

    async function FetchStationPage(url: URL) {
        SetIsWorking(isWorking => true);

        SetFetchError(error => "");

        let stationsPage: FetchedStationsPage;

        try {
            stationsPage = await FetchStations(url);
        }
        catch (networkError) {
            SetFetchError(error => FetchErrors.NetworkError);

            SetIsWorking(isWorking => false);

            return;
        }

        SetStationsPage(sp => stationsPage);

        SetIsWorking(isWorking => false);
    }
    
    return (
        <div className="m-0.5">
            <StationsSearch stationSearchOptions={stationSearchOptions} SetStationSearchOptions={SetStationSearchOptions} OnFetchPointerDown={HandleFetchPointerDown}></StationsSearch>
            {
                fetchError.length > 0 ?
                    <FetchErrorDisplay fetchError={fetchError}></FetchErrorDisplay> :
                    null
            }
            {
                stationsPage !== null ?
                    <StationsDisplay stationsPage={stationsPage} OnFetchPointerDown={HandleFetchPointerDown} isWorking={isWorking}></StationsDisplay> :
                    null
            }
        </div>
    )
}
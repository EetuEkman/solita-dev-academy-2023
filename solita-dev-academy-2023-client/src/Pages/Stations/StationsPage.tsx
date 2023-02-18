import React, { useState } from "react";
import DEFAULT_STATION_SEARCH_OPTIONS from "../../Constants/DefaultStationSearchOptions";
import FetchedStationsPage from "../../Models/FetchedStationsPage";
import StationSearchOptions from "../../Models/StationSearchOptions";
import StationsSearch from "./Search/StationsSearch";
import StationsDisplay from "./StationsDisplay/StationsDisplay";

interface Props {

}

export default function StationsPage(props: Props) {
    const [stationSearchOptions, SetStationSearchOptions] = useState<StationSearchOptions>(DEFAULT_STATION_SEARCH_OPTIONS);

    const [stationsPage, SetStationsPage] = useState<FetchedStationsPage | null>();

    const [isWorking, setIsWorking] = useState(false);

    function HandleFetchPointerDown(event: React.PointerEvent<HTMLButtonElement>) {
        console.log("Fetch stations not yet implemented.");
    }
    
    return (
        <div className="m-0.5">
            <StationsSearch stationSearchOptions={stationSearchOptions} SetStationSearchOptions={SetStationSearchOptions} OnFetchPointerDown={HandleFetchPointerDown}></StationsSearch>
            {
                stationsPage ?
                    <StationsDisplay stationsPage={stationsPage} OnFetchPointerDown={HandleFetchPointerDown} isWorking={isWorking}></StationsDisplay> :
                    null
            }
        </div>
    )
}
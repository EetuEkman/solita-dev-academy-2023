import React from "react";
import FetchedStationsPage from "../../../Models/FetchedStationsPage";
import Station from "../../../Models/Station";
import PageNavigation from "../../Shared/PageNavigation";
import StationTable from "./StationTable";

interface Props {
    stationsPage: FetchedStationsPage;
    isWorking: boolean;
    OnFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function StationsDisplay(props: Props) {
    return (
        <div className="flex flex-col my-1 bg-bluish_grey-500 text-slate-400 shadow-md shadow-bluish_grey-500/50 rounded px-4 py-2">
            <StationTable stations={props.stationsPage.Stations}></StationTable>
            <div className="flex mb-1 sm:px-1 md:px-2 lg:px-4">
                <span className="text-slate-300">Found {props.stationsPage.Count} stations.</span>
            </div>
            <PageNavigation HandleFetchPointerDown={props.OnFetchPointerDown} isWorking={props.isWorking} page={props.stationsPage}></PageNavigation>
        </div>
    )
}
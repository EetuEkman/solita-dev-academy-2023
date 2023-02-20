import React from "react";
import FetchedJourneysPage from "../../../Models/FetchedJourneysPage";
import JourneyTable from "./JourneyTable";
import PageNavigation from "../../Shared/PageNavigation";

interface Props {
    isWorking: boolean;
    journeysPage: FetchedJourneysPage;
    HandleFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function JourneyDisplay(props: Props) {
    return (
        <div className="my-1 pb-2 bg-bluish_grey-500 text-slate-300 shadow-md shadow-bluish_grey-500/50 rounded">
            <JourneyTable journeys={props.journeysPage.Journeys} count={props.journeysPage.Count}></JourneyTable>
            <PageNavigation HandleFetchPointerDown={props.HandleFetchPointerDown} page={props.journeysPage} isWorking={props.isWorking}></PageNavigation>
        </div>
    )
}
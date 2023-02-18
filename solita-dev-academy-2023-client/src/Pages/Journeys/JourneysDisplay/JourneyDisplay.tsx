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
        <div className="pb-2 bg-bluish_grey-500 text-slate-300 rounded">
            <JourneyTable journeys={props.journeysPage.Journeys}></JourneyTable>
            <PageNavigation HandleFetchPointerDown={props.HandleFetchPointerDown} page={props.journeysPage} isWorking={props.isWorking}></PageNavigation>
        </div>
    )
}
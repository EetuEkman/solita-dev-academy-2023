import React from "react";
import FetchedJourneysPage from "../../../Models/FetchedJourneysPage";
import JourneyTable from "./JourneyTable";
import PageNavigation from "./PageNavigation";

interface Props {
    isWorking: boolean;
    page: FetchedJourneysPage;
    HandleFetchClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function JourneyDisplay(props: Props) {
    return (
        <div className="pb-2 bg-bluish_grey-500 text-slate-300 rounded">
            <JourneyTable journeys={props.page.Journeys}></JourneyTable>
            <PageNavigation HandleFetchClick={props.HandleFetchClick} page={props.page} isWorking={props.isWorking}></PageNavigation>
        </div>
    )
}
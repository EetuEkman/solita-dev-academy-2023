import React from "react";
import JourneyPage from "../Models/JourneyPage";
import JourneyTable from "./JourneyTable";
import PageNavigation from "./PageNavigation";

interface Props {
    isWorking: boolean;
    page: JourneyPage;
    handleFetchClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Journeys(props: Props) {
    return (
        <div>
            <JourneyTable journeys={props.page.Journeys}></JourneyTable>
            <PageNavigation handleFetchClick={props.handleFetchClick} page={props.page} isWorking={props.isWorking}></PageNavigation>
        </div>
    )
}
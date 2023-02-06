import React from "react";
import JourneyPage from "../Models/JourneyPage";
import JourneyTable from "./JourneyTable";

interface Props {
    journeyPage: JourneyPage;
}

export default function Journeys(props: Props) {
    return (
        <div>
            <JourneyTable journeys={props.journeyPage.Journeys}></JourneyTable>
        </div>
    )
}
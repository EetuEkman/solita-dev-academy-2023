import React from "react";
import FetchedStationsPage from "../../../Models/FetchedStationsPage";

interface Props {
    stationsPage: FetchedStationsPage;
    isWorking: boolean;
    OnFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function StationsDisplay(props: Props) {
    return (
        <div></div>
    )
}
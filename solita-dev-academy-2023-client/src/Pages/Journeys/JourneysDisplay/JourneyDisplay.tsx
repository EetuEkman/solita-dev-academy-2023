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
            <JourneyTable journeys={props.journeysPage.Journeys}></JourneyTable>

            <div className="flex mb-1 sm:px-1 md:px-2 lg:px-4 text-slate-300">
                {
                    props.journeysPage.Count === 1 ?
                        <span>Found {props.journeysPage.Count} journey.</span>
                        :
                        <span>Found {props.journeysPage.Count} journeys.</span>
                }
            </div>

            <PageNavigation HandleFetchPointerDown={props.HandleFetchPointerDown} page={props.journeysPage} isWorking={props.isWorking}></PageNavigation>
        </div>
    )
}
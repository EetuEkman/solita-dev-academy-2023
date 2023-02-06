import React from "react";
import JourneyPage from "../Models/JourneyPage";
import JourneyTable from "./JourneyTable";

interface Props {
    page: JourneyPage;
    handleFetchClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function Journeys(props: Props) {
    const count = props.page.Count;

    const pageCount = Math.ceil(count / 20);

    return (
        <div>
            <JourneyTable journeys={props.page.Journeys}></JourneyTable>
            <div>
                {
                    props.page.Previous ?
                        <button onClick={props.handleFetchClick} data-direction="previous">Previous</button>
                        :
                        <button disabled>Previous</button>
                }
                <div>
                    <span>Page {props.page.CurrentPage}</span>
                    <span>of</span>
                    <span>{pageCount}</span>
                </div>
                {
                    props.page.Next ?
                        <button onClick={props.handleFetchClick} data-direction="next">Next</button>
                        :
                        <button>Next</button>
                }
            </div>
        </div>
    )
}
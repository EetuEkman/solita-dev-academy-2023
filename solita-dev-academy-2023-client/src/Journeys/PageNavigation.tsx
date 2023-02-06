import React from "react";
import JourneyPage from "../Models/JourneyPage";

interface Props {
    isWorking: boolean;
    page: JourneyPage;
    handleFetchClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function PageNavigation(props: Props) {
    const count = props.page.Count;

    const pageCount = Math.ceil(count / 20);

    return (
        <div>
                {
                    props.page.Previous && props.isWorking === false ?
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
                    props.page.Next && props.isWorking === false ?
                        <button onClick={props.handleFetchClick} data-direction="next">Next</button>
                        :
                        <button disabled>Next</button>
                }
            </div>
    )
}
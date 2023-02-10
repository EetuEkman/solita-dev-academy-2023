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
        <div className="w-full flex flex-row justify-center flex-wrap items-center gap-2 bg-bluish_grey-500 text-slate-200">
                {
                    props.page.Previous && props.isWorking === false ?
                        <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded" onClick={props.handleFetchClick} data-direction="previous">Previous</button>
                        :
                        <button className="h-10 w-15 bg-gray-500/50 text-slate-400 py-2 px-4 rounded" disabled>Previous</button>
                }
                <div>
                    <span className="mx-1">Page {props.page.CurrentPage} of {pageCount}</span>
                </div>
                {
                    props.page.Next && props.isWorking === false ?
                        <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded" onClick={props.handleFetchClick} data-direction="next">Next</button>
                        :
                        <button className="h-10 w-15 bg-gray-500/50 text-slate-400 py-2 px-4 rounded" disabled>Next</button>
                }
            </div>
    )
}
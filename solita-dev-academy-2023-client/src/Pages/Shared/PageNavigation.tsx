import React from "react";
import FetchedPage from "../../Models/FetchedPage";

interface Props {
    isWorking: boolean;
    page: FetchedPage;
    HandleFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>
}

export default function PageNavigation(props: Props) {
    function CurrentPage(currentPage: number, count: number) {
        if (count === 0) {
            return 0;
        }

        return currentPage;
    }
    function CalculatePageCount(count: number): number {
        if (count === 0)
        {
            return 0;
        }

        if (count < 21)
        {
            return 1;
        }

        return Math.ceil(count / 20);
    }

    return (
        <div className="w-full flex flex-row justify-center flex-wrap items-center gap-2 bg-bluish_grey-500 text-slate-200">
                {
                    props.page.Previous && props.isWorking === false ?
                        <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded" onPointerDown={props.HandleFetchPointerDown} data-direction="previous">Previous</button>
                        :
                        <button className="h-10 w-15 bg-gray-500/50 text-slate-400 py-2 px-4 rounded" disabled>Previous</button>
                }
                <div>
                    <span className="mx-1">Page {CurrentPage(props.page.CurrentPage, props.page.Count)} of {CalculatePageCount(props.page.Count)}</span>
                </div>
                {
                    props.page.Next && props.isWorking === false ?
                        <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded" onPointerDown={props.HandleFetchPointerDown} data-direction="next">Next</button>
                        :
                        <button className="h-10 w-15 bg-gray-500/50 text-slate-400 py-2 px-4 rounded" disabled>Next</button>
                }
            </div>
    )
}
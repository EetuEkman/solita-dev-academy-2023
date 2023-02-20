import React from "react";
import { Sort } from "./JourneyTable";

interface Props {
    className?: string;
    value: string;
    sort: Sort;
    HandleTableHeaderDown: React.PointerEventHandler<HTMLTableCellElement>
}

export default function TableHeader(props: Props) {
    return (
        <>
            {
                props.sort.by === props.value ?
                    props.sort.descending ?
                        <th className={props.className + " h-7 justify-center items-center"} data-value={props.value} onPointerDown={props.HandleTableHeaderDown}>{props.value}<span>&uarr;</span></th>
                        :
                        <th className={props.className + " h-7 justify-center items-center"} data-value={props.value} onPointerDown={props.HandleTableHeaderDown}>{props.value}<span>&darr;</span></th>
                    :
                    <th className={props.className + " h-7 justify-center items-center"} data-value={props.value} onPointerDown={props.HandleTableHeaderDown}>{props.value}</th>
            }
        </>
    )
}
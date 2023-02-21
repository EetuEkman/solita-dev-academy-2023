import React from "react";
import { Sort } from "../../../Models/Sort";

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
                        <th className={props.className + " h-8"} data-value={props.value} onPointerDown={props.HandleTableHeaderDown}>{props.value}<span className="ml-1 text-lg text-yellow-500">&uarr;</span></th>
                        :
                        <th className={props.className + " h-8"} data-value={props.value} onPointerDown={props.HandleTableHeaderDown}>{props.value}<span className="ml-1 text-lg text-yellow-500">&darr;</span></th>
                    :
                    <th className={props.className + " h-8"} data-value={props.value} onPointerDown={props.HandleTableHeaderDown}>{props.value}</th>
            }
        </>
    )
}
import React from "react";
import { Sort } from "./JourneyTable";

interface Props {
    value: string;
    sort: Sort;
    handleTableHeaderDown: React.PointerEventHandler<HTMLTableCellElement>
}

export default function TableHeader(props: Props) {
    return (
        <>
            {
                props.sort.by === props.value ?
                    props.sort.descending ?
                        <th data-value={props.value} onPointerDown={props.handleTableHeaderDown}>{props.value}<span>&uarr;</span></th>
                        :
                        <th data-value={props.value} onPointerDown={props.handleTableHeaderDown}>{props.value}<span>&darr;</span></th>
                    :
                    <th data-value={props.value} onPointerDown={props.handleTableHeaderDown}>{props.value}</th>
            }
        </>
    )
}
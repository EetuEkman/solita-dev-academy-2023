import React, { useState, useEffect } from "react";
import Station from "../../../Models/Station";
import SortByOptions from "../../../Constants/StationSortByOptions";
import TableHeader from "./TableHeader";
import StationSortByOptions from "../../../Constants/StationSortByOptions";

interface Props {
    stations: Station[];
}

export interface Sort {
    by: string;
    descending: boolean;
}

interface Filter {
    text: string;
}

export default function StationTable(props: Props) {
    const [sort, SetSort] = useState<Sort>({ by: "", descending: true });

    const [filter, SetFilter] = useState<Filter>({ text: "" });

    const [stations, SetStations] = useState<Station[]>(SortStations(FilterStations(props.stations, filter), sort));

    function OnFilterTextChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let newFilter = { ...filter } as Filter;

        newFilter.text = value;

        SetFilter(filter => newFilter);
    }

    function FilterStations(stations: Station[], filter: Filter): Station[] {
        if (filter.text === "") {
            return stations;
        }

        let filteredStations = [...stations] as Station[];

        filteredStations = stations.filter(station => JSON.stringify(station).toLowerCase().indexOf(filter.text.toLowerCase()) > -1)

        return filteredStations;
    }

    function SortStations(stations: Station[], sort: Sort): Station[] {
        let sortedStations = [...stations];

        switch (sort.by) {
            case SortByOptions.AddressFi:
                sortedStations.sort(function (a, b) {
                    return b.Address_fi.localeCompare(a.Address_fi, "fi");
                })
                break;
            case SortByOptions.AddressSe:
                sortedStations.sort(function (a, b) {
                    return b.Address_se.localeCompare(a.Address_se, "fi");
                })
                break;
            case SortByOptions.NameFi:
                sortedStations.sort(function (a, b) {
                    return b.Name_fi.localeCompare(a.Name_fi, "fi");
                })
                break;
            case SortByOptions.NameSe:
                sortedStations.sort(function (a, b) {
                    return b.Name_se.localeCompare(a.Name_se, "fi");
                })
                break;
            case SortByOptions.NameEn:
                sortedStations.sort(function (a, b) {
                    return b.Name_en.localeCompare(a.Name_en, "fi");
                })
                break;
            case SortByOptions.Operator:
                sortedStations.sort(function (a, b) {
                    return b.Operator.localeCompare(a.Operator, "fi");
                })
                break;
            case SortByOptions.Capacity:
                sortedStations.sort(function (a, b) {
                    if (a.Capacity === null) return 1;

                    if (b.Capacity === null) return -1;

                    if (a.Capacity < b.Capacity) return -1;

                    if (a.Capacity > b.Capacity) return 1;

                    return 0;
                })
                break;
        }

        if (sort.descending === false) {
            sortedStations.reverse();
        }

        return sortedStations;
    }

    function HandleTableHeaderDown(event: React.PointerEvent<HTMLTableCellElement>) {
        event.stopPropagation();

        const value = event.currentTarget.getAttribute("data-value");

        if (!value || Object.values<string>(SortByOptions).includes(value) === false) {
            return;
        }

        let newSort = { ...sort } as Sort;

        if (newSort.by === value) {
            newSort.descending = !newSort.descending;
        }

        newSort.by = value;

        SetSort(sort => newSort);
    }

    useEffect(() => {
        SetStations(j => SortStations(FilterStations(props.stations, filter), sort))
    }, [sort, filter, props.stations])

    return (
        <div className="flex flex-col mb-1 py-1 sm:px-1 md:px-2 lg:px-4">
            <div className="flex flex-col overflow-auto pb-3 mb-1">
                <table className="w-full min-h-[50em] table-auto border-collapse">
                    <thead className="text-slate-300 border-b">
                        <tr>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.NameFi}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.NameSe}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.NameEn}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.AddressFi}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.AddressSe}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.Operator}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={sort} value={StationSortByOptions.Capacity}></TableHeader>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stations.map((station, index) => {
                                return (
                                    <tr key={index} className="border-y-[1px] first:border-y-0 last:border-y-0 border-slate-400">
                                        <td>{station.Name_fi}</td>
                                        <td>{station.Name_se}</td>
                                        <td>{station.Name_en}</td>
                                        <td>{station.Address_fi}</td>
                                        <td>{station.Address_fi}</td>
                                        <td>{station.Operator}</td>
                                        <td>{station.Capacity}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
            <div className="flex flex-row items-center py-1">
                <label>
                    Search
                    <input onChange={OnFilterTextChange} value={filter.text} type="text" className="ml-2 pl-1 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500"></input>
                </label>
            </div>
        </div>
    )
}
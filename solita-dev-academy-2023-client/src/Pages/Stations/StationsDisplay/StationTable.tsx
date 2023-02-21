import React, { useState, useEffect, Dispatch } from "react";
import { Link } from "react-router-dom";
import Station from "../../../Models/Station";
import { FilterSort } from "../../../Models/FilterSort";
import { Filter } from "../../../Models/Filter";
import { Sort } from "../../../Models/Sort";
import StationSortByOptions from "../../../Constants/StationSortByOptions";
import TableHeader from "./TableHeader";

interface Props {
    stations: Station[];
    filterSort: FilterSort;
    SetFilterSort: React.Dispatch<React.SetStateAction<FilterSort>>
}

export default function StationTable(props: Props) {
    const [stations, SetStations] = useState<Station[]>(SortStations(FilterStations(props.stations, props.filterSort.filter), props.filterSort.sort));

    function OnFilterTextChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let newFilterSort = { ...props.filterSort } as FilterSort;

        newFilterSort.filter.text = value;

        props.SetFilterSort(filterSort => newFilterSort);
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
            case StationSortByOptions.AddressFi:
                sortedStations.sort(function (a, b) {
                    return b.Address_fi.localeCompare(a.Address_fi, "fi");
                })
                break;
            case StationSortByOptions.AddressSe:
                sortedStations.sort(function (a, b) {
                    return b.Address_se.localeCompare(a.Address_se, "fi");
                })
                break;
            case StationSortByOptions.NameFi:
                sortedStations.sort(function (a, b) {
                    return b.Name_fi.localeCompare(a.Name_fi, "fi");
                })
                break;
            case StationSortByOptions.NameSe:
                sortedStations.sort(function (a, b) {
                    return b.Name_se.localeCompare(a.Name_se, "fi");
                })
                break;
            case StationSortByOptions.NameEn:
                sortedStations.sort(function (a, b) {
                    return b.Name_en.localeCompare(a.Name_en, "fi");
                })
                break;
            case StationSortByOptions.Operator:
                sortedStations.sort(function (a, b) {
                    return b.Operator.localeCompare(a.Operator, "fi");
                })
                break;
            case StationSortByOptions.Capacity:
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

        if (!value || Object.values<string>(StationSortByOptions).includes(value) === false) {
            return;
        }

        let newFilterSort = { ...props.filterSort } as FilterSort;

        if (newFilterSort.sort.by === value) {
            newFilterSort.sort.descending = !newFilterSort.sort.descending;
        }

        newFilterSort.sort.by = value;

        props.SetFilterSort(filterSort => newFilterSort);
    }

    useEffect(() => {
        SetStations(j => SortStations(FilterStations(props.stations, props.filterSort.filter), props.filterSort.sort))
    }, [props.filterSort, props.stations])

    return (
        <div className="flex flex-col mb-1 py-1 sm:px-1 md:px-2 lg:px-4">
            <div className="flex flex-col overflow-auto pb-3 mb-1">
                <table className="w-full min-h-[50em] table-auto border-collapse">
                    <thead className="text-slate-300 border-b">
                        <tr>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.NameFi}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.NameSe}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.NameEn}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.AddressFi}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.AddressSe}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.Operator}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} sort={props.filterSort.sort} value={StationSortByOptions.Capacity}></TableHeader>
                            <th></th>
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
                                        <td>
                                            <Link to={"/station/" + station.Id} className="bg-yellow-500 text-bluish_grey-500 font-bold px-2 py-1 rounded">Details</Link>
                                        </td>
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
                    <input onChange={OnFilterTextChange} value={props.filterSort.filter.text} type="text" className="ml-2 pl-1 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500"></input>
                </label>
            </div>
        </div>
    )
}
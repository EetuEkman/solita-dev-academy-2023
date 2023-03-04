import React, { useEffect, useState } from "react";
import JourneySortByOptions from "../../../Constants/JourneySortByOptions";
import { Filter } from "../../../Models/Filter";
import { Sort } from "../../../Models/Sort";
import Journey from "../../../Models/Journey";
import TableHeader from "./TableHeader";

interface Props {
    journeys: Journey[];
}

export default function JourneyTable(props: Props) {
    const [sort, setSort] = useState<Sort>({ by: JourneySortByOptions.Departure, descending: true });

    const [filter, setFilter] = useState<Filter>({ text: "" });

    const [journeys, setJourneys] = useState<Journey[]>(SortJourneys(FilterJourneys(props.journeys, filter), sort));

    function OnFilterTextChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let newFilter = { ...filter } as Filter;

        newFilter.text = value;

        setFilter(f => newFilter);
    }

    function FilterJourneys(journeys: Journey[], filter: Filter): Journey[] {
        if (filter.text === "") {
            return journeys;
        }

        let filteredJourneys = [...journeys] as Journey[];

        filteredJourneys = journeys.filter(journey => JSON.stringify(journey).toLowerCase().indexOf(filter.text.toLowerCase()) > -1)

        return filteredJourneys;
    }

    function SortJourneys(journeys: Journey[], sort: Sort): Journey[] {
        let sortedJourneys = [...journeys];

        switch (sort.by) {
            case JourneySortByOptions.Departure:
                sortedJourneys.sort(function (a, b) {
                    let firstDate = new Date(a.Departure);
                    let secondDate = new Date(b.Departure);

                    if (firstDate < secondDate) return -1;

                    if (firstDate > secondDate) return 1;

                    return 0;
                })
                break;
            case JourneySortByOptions.Return:
                sortedJourneys.sort(function (a, b) {
                    let firstDate = new Date(a.Return);
                    let secondDate = new Date(b.Return);

                    if (firstDate < secondDate) return -1;

                    if (firstDate > secondDate) return 1;

                    return 0;
                })
                break;
            case JourneySortByOptions.DepartureStationNameFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_name_fi.localeCompare(a.Departure_station_name_fi, "fi");
                })
                break;
            case JourneySortByOptions.DepartureStationNameSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_name_se.localeCompare(a.Departure_station_name_se, "fi");
                })
                break;
            case JourneySortByOptions.DepartureStationNameEn:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_name_en.localeCompare(a.Departure_station_name_en, "fi");
                })
                break;
            case JourneySortByOptions.DepartureStationAddressFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_address_fi.localeCompare(a.Departure_station_address_fi, "fi");
                })
                break;
            case JourneySortByOptions.DepartureStationAddressSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_address_se.localeCompare(a.Departure_station_address_se, "fi");
                })
                break;
            case JourneySortByOptions.ReturnStationNameFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_name_fi.localeCompare(a.Return_station_name_fi, "fi");
                })
                break;
            case JourneySortByOptions.ReturnStationNameSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_name_se.localeCompare(a.Return_station_name_se, "fi");
                })
                break;
            case JourneySortByOptions.ReturnStationNameEn:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_name_en.localeCompare(a.Return_station_name_en, "fi");
                })
                break;
            case JourneySortByOptions.ReturnStationAddressFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_address_fi.localeCompare(a.Return_station_address_fi, "fi");
                })
                break;
            case JourneySortByOptions.ReturnStationAddressSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_address_se.localeCompare(a.Return_station_address_se, "fi");
                })
                break;
            case JourneySortByOptions.Duration:
                sortedJourneys.sort(function (a, b) {
                    if (a.Duration < b.Duration) return -1;

                    if (a.Duration > b.Duration) return 1;

                    return 0;
                })
                break;
            case JourneySortByOptions.Distance:
                sortedJourneys.sort(function (a, b) {
                    if (a.Covered_distance < b.Covered_distance) return -1;

                    if (a.Covered_distance > b.Covered_distance) return 1;

                    return 0;
                })
                break;
        }

        if (sort.descending === false) {
            sortedJourneys.reverse();
        }

        return sortedJourneys;
    }

    function HandleTableHeaderDown(event: React.PointerEvent<HTMLTableCellElement>) {
        event.stopPropagation();

        const value = event.currentTarget.getAttribute("data-value");

        if (!value || Object.values<string>(JourneySortByOptions).includes(value) === false) {
            return;
        }

        let newSort = { ...sort } as Sort;

        if (newSort.by === value) {
            newSort.descending = !newSort.descending;
        }

        newSort.by = value;

        setSort(s => newSort);
    }

    function SecondsToMinutes(seconds: number): number {
        let minutes = seconds / 60;

        return minutes;
    }

    function MetersToKilometers(meters: number): number {
        let kilometers = (meters / 1000);

        return kilometers;
    }

    useEffect(() => {
        setJourneys(j => SortJourneys(FilterJourneys(props.journeys, filter), sort))
    }, [sort, filter, props.journeys])

    return (
        <div className="flex flex-col justify-start py-1 sm:px-1 md:px-2 lg:px-4">
            <div className=" min-h-[31.5em] overflow-auto pb-2.5 mb-0.5">
                <table className="w-full h-full table-auto border-collapse text-slate-400">
                    <thead className="text-md text-slate-300 border-b-2 border-slate-300">
                        <tr>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.Departure} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.Return} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.DepartureStationNameFi} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.DepartureStationNameSe} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.DepartureStationNameEn} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.DepartureStationAddressFi} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.DepartureStationAddressSe} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.ReturnStationNameFi} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.ReturnStationNameSe} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.ReturnStationNameEn} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.ReturnStationAddressFi} sort={sort}></TableHeader>
                            <TableHeader HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.ReturnStationAddressSe} sort={sort}></TableHeader>
                            <TableHeader className="kilometers_tooltip" HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.Distance} sort={sort}></TableHeader>
                            <TableHeader className="minutes_tooltip" HandleTableHeaderDown={HandleTableHeaderDown} value={JourneySortByOptions.Duration} sort={sort}></TableHeader>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {
                            journeys.map((journey, index) => {
                                return (
                                    <tr className="border-y-[1px] first:border-y-0 last:border-y-0 border-slate-400" key={index}>
                                        <td>{new Date(journey.Departure).toLocaleString("fi-FI")}</td>
                                        <td>{new Date(journey.Return).toLocaleString("fi-FI")}</td>
                                        <td>{journey.Departure_station_name_fi}</td>
                                        <td>{journey.Departure_station_name_se}</td>
                                        <td>{journey.Departure_station_name_en}</td>
                                        <td>{journey.Departure_station_address_fi}</td>
                                        <td>{journey.Departure_station_address_se}</td>
                                        <td>{journey.Return_station_name_fi}</td>
                                        <td>{journey.Return_station_name_se}</td>
                                        <td>{journey.Return_station_name_en}</td>
                                        <td>{journey.Return_station_address_fi}</td>
                                        <td>{journey.Return_station_address_se}</td>
                                        <td>{MetersToKilometers(journey.Covered_distance).toFixed(3)}</td>
                                        <td>{SecondsToMinutes(journey.Duration).toFixed(2)}</td>
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
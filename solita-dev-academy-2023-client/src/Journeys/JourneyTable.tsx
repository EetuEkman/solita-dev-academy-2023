import React, { useEffect, useState } from "react";
import SortByOptions from "../Constants/SortByOptions";
import Journey from "../Models/Journey";
import TableHeader from "./TableHeader";

interface Props {
    journeys: Journey[];
}

export interface Sort {
    by: string;
    descending: boolean;
}

interface Filter {
    text: string;
}

export default function JourneyTable(props: Props) {
    const [sort, setSort] = useState<Sort>({ by: SortByOptions.Departure, descending: true });

    const [filter, setFilter] = useState<Filter>({ text: ""});

    const [journeys, setJourneys] = useState<Journey[]>(props.journeys);

    function onFilterTextChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let newFilter = {...filter} as Filter;

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
    
    function sortJourneys(journeys: Journey[], sort: Sort): Journey[] {
        let sortedJourneys = [...journeys];

        switch (sort.by) {
            case SortByOptions.Departure:
                sortedJourneys.sort(function (a, b) {
                    let firstDate = new Date(a.Departure);
                    let secondDate = new Date(b.Departure);

                    if (firstDate < secondDate) return -1;

                    if (firstDate > secondDate) return 1;

                    return 0;
                })
                break;
            case SortByOptions.Return:
                sortedJourneys.sort(function (a, b) {
                    let firstDate = new Date(a.Return);
                    let secondDate = new Date(b.Return);

                    if (firstDate < secondDate) return -1;

                    if (firstDate > secondDate) return 1;

                    return 0;
                })
                break;
            case SortByOptions.DepartureStationNameFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_name_fi.localeCompare(a.Departure_station_name_fi);
                })
                break;
            case SortByOptions.DepartureStationNameSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_name_se.localeCompare(a.Departure_station_name_se);
                })
                break;
            case SortByOptions.DepartureStationNameEn:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_name_en.localeCompare(a.Departure_station_name_en);
                })
                break;
            case SortByOptions.DepartureStationAddressFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_address_fi.localeCompare(a.Departure_station_address_fi);
                })
                break;
            case SortByOptions.DepartureStationAddressSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Departure_station_address_se.localeCompare(a.Departure_station_address_se);
                })
                break;
            case SortByOptions.ReturnStationNameFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_name_fi.localeCompare(a.Return_station_name_fi);
                })
                break;
            case SortByOptions.ReturnStationNameSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_name_se.localeCompare(a.Return_station_name_se);
                })
                break;
            case SortByOptions.ReturnStationNameEn:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_name_en.localeCompare(a.Return_station_name_en);
                })
                break;
            case SortByOptions.ReturnStationAddressFi:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_address_fi.localeCompare(a.Return_station_address_fi);
                })
                break;
            case SortByOptions.ReturnStationAddressSe:
                sortedJourneys.sort(function (a, b) {
                    return b.Return_station_address_se.localeCompare(a.Return_station_address_se);
                })
                break;
            case SortByOptions.Duration:
                sortedJourneys.sort(function (a, b) {
                    if (a.Duration < b.Duration) return -1;

                    if (a.Duration > b.Duration) return 1;

                    return 0;
                })
                break;
            case SortByOptions.Distance:
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

    function handleTableHeaderDown(event: React.PointerEvent<HTMLTableCellElement>) {
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

        setSort(s => newSort);
    }

    useEffect(() => {
        setJourneys(j => sortJourneys(FilterJourneys(props.journeys, filter), sort));
    }, [filter])

    useEffect(() => {
        setJourneys(j => sortJourneys(j, sort));
    }, [sort])

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.Departure} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.Return} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.DepartureStationNameFi} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.DepartureStationNameSe} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.DepartureStationNameEn} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.DepartureStationAddressFi} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.DepartureStationAddressSe} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.ReturnStationNameFi} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.ReturnStationNameSe} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.ReturnStationNameEn} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.ReturnStationAddressFi} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.ReturnStationAddressSe} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.Distance} sort={sort}></TableHeader>
                        <TableHeader handleTableHeaderDown={handleTableHeaderDown} value={SortByOptions.Duration} sort={sort}></TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {
                        journeys.map((journey, index) => {
                            return (
                                <tr key={index}>
                                    <td>{new Date(journey.Departure).toLocaleString("fi-FI")}</td>
                                    <td>{new Date(journey.Return).toLocaleString("fi-FI")}</td>
                                    <td>{journey.Departure_station_name_fi}</td>
                                    <td>{journey.Departure_station_address_se}</td>
                                    <td>{journey.Departure_station_name_en}</td>
                                    <td>{journey.Departure_station_address_fi}</td>
                                    <td>{journey.Departure_station_address_se}</td>
                                    <td>{journey.Return_station_name_fi}</td>
                                    <td>{journey.Return_station_name_se}</td>
                                    <td>{journey.Return_station_name_en}</td>
                                    <td>{journey.Return_station_address_fi}</td>
                                    <td>{journey.Return_station_address_se}</td>
                                    <td>{journey.Covered_distance}</td>
                                    <td>{journey.Duration}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            <div>
                <label>
                    Filter by text
                    <input onChange={onFilterTextChange} value={filter.text} type="text"></input>
                </label>
            </div>
        </div>
    )
}
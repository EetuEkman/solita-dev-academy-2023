import React from "react";
import SearchOptionNames from "../Constants/SearchOptionNames";
import SearchOptions from "../Models/SearchOptions";
import DatePicker from "./DatePicker";

interface Props {
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function JourneySearch(props: Props) {
    function onTextChange(event: React.FormEvent<HTMLInputElement>) { 
        let value = event.currentTarget.value;

        let id = event.currentTarget.id;

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        switch (id) {
            case SearchOptionNames.CoveredDistanceFrom:
                searchOptions.CoveredDistanceFrom = "";
                break;
            case SearchOptionNames.CoveredDistanceTo:
                searchOptions.CoveredDistanceTo = "";
                break;
            case SearchOptionNames.DurationFrom:
                searchOptions.CoveredDistanceFrom = "";
                break;
            case SearchOptionNames.DurationTo:
                searchOptions.CoveredDistanceTo = "";
                break;
            default:
                return;
        }

        props.setSearchOptions(so => searchOptions);
    }

    return (
        <div className="search">
            <div>
                <DatePicker name={SearchOptionNames.DepartureDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker name={SearchOptionNames.DepartureDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div>
                <DatePicker name={SearchOptionNames.ReturnDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker name={SearchOptionNames.ReturnDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div>
                <label htmlFor="covered_distance_from">Covered distance from</label>
                <input value={props.searchOptions.CoveredDistanceFrom} type="text" id="covered_distance_from"></input>
                <label htmlFor="covered_distance_to">Covered distance to</label>
                <input value={props.searchOptions.CoveredDistanceTo} type="text" id="covered_distance_to"></input>
            </div>

            <div>
                <label htmlFor="duration_from">Duration from</label>
                <input value={props.searchOptions.DurationFrom} type="text" id="duration_from"></input>
                <label htmlFor="duration_to">Duration to</label>
                <input value={props.searchOptions.DurationTo} type="text" id="duration_to"></input>
            </div>

            <div>
                <label htmlFor="Departure_station_name_fi">Departure station name fi</label>
                <input value={props.searchOptions.DepartureStationNameFi} type="text" id="Departure_station_name_fi"></input>
                <label htmlFor="Departure_station_name_se">Departure station name se</label>
                <input value={props.searchOptions.DepartureStationNameSe} type="text" id="Departure_station_name_se"></input>
                <label htmlFor="Departure_station_name_en">Departure station name en</label>
                <input value={props.searchOptions.DepartureStationNameEn} type="text" id="Departure_station_name_en"></input>
            </div>

            <div>
                <label htmlFor="Return_station_name_fi">Return station name</label>
                <input value={props.searchOptions.ReturnStationNameFi} type="text" id="Return_station_name_fi"></input>
                <label htmlFor="Return_station_name_se">Return station name se</label>
                <input value={props.searchOptions.ReturnStationNameSe} type="text" id="Return_station_name_se"></input>
                <label htmlFor="Return_station_name_en">Return station name en</label>
                <input value={props.searchOptions.ReturnStationNameEn} type="text" id="Return_station_name_en"></input>
            </div>
        </div>
    )
}

/*
export default interface SearchOptions {
    DepartureDateFrom: Date;
    DepartureDateTo: Date;
    ReturnDateFrom: Date;
    ReturnDateTo: Date;
    CoveredDistanceFrom: number;
    CoveredDistanceTo: number;
    DurationFrom: number;
    DurationTo: number;
    DepartureStationNameFi: string;
    DepartureStationNameSe: string;
    DepartureStationNameEn: string;
    ReturnStationNameFi: string;
    ReturnStationNameSe: string;
    ReturnStationNameEn: string;
    Page: number;
}
*/
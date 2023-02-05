import React from "react";
import SearchOptionNames from "../Constants/SearchOptionNames";
import SearchOptions from "../Models/SearchOptions";

interface Props {
    value: string;
    option: string;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

export default function TextInput(props: Props) {
    function onChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let option = event.currentTarget.getAttribute("data-option");

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        switch (option) {
            case SearchOptionNames.CoveredDistanceFrom:
                searchOptions.CoveredDistanceFrom = value;
                break;
            case SearchOptionNames.CoveredDistanceTo:
                searchOptions.CoveredDistanceTo = value;
                break;
            case SearchOptionNames.DurationFrom:
                searchOptions.DurationFrom = value;
                break;
            case SearchOptionNames.DurationTo:
                searchOptions.DurationTo = value;
                break;
            case SearchOptionNames.DepartureStationNameFi:
                searchOptions.DepartureStationNameFi = value;
                break;
            case SearchOptionNames.DepartureStationNameSe:
                searchOptions.DepartureStationNameSe = value;
                break;
            case SearchOptionNames.DepartureStationNameEn:
                searchOptions.DepartureStationNameEn = value;
                break;
            case SearchOptionNames.ReturnStationNameFi:
                searchOptions.ReturnStationNameFi = value;
                break;
            case SearchOptionNames.ReturnStationNameSe:
                searchOptions.ReturnStationNameSe = value;
                break;
            case SearchOptionNames.ReturnStationNameEn:
                searchOptions.ReturnStationNameEn = value;
                break;
            default:
                return;
        }

        props.setSearchOptions(so => searchOptions);
    }

    return (
        <label>
            {props.option}
            <input value={props.value} onChange={onChange} data-option={props.option} type="text"></input>
        </label>
    )
}
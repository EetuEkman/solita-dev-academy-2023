import React from "react";
import SearchOptionNames from "../../../Constants/SearchOptionNames";
import SearchOptions from "../../../Models/SearchOptions";

interface Props {
    value: string;
    option: string;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

export default function TextInput(props: Props) {
    function OnChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        switch (props.option) {
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
            {
                props.option === SearchOptionNames.CoveredDistanceFrom || props.option === SearchOptionNames.CoveredDistanceTo ?
                    <span className="meters_tooltip">{props.option}</span>
                    :
                    props.option === SearchOptionNames.DurationFrom || props.option === SearchOptionNames.DurationTo ?
                        <span className="seconds_tooltip">{props.option}</span>
                        :
                        <span>{props.option}</span>
            }
            <input value={props.value} onChange={OnChange} type="text" className="mx-1 px-1 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500"></input>
        </label>
    )
}
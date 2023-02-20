import React from "react";
import SearchOptionNames from "../../../Constants/JourneySearchLabelTexts";
import SearchOptions from "../../../Models/JourneySearchOptions";

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
        <div className="h-8 flex items-center my-0.5">
            <label>
                {
                    props.option === SearchOptionNames.CoveredDistanceFrom || props.option === SearchOptionNames.CoveredDistanceTo ?
                        <span className="w-48 inline-block meters_tooltip">{props.option}</span>
                        :
                        props.option === SearchOptionNames.DurationFrom || props.option === SearchOptionNames.DurationTo ?
                            <span className="w-48 inline-block seconds_tooltip">{props.option}</span>
                            :
                            <span className="w-48 inline-block">{props.option}</span>
                }
                <input value={props.value} onChange={OnChange} type="text" className="w-48 px-1.5 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500"></input>
            </label>
        </div>
    )
}
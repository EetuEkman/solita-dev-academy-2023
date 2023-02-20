import React from "react";
import SearchOptionNames from "../../../Constants/SearchOptionNames";
import SearchOptions from "../../../Models/JourneySearchOptions";

interface Props {
    value: number | null;
    option: string;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

export default function NumberInput(props: Props) {
    function OnChange(event: React.FormEvent<HTMLInputElement>) {
        let number: number | null = null;

        let value = event.currentTarget.value;

        if (value) {
            number = Number.parseInt(event.currentTarget.value);

            if (Number.isNaN(number) || number < 0) {
                return;
            }
        }

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        switch (props.option) {
            case SearchOptionNames.CoveredDistanceFrom:
                searchOptions.CoveredDistanceFrom = number;
                break;
            case SearchOptionNames.CoveredDistanceTo:
                searchOptions.CoveredDistanceTo = number;
                break;
            case SearchOptionNames.DurationFrom:
                searchOptions.DurationFrom = number;
                break;
            case SearchOptionNames.DurationTo:
                searchOptions.DurationTo = number;
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
                            <span className="w-48 inline-block ">{props.option}</span>
                }
                <input value={props.value ? props.value.toString() : ""} onChange={OnChange} type="text" className="w-48 px-1.5 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500"></input>
            </label>
        </div>
    )
}
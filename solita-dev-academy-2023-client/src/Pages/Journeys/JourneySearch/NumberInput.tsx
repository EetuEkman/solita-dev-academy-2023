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
            <input value={props.value ? props.value.toString() : ""} onChange={OnChange} type="text" className="mx-1 px-1 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500"></input>
        </label>
    )
}
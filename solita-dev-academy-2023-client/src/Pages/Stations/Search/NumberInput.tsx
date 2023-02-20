import React from "react";
import StationSearchLabelTexts from "../../../Constants/StationSearchLabelTexts";
import StationSearchOptions from "../../../Models/StationSearchOptions";

interface Props {
    labelText: string;
    value: number | null;
    stationSearchOptions: StationSearchOptions;
    SetStationSearchOptions: React.Dispatch<React.SetStateAction<StationSearchOptions>>;
}

export default function NumberInput(props: Props) {
    function OnChange(event: React.FormEvent<HTMLInputElement>) {
        let stationSearchOptions = { ...props.stationSearchOptions } as StationSearchOptions;

        let value = event.currentTarget.value;

        // If input is empty, set search option values to null.

        let number: number | null = null;

        if (value) {
            number = Number.parseInt(event.currentTarget.value);

            if ( Number.isNaN(number) || number < 0) {
                return;
            }
        }
        
        switch (props.labelText) {
            case StationSearchLabelTexts.CapacityFrom:
                stationSearchOptions.CapacityFrom = number
                break;
            case StationSearchLabelTexts.CapacityTo:
                stationSearchOptions.CapacityTo = number
                break;
            default:
                return;
        }

        props.SetStationSearchOptions(sso => stationSearchOptions);
    }

    return (
        <div className="h-8 flex items-center my-0.5">
            <label className="h-fit py-0.5 flex items-center">
                <span className="w-48">{props.labelText}</span>
                <input onChange={OnChange} value={props.value ? props.value : ""} type="text" className="w-48 px-1.5 border-2 bg-slate-200 border-black_accent-500 text-black_accent-500"></input>
            </label>
        </div>
    )
}
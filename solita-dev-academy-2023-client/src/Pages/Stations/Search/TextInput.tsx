import React from "react";
import StationSearchLabelTexts from "../../../Constants/StationSearchLabelTexts";
import StationSearchOptions from "../../../Models/StationSearchOptions";

interface Props {
    labelText: string;
    value: string;
    stationSearchOptions: StationSearchOptions;
    SetStationSearchOptions: React.Dispatch<React.SetStateAction<StationSearchOptions>>;
}

export default function TextInput(props: Props) {
    function OnChange(event: React.FormEvent<HTMLInputElement>) {
        let stationSearchOptions = { ...props.stationSearchOptions } as StationSearchOptions;

        switch (props.labelText) {
            case StationSearchLabelTexts.AddressFi:
                stationSearchOptions.AddressFi = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.AddressSe:
                stationSearchOptions.AddressSe = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.NameFi:
                stationSearchOptions.NameFi = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.NameSe:
                stationSearchOptions.NameSe = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.NameEn:
                stationSearchOptions.NameEn = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.Operator:
                stationSearchOptions.Operator = event.currentTarget.value;
                break;
            default:
                return;
        }

        props.SetStationSearchOptions(sso => stationSearchOptions);
    }

    return (
        <div className="w-full h-8 flex flex-row justify-start align-middle my-0.5">
            <label className="h-fit py-0.5 flex flex-row justify-start align-middle">
                <span className="w-32">{props.labelText}</span>
                <input className="w-48 px-1 border-2 border-black_accent-500 text-black_accent-500" onChange={OnChange} value={props.value} type="text"></input>
            </label>
        </div>
    )
}
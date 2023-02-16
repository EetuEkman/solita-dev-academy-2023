import React from "react";
import StationSearchLabelTexts from "../../../Constants/StationSearchLabelTexts";
import StationSearchOptions from "../../../Models/StationSearchOptions";

interface Props {
    labelText: string;
    value: string;
    stationSearchOptions: StationSearchOptions;
    Set: React.Dispatch<React.SetStateAction<StationSearchOptions>>;
}

export default function TextInput(props: Props) {
    function OnChange(event: React.FormEvent<HTMLInputElement>) {
        let stationSearchOptions = { ...props.stationSearchOptions } as StationSearchOptions;

        switch (props.labelText) {
            case StationSearchLabelTexts.AddressFi:
                stationSearchOptions.Address_fi = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.AddressSe:
                stationSearchOptions.Address_se = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.NameFi:
                stationSearchOptions.Name_fi = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.NameSe:
                stationSearchOptions.Name_se = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.NameEn:
                stationSearchOptions.Name_en = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.Operator:
                stationSearchOptions.Operator = event.currentTarget.value;
                break;
            case StationSearchLabelTexts.Capacity:
                stationSearchOptions.Capacity = event.currentTarget.value;
                break;
            default:
                return;
        }

        props.Set(sso => stationSearchOptions);
    }

    return (
        <div className="w-full my-0.5">
            <label className="flex flex-row">
                <span className="w-24">{props.labelText}</span>
                <input className="px-1 border-2 border-black_accent-500 text-black_accent-500" onChange={OnChange} value={props.value} type="text"></input>
            </label>
        </div>
    )
}
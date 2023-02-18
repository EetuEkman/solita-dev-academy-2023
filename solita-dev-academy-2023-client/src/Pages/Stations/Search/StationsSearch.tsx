import React from "react";
import DEFAULT_STATION_SEARCH_OPTIONS from "../../../Constants/DefaultStationSearchOptions";
import StationSearchLabelTexts from "../../../Constants/StationSearchLabelTexts";
import StationSearchOptions from "../../../Models/StationSearchOptions";
import TextInput from "./TextInput";

interface Props {
    stationSearchOptions: StationSearchOptions;
    SetStationSearchOptions: React.Dispatch<React.SetStateAction<StationSearchOptions>>;
    OnFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function StationsSearch(props: Props) {
    function ClearStationSearchOptions() {
        let stationSearchOptions = {...DEFAULT_STATION_SEARCH_OPTIONS} as StationSearchOptions;

        props.SetStationSearchOptions(sso => stationSearchOptions);
    }

    return (
        <div className="w-full max-w-fit flex flex-col mb-0.5 py-6 px-12 bg-bluish_grey-500 text-slate-300 shadow-md rounded">
            <form onSubmit={event => {event.preventDefault()}}>
                <TextInput labelText={StationSearchLabelTexts.NameFi} value={props.stationSearchOptions.Name_fi} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.NameSe} value={props.stationSearchOptions.Name_se} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.NameEn} value={props.stationSearchOptions.Name_en} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.AddressFi} value={props.stationSearchOptions.Address_fi} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.AddressSe} value={props.stationSearchOptions.Address_se} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.Operator} value={props.stationSearchOptions.Operator} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.Capacity} value={props.stationSearchOptions.Capacity} stationSearchOptions={props.stationSearchOptions} Set={props.SetStationSearchOptions}></TextInput>
                <div className="mt-2">
                    <button onPointerDown={props.OnFetchPointerDown} className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 mr-1 font-bold rounded">Search</button>
                    <button onPointerDown={ClearStationSearchOptions} className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded">Clear</button>
                </div>
            </form>
        </div>
    )
}
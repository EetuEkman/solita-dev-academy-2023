import React from "react";
import DEFAULT_STATION_SEARCH_OPTIONS from "../../../Constants/DefaultStationSearchOptions";
import StationSearchLabelTexts from "../../../Constants/StationSearchLabelTexts";
import StationSearchOptions from "../../../Models/StationSearchOptions";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";

interface Props {
    isWorking: boolean;
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
        <div className="w-full flex flex-col mb-2 py-4 px-8 bg-bluish_grey-500 text-slate-300 shadow-md shadow-bluish_grey-500/50 rounded">
            <form onSubmit={event => {event.preventDefault()}}>
                <TextInput labelText={StationSearchLabelTexts.NameFi} value={props.stationSearchOptions.NameFi} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.NameSe} value={props.stationSearchOptions.NameSe} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.NameEn} value={props.stationSearchOptions.NameEn} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.AddressFi} value={props.stationSearchOptions.AddressFi} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.AddressSe} value={props.stationSearchOptions.AddressSe} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></TextInput>
                <TextInput labelText={StationSearchLabelTexts.Operator} value={props.stationSearchOptions.Operator} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></TextInput>
                
                <NumberInput labelText={StationSearchLabelTexts.CapacityFrom} value={props.stationSearchOptions.CapacityFrom} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></NumberInput>
                <NumberInput labelText={StationSearchLabelTexts.CapacityTo} value={props.stationSearchOptions.CapacityTo} stationSearchOptions={props.stationSearchOptions} SetStationSearchOptions={props.SetStationSearchOptions}></NumberInput>

                <div className="mt-2">
                    {
                        props.isWorking ?
                        <button className="h-10 w-15 bg-gray-500/50 text-bluish_grey-500 font-bold mr-1 py-2 px-4 rounded" disabled>Search</button>
                        :
                        <button onPointerDown={props.OnFetchPointerDown} className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 mr-1 font-bold rounded">Search</button>
                    }
                    <button onPointerDown={ClearStationSearchOptions} className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded">Clear</button>
                </div>
            </form>
        </div>
    )
}
import React from "react";
import SearchOptionNames from "../Constants/SearchOptionNames";
import SearchOptions from "../Models/SearchOptions";
import DatePicker from "./DatePicker";
import TextInput from "./TextInput";

interface Props {
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function JourneySearch(props: Props) {
    return (
        <div className="search">
            <div>
                <DatePicker date={props.searchOptions.DepartureDateFrom} option={SearchOptionNames.DepartureDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.DepartureDateTo} option={SearchOptionNames.DepartureDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div>
                <DatePicker date={props.searchOptions.DepartureDateFrom} option={SearchOptionNames.ReturnDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.DepartureDateTo} option={SearchOptionNames.ReturnDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div>
                <TextInput value={props.searchOptions.CoveredDistanceFrom} option={SearchOptionNames.CoveredDistanceFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.CoveredDistanceTo} option={SearchOptionNames.CoveredDistanceTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div>
                <TextInput value={props.searchOptions.DurationFrom} option={SearchOptionNames.DurationFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DurationTo} option={SearchOptionNames.DurationTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div>
                <TextInput value={props.searchOptions.DepartureStationNameFi} option={SearchOptionNames.DepartureStationNameFi} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DepartureStationNameSe} option={SearchOptionNames.DepartureStationNameSe} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DepartureStationNameEn} option={SearchOptionNames.DepartureStationNameEn} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div>
                <TextInput value={props.searchOptions.ReturnStationNameFi} option={SearchOptionNames.ReturnStationNameFi} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameSe} option={SearchOptionNames.ReturnStationNameSe} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameEn} option={SearchOptionNames.ReturnStationNameEn} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>
        </div>
    )
}
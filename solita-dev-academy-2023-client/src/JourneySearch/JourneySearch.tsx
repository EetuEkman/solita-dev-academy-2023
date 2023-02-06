import React from "react";
import DEFAULT_SEARCH_OPTIONS from "../Constants/DefaultSearchOptions";
import SearchOptionNames from "../Constants/SearchOptionNames";
import SearchOptions from "../Models/SearchOptions";
import DatePicker from "./DatePicker";
import TextInput from "./TextInput";

interface Props {
    isWorking: boolean;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
    onFetchClick: React.MouseEventHandler<HTMLButtonElement>;
}

export default function JourneySearch(props: Props) {
    function clearSearchOptions() {
        let defaultSearchOptions = {...DEFAULT_SEARCH_OPTIONS};

        props.setSearchOptions(searchOptions => defaultSearchOptions);
    }

    return (
        <div className="search">
            <div>
                <DatePicker date={props.searchOptions.DepartureDateFrom} option={SearchOptionNames.DepartureDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.DepartureDateTo} option={SearchOptionNames.DepartureDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div>
                <DatePicker date={props.searchOptions.ReturnDateFrom} option={SearchOptionNames.ReturnDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.ReturnDateTo} option={SearchOptionNames.ReturnDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
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

            <div>
                {
                    props.isWorking ?
                    <button disabled>Go</button>
                    :
                    <button onClick={props.onFetchClick}>Go</button>
                }
                <button onClick={clearSearchOptions}>Clear</button>
            </div>
        </div>
    )
}
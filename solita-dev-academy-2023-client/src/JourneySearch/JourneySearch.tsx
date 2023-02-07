import React from "react";
import DEFAULT_SEARCH_OPTIONS from "../Constants/DefaultSearchOptions";
import OrderByOptions from "../Constants/OrderByOptions";
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

    function onOrderByChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let value = event.currentTarget.value;

        let searchOptions = {...props.searchOptions} as SearchOptions;

        searchOptions.OrderBy = value;

        props.setSearchOptions(so => searchOptions);
    }

    function onOrderChange(event: React.ChangeEvent<HTMLInputElement>) {
        let checked = event.currentTarget.checked;

        let searchOptions = {...props.searchOptions} as SearchOptions;

        checked ?
            searchOptions.Order = "Ascending"
            :
            searchOptions.Order = "Descending";

        props.setSearchOptions(so => searchOptions);
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
                <label>
                    {SearchOptionNames.OrderBy}
                    <select onChange={onOrderByChange} value={props.searchOptions.OrderBy} name="order_by">
                        {
                            Object.values(OrderByOptions).map((value, index) => {
                                return <option key={index} value={value}>{value}</option>
                            })
                        }
                    </select>
                </label>

                <label>
                    {SearchOptionNames.Order}
                    {
                        props.searchOptions.OrderBy === "Ascending" ?
                            <input onChange={onOrderChange} type="checkbox" checked></input>
                            :
                            <input onChange={onOrderChange} type="checkbox"></input>
                    }
                </label>

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
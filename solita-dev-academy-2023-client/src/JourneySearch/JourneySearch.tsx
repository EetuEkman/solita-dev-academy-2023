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
        <div className="flex flex-col p-2 bg-bluish_grey-500 text-slate-300 [&>*]:my-0.5 [&>*]:flex [&>*]:flex-row [&>*]:flex-wrap [&>*]:justify-start [&>*]:items-center rounded mb-0.5">
            <div className="">
                <DatePicker date={props.searchOptions.DepartureDateFrom} option={SearchOptionNames.DepartureDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.DepartureDateTo} option={SearchOptionNames.DepartureDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div className="">
                <DatePicker date={props.searchOptions.ReturnDateFrom} option={SearchOptionNames.ReturnDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.ReturnDateTo} option={SearchOptionNames.ReturnDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
            </div>

            <div className="">
                <TextInput value={props.searchOptions.CoveredDistanceFrom} option={SearchOptionNames.CoveredDistanceFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.CoveredDistanceTo} option={SearchOptionNames.CoveredDistanceTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div className="">
                <TextInput value={props.searchOptions.DurationFrom} option={SearchOptionNames.DurationFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DurationTo} option={SearchOptionNames.DurationTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div className="">
                <TextInput value={props.searchOptions.DepartureStationNameFi} option={SearchOptionNames.DepartureStationNameFi} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DepartureStationNameSe} option={SearchOptionNames.DepartureStationNameSe} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DepartureStationNameEn} option={SearchOptionNames.DepartureStationNameEn} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div className="">
                <TextInput value={props.searchOptions.ReturnStationNameFi} option={SearchOptionNames.ReturnStationNameFi} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameSe} option={SearchOptionNames.ReturnStationNameSe} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameEn} option={SearchOptionNames.ReturnStationNameEn} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
            </div>

            <div>
                <label>
                    {SearchOptionNames.OrderBy}
                    <select onChange={onOrderByChange} value={props.searchOptions.OrderBy} name="order_by" className="mx-1 px-1 bg-slate-200 border-2 border-black_accent-500 text-black">
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
                            <input onChange={onOrderChange} type="checkbox" checked className="mx-1"></input>
                            :
                            <input onChange={onOrderChange} type="checkbox" className="mx-1"></input>
                    }
                </label>

            </div>

            <div className="pt-1">
                {
                    props.isWorking ?
                    <button className="h-10 w-15 bg-gray-500/50 text-bluish_grey-500 font-bold mr-1 py-2 px-4 rounded" disabled>Go</button>
                    :
                    <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 font-bold mr-1 py-2 px-4 rounded" onClick={props.onFetchClick}>Go</button>
                }
                <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded" onClick={clearSearchOptions}>Clear</button>
            </div>
        </div>
    )
}
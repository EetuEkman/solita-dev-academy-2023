import React from "react";
import DEFAULT_SEARCH_OPTIONS from "../../../Constants/DefaultJourneySearchOptions";
import OrderByOptions from "../../../Constants/OrderByOptions";
import JourneySearchLabelTexts from "../../../Constants/JourneySearchLabelTexts";
import SearchOptions from "../../../Models/JourneySearchOptions";
import DatePicker from "./DatePicker";
import NumberInput from "./NumberInput";
import TextInput from "./TextInput";

interface Props {
    isWorking: boolean;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
    OnFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function JourneySearch(props: Props) {
    function clearSearchOptions() {
        let defaultSearchOptions = { ...DEFAULT_SEARCH_OPTIONS };

        props.setSearchOptions(searchOptions => defaultSearchOptions);
    }

    function onOrderByChange(event: React.ChangeEvent<HTMLSelectElement>) {
        let value = event.currentTarget.value;

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        searchOptions.OrderBy = value;

        props.setSearchOptions(so => searchOptions);
    }

    function onOrderChange(event: React.ChangeEvent<HTMLInputElement>) {
        let checked = event.currentTarget.checked;

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        checked ?
            searchOptions.Order = "Ascending"
            :
            searchOptions.Order = "Descending";

        props.setSearchOptions(so => searchOptions);
    }

    return (
        <div className="w-full flex flex-col mb-2 py-4 px-8 bg-bluish_grey-500 text-slate-300 shadow-md shadow-bluish_grey-500/50 rounded">
            <form onSubmit={event => { event.preventDefault() }}>

                <DatePicker date={props.searchOptions.DepartureDateFrom} option={JourneySearchLabelTexts.DepartureDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.DepartureDateTo} option={JourneySearchLabelTexts.DepartureDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.ReturnDateFrom} option={JourneySearchLabelTexts.ReturnDateFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <DatePicker date={props.searchOptions.ReturnDateTo} option={JourneySearchLabelTexts.ReturnDateTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></DatePicker>
                <NumberInput value={props.searchOptions.CoveredDistanceFrom} option={JourneySearchLabelTexts.CoveredDistanceFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></NumberInput>
                <NumberInput value={props.searchOptions.CoveredDistanceTo} option={JourneySearchLabelTexts.CoveredDistanceTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></NumberInput>
                <NumberInput value={props.searchOptions.DurationFrom} option={JourneySearchLabelTexts.DurationFrom} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></NumberInput>
                <NumberInput value={props.searchOptions.DurationTo} option={JourneySearchLabelTexts.DurationTo} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></NumberInput>
                <TextInput value={props.searchOptions.DepartureStationNameFi} option={JourneySearchLabelTexts.DepartureStationNameFi} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DepartureStationNameSe} option={JourneySearchLabelTexts.DepartureStationNameSe} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.DepartureStationNameEn} option={JourneySearchLabelTexts.DepartureStationNameEn} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameFi} option={JourneySearchLabelTexts.ReturnStationNameFi} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameSe} option={JourneySearchLabelTexts.ReturnStationNameSe} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>
                <TextInput value={props.searchOptions.ReturnStationNameEn} option={JourneySearchLabelTexts.ReturnStationNameEn} searchOptions={props.searchOptions} setSearchOptions={props.setSearchOptions}></TextInput>

                <div className="h-8 flex items-center my-0.5">
                    <label className="inline-flex items-center">
                        <span className="w-48 h-8 inline-flex items-center">{JourneySearchLabelTexts.OrderBy}</span>
                        <select onChange={onOrderByChange} value={props.searchOptions.OrderBy} name="order_by" className="w-48 h-7 px-1 bg-slate-200 border-2 border-black_accent-500 text-black_accent-500">
                            {
                                Object.values(OrderByOptions).map((value, index) => {
                                    return <option key={index} value={value}>{value}</option>
                                })
                            }
                        </select>
                    </label>
                </div>

                <div className="my-0.5">
                    <label className="inline-flex items-center">
                        <span className="w-48 h-8 inline-flex items-center">{JourneySearchLabelTexts.Order}</span>
                        {
                            props.searchOptions.OrderBy === "Ascending" ?
                                <input onChange={onOrderChange} type="checkbox" checked className="w-6 h-6 mx-1 accent-yellow-500 rounded-md"></input>
                                :
                                <input onChange={onOrderChange} type="checkbox" className="w-6 h-6 mx-1 accent-yellow-500 rounded-md"></input>
                        }
                    </label>
                </div>

                <div className="pt-1">
                    {
                        props.isWorking ?
                            <button className="h-10 w-15 bg-gray-500/50 text-bluish_grey-500 font-bold mr-1 py-2 px-4 rounded" disabled>Search</button>
                            :
                            <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 font-bold mr-1 py-2 px-4 rounded" onPointerDown={props.OnFetchPointerDown}>Search</button>
                    }
                    <button className="h-10 w-15 bg-yellow-500 text-bluish_grey-500 py-2 px-4 rounded" onClick={clearSearchOptions}>Clear</button>
                </div>
            </form>
        </div>
    )
}
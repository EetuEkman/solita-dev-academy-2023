import React from "react";
import SearchOptionNames from "../Constants/SearchOptionNames";
import SearchOptions from "../Models/SearchOptions";

interface Props {
    name: string;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

export default function DatePicker(props: Props) {
    function onChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let name = event.currentTarget.getAttribute("data-name");

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        switch (name) {
            case SearchOptionNames.DepartureDateFrom:
                searchOptions.DepartureDateFrom = new Date(value);
                break;
            case SearchOptionNames.DepartureDateTo:
                searchOptions.DepartureDateTo = new Date(value);
                break;
            case SearchOptionNames.ReturnDateFrom:
                searchOptions.ReturnDateFrom = new Date(value);
                break;
            case SearchOptionNames.ReturnDateTo:
                searchOptions.ReturnDateTo = new Date(value);
                break;
            default:
                return;
        }

        props.setSearchOptions(so => searchOptions);
    }

    return (
        <label>
            {props.name}
            <input onChange={onChange} data-name={props.name} type="date"></input>
        </label>
    )
}
import React from "react";
import SearchOptionNames from "../../../Constants/SearchOptionNames";
import SearchOptions from "../../../Models/SearchOptions";

interface Props {
    date: Date | null;
    option: string;
    searchOptions: SearchOptions;
    setSearchOptions: React.Dispatch<React.SetStateAction<SearchOptions>>;
}

export default function DatePicker(props: Props) {
    function onChange(event: React.FormEvent<HTMLInputElement>) {
        let value = event.currentTarget.value;

        let searchOptions = { ...props.searchOptions } as SearchOptions;

        switch (props.option) {
            case SearchOptionNames.DepartureDateFrom:
                searchOptions.DepartureDateFrom = value === "" ? null : new Date(value);
                break;
            case SearchOptionNames.DepartureDateTo:
                searchOptions.DepartureDateTo = value === "" ? null : new Date(value);
                break;
            case SearchOptionNames.ReturnDateFrom:
                searchOptions.ReturnDateFrom = value === "" ? null : new Date(value);
                break;
            case SearchOptionNames.ReturnDateTo:
                searchOptions.ReturnDateTo = value === "" ? null : new Date(value);
                break;
            default:
                return;
        }

        props.setSearchOptions(so => searchOptions);
    }

    function toString(date: Date | null): string {
        if (date === null) {
            return "";
        }
        
        return date.toISOString().split("T")[0];
    }

    return (
        <label>
            {props.option}
            <input value={toString(props.date)} onChange={onChange} type="date" className="mx-1 px-1 bg-slate-200 border-2 border-black_accent-500 text-black"></input>
        </label>
    )
}
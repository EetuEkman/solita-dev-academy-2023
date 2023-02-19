import SearchOptions from "../Models/JourneySearchOptions"
import OrderByOptions from "./OrderByOptions";

const DEFAULT_SEARCH_OPTIONS: SearchOptions = {
    DepartureDateFrom: null,
    DepartureDateTo: null,
    ReturnDateFrom: null,
    ReturnDateTo: null,
    CoveredDistanceFrom: "",
    CoveredDistanceTo: "",
    DurationFrom: "",
    DurationTo: "",
    DepartureStationNameFi: "",
    DepartureStationNameSe: "",
    DepartureStationNameEn: "",
    ReturnStationNameFi: "",
    ReturnStationNameSe: "",
    ReturnStationNameEn: "",
    OrderBy: OrderByOptions.Departure,
    Order: "Descending"
}

export default DEFAULT_SEARCH_OPTIONS;
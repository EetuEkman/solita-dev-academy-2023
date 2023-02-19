import JourneySearchOptions from "../Models/JourneySearchOptions"
import OrderByOptions from "./OrderByOptions";

const DEFAULT_JOURNEY_SEARCH_OPTIONS: JourneySearchOptions = {
    DepartureDateFrom: null,
    DepartureDateTo: null,
    ReturnDateFrom: null,
    ReturnDateTo: null,
    CoveredDistanceFrom: null,
    CoveredDistanceTo: null,
    DurationFrom: null,
    DurationTo: null,
    DepartureStationNameFi: "",
    DepartureStationNameSe: "",
    DepartureStationNameEn: "",
    ReturnStationNameFi: "",
    ReturnStationNameSe: "",
    ReturnStationNameEn: "",
    OrderBy: OrderByOptions.Departure,
    Order: "Descending"
}

export default DEFAULT_JOURNEY_SEARCH_OPTIONS;
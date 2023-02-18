import Station from "./Station";

export default interface FetchedStationsPage {
    Count: number;
    Next?: string;
    CurrentPage: number;
    Previous?: string;
    Stations: Station[];
}
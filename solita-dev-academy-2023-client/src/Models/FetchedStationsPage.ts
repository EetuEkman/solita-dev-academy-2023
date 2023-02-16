import Station from "./Station";

export default interface FetchedStationsPage {
    Stations: Station[];
    Count: number;
    Next?: string;
    CurrentPage: number;
    Previous?: string;
}
import Station from "./Station";

export default interface DetailedStation extends Station {
    DepartureCount: number;
    ReturnCount: number;
    DepartureDistanceAverage: number;
    ReturnDistanceAverage: number;
}
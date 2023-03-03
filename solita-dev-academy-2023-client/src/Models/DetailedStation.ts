import Station from "./Station";
import PopularStation from "./PopularStation";

export default interface DetailedStation extends Station {
    DepartureCount: number;
    ReturnCount: number;
    DepartureDistanceAverage: number;
    ReturnDistanceAverage: number;
    TopDestinationStations: PopularStation[];
    TopOriginStations: PopularStation[];
}
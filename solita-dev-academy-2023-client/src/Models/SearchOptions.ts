export default interface SearchOptions {
    DepartureDateFrom: Date;
    DepartureDateTo: Date;
    ReturnDateFrom: Date;
    ReturnDateTo: Date;
    CoveredDistanceFrom: number;
    CoveredDistanceTo: number;
    DurationFrom: number;
    DurationTo: number;
    DepartureStationNameFi: string;
    DepartureStationNameSe: string;
    DepartureStationNameEn: string;
    ReturnStationNameFi: string;
    ReturnStationNameSe: string;
    ReturnStationNameEn: string;
    Page: number;
}
export default interface SearchOptions {
    DepartureDateFrom?: Date;
    DepartureDateTo?: Date;
    ReturnDateFrom?: Date;
    ReturnDateTo?: Date;
    CoveredDistanceFrom: string;
    CoveredDistanceTo: string;
    DurationFrom: string;
    DurationTo: string;
    DepartureStationNameFi: string;
    DepartureStationNameSe: string;
    DepartureStationNameEn: string;
    ReturnStationNameFi: string;
    ReturnStationNameSe: string;
    ReturnStationNameEn: string;
    Page?: number;
}
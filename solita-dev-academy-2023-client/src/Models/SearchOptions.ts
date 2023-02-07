export default interface SearchOptions {
    DepartureDateFrom: Date | null;
    DepartureDateTo: Date | null;
    ReturnDateFrom: Date | null;
    ReturnDateTo: Date | null;
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
    OrderBy: string;
    Order: string;
}
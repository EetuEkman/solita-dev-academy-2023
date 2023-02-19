export default interface JourneySearchOptions {
    DepartureDateFrom: Date | null;
    DepartureDateTo: Date | null;
    ReturnDateFrom: Date | null;
    ReturnDateTo: Date | null;
    CoveredDistanceFrom: number | null;
    CoveredDistanceTo: number | null;
    DurationFrom: number | null;
    DurationTo: number | null;
    DepartureStationNameFi: string;
    DepartureStationNameSe: string;
    DepartureStationNameEn: string;
    ReturnStationNameFi: string;
    ReturnStationNameSe: string;
    ReturnStationNameEn: string;
    OrderBy: string;
    Order: string;
}
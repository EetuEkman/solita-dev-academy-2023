import SearchOptions from "./Models/SearchOptions";

/**
 * Builds the URL from the supplied URL and the supplied SearchOptions.
 * @param baseUrl 
 * @param searchOptions 
 * @returns URL with query parameters.
 */

export default function BuildUrl(baseUrl: URL, searchOptions: SearchOptions): URL {
    let url: URL = { ...baseUrl } as URL;

    if (searchOptions.DepartureDateFrom != null) {
        url.searchParams.append("DepartureDateFrom", searchOptions.DepartureDateFrom.toISOString().split("T")[0]);
    }

    if (searchOptions.DepartureDateTo != null) {
        url.searchParams.append("DepartureDateTo", searchOptions.DepartureDateTo.toISOString().split("T")[0]);
    }

    if (searchOptions.ReturnDateFrom != null) {
        url.searchParams.append("ReturnDateFrom", searchOptions.ReturnDateFrom.toISOString().split("T")[0]);
    }

    if (searchOptions.ReturnDateFrom != null) {
        url.searchParams.append("ReturnDateFrom", searchOptions.ReturnDateFrom.toISOString().split("T")[0]);
    }

    if (searchOptions.CoveredDistanceFrom.length > 0) {
        url.searchParams.append("CoveredDistanceFrom", searchOptions.CoveredDistanceFrom);
    }

    if (searchOptions.CoveredDistanceTo.length > 0) {
        url.searchParams.append("CoveredDistanceTo", searchOptions.CoveredDistanceTo);
    }

    if (searchOptions.DurationFrom.length > 0) {
        url.searchParams.append("DurationFrom", searchOptions.DurationFrom);
    }
    
    if (searchOptions.DurationTo.length > 0) {
        url.searchParams.append("DurationTo", searchOptions.DurationTo);
    }
    
    if (searchOptions.DepartureStationNameFi.length > 0) {
        url.searchParams.append("DepartureStationNameFi", searchOptions.DepartureStationNameFi);
    }
    
    if (searchOptions.DepartureStationNameSe.length > 0) {
        url.searchParams.append("DepartureStationNameSe", searchOptions.DepartureStationNameSe);
    }
    
    if (searchOptions.DepartureStationNameEn.length > 0) {
        url.searchParams.append("DepartureStationNameEn", searchOptions.DepartureStationNameEn);
    }
    
    if (searchOptions.ReturnStationNameFi.length > 0) {
        url.searchParams.append("ReturnStationNameFi", searchOptions.ReturnStationNameFi);
    }
    
    if (searchOptions.ReturnStationNameSe.length > 0) {
        url.searchParams.append("ReturnStationNameSe", searchOptions.ReturnStationNameSe);
    }
    
    if (searchOptions.ReturnStationNameEn.length > 0) {
        url.searchParams.append("ReturnStationNameEn", searchOptions.ReturnStationNameEn);
    }

    return url;
}

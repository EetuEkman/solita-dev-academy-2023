import StationSearchOptions from "../Models/StationSearchOptions";

/**
 * Builds and returns an URL from the supplied URL string and SearchOptions.
 * @param baseUrl 
 * @param searchOptions 
 * @returns URL with query parameters.
 */

export default function BuildStationsUrl(urlArg: string, searchOptions: StationSearchOptions): URL {
    let url = new URL(urlArg);

    if (searchOptions.NameFi !== null) {
        url.searchParams.set("NameFi", searchOptions.NameFi);
    }
    
    if (searchOptions.NameSe !== null) {
        url.searchParams.set("NameSe", searchOptions.NameSe);
    }
    
    if (searchOptions.NameEn !== null) {
        url.searchParams.set("NameEn", searchOptions.NameEn);
    }

    if (searchOptions.AddressFi !== null) {
        url.searchParams.set("AddressFi", searchOptions.AddressFi);
    }

    if (searchOptions.AddressSe !== null) {
        url.searchParams.set("AddressSe", searchOptions.AddressSe);
    }

    if (searchOptions.Operator !== null) {
        url.searchParams.set("Operator", searchOptions.Operator);
    }

    if (searchOptions.CapacityFrom !== null) {
        url.searchParams.set("CapacityFrom", searchOptions.CapacityFrom.toString());
    }

    if (searchOptions.CapacityTo !== null) {
        url.searchParams.set("CapacityTo", searchOptions.CapacityTo.toString());
    }

    return url;
}

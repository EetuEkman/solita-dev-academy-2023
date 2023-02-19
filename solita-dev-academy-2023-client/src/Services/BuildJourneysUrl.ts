import SearchOptions from "../Models/JourneySearchOptions";

/**
 * Builds and returns an URL from the supplied URL string and SearchOptions.
 * @param baseUrl 
 * @param searchOptions 
 * @returns URL with query parameters.
 */

export default function BuildJourneysUrl(urlArg: string, searchOptions: SearchOptions): URL {
   let url = new URL(urlArg);

   if (searchOptions.DepartureDateFrom !== null) {
      url.searchParams.set("DepartureDateFrom", searchOptions.DepartureDateFrom.toISOString().split("T")[0]);
   }

   if (searchOptions.DepartureDateTo !== null) {
      url.searchParams.set("DepartureDateTo", searchOptions.DepartureDateTo.toISOString().split("T")[0]);
   }

   if (searchOptions.ReturnDateFrom !== null) {
      url.searchParams.set("ReturnDateFrom", searchOptions.ReturnDateFrom.toISOString().split("T")[0]);
   }

   if (searchOptions.ReturnDateTo !== null) {
      url.searchParams.set("ReturnDateTo", searchOptions.ReturnDateTo.toISOString().split("T")[0]);
   }

   if (searchOptions.CoveredDistanceFrom !== null) {
      url.searchParams.set("CoveredDistanceFrom", searchOptions.CoveredDistanceFrom?.toString());
   }

   if (searchOptions.CoveredDistanceTo !== null) {
      url.searchParams.set("CoveredDistanceTo", searchOptions.CoveredDistanceTo?.toString());
   }

   if (searchOptions.DurationFrom !== null) {
      url.searchParams.set("DurationFrom", searchOptions.DurationFrom?.toString());
   }

   if (searchOptions.DurationTo !== null) {
      url.searchParams.set("DurationTo", searchOptions.DurationTo?.toString());
   }

   if (searchOptions.DepartureStationNameFi.length > 0) {
      url.searchParams.set("DepartureStationNameFi", searchOptions.DepartureStationNameFi);
   }

   if (searchOptions.DepartureStationNameSe.length > 0) {
      url.searchParams.set("DepartureStationNameSe", searchOptions.DepartureStationNameSe);
   }

   if (searchOptions.DepartureStationNameEn.length > 0) {
      url.searchParams.set("DepartureStationNameEn", searchOptions.DepartureStationNameEn);
   }

   if (searchOptions.ReturnStationNameFi.length > 0) {
      url.searchParams.set("ReturnStationNameFi", searchOptions.ReturnStationNameFi);
   }

   if (searchOptions.ReturnStationNameSe.length > 0) {
      url.searchParams.set("ReturnStationNameSe", searchOptions.ReturnStationNameSe);
   }

   if (searchOptions.ReturnStationNameEn.length > 0) {
      url.searchParams.set("ReturnStationNameEn", searchOptions.ReturnStationNameEn);
   }

   if (searchOptions.OrderBy.length > 0) {
      url.searchParams.set("OrderBy", searchOptions.OrderBy);
   }

   if (searchOptions.Order.length > 0) {
      url.searchParams.set("Order", searchOptions.Order);
   }

   return url;
}

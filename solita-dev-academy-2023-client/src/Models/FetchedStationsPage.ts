import FetchedPage from "./FetchedPage";
import Station from "./Station";

export default interface FetchedStationsPage extends FetchedPage {
    Stations: Station[];
}
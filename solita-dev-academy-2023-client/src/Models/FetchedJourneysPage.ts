import FetchedPage from "./FetchedPage";
import Journey from "./Journey";

export default interface FetchedJourneysPage extends FetchedPage {
    Journeys: Journey[];
}
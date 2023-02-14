import Journey from "./Journey";

export default interface FetchedJourneysPage {
    Journeys: Journey[];
    Count: number;
    Previous?: string;
    CurrentPage: number;
    Next?: string;
}
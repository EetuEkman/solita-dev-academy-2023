import Journey from "./Journey";

export default interface JourneyPage {
    Journeys: Journey[];
    Count: number;
    Previous?: string;
    CurrentPage: number;
    Next?: string;
}
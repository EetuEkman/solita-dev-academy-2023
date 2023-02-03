import Journey from "./Journey";

export default interface JourneyPage {
    journeys: Journey[];
    count: number;
    previous: string;
    currentPage: number;
    next: string;
}
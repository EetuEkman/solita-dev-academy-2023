import JourneyPage from "./Models/JourneyPage";

export default async function FetchJourneys(url: URL) {
    const response = await fetch(url);

    const json = await response.json();

    const journeys = json as JourneyPage;

    return journeys;
}
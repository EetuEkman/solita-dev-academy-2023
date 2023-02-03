import JourneyPage from "./Models/JourneyPage";

export default async function FetchJourneys(url: URL) {
    const response = await fetch(url);

    const json = await response.json();

    console.log(JSON.stringify(json, null, 2));

    const journeys = JSON.parse(json) as JourneyPage;

    return journeys;
}
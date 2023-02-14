import JourneyResultPage from "./Models/FetchedJourneysPage";

export default async function FetchJourneys(url: URL): Promise<JourneyResultPage> {
    let response = await fetch(url);

    const json = await response.json();

    const journeys = json as JourneyResultPage;

    return journeys;
}
import JourneysPage from "../Models/FetchedJourneysPage";
import Fetch from "./Fetch";

export default async function FetchJourneys(url: URL): Promise<JourneysPage> {
    const journeysPage = await Fetch(url) as JourneysPage;

    return journeysPage;
}
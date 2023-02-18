import FetchedStationsPage from "../Models/FetchedStationsPage";
import Fetch from "./Fetch";

export default async function FetchStations(url: URL): Promise<FetchedStationsPage> {
    const stationsPage = await Fetch(url) as FetchedStationsPage;

    return stationsPage;
}
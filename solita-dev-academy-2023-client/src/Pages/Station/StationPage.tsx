import React, { useEffect, useState } from "react";
import FetchErrorDisplay from "../Shared/FetchErrorDisplay";
import { useParams } from 'react-router-dom';
import Layout from "../Shared/Layout";
import DetailedStation from "../../Models/DetailedStation";
import FetchErrors from "../../Constants/FetchErrors";
import StationDisplay from "./StationDisplay";

export default function StationPage() {
    const [fetchError, SetFetchError] = useState("");

    const STATION_URL = "https://localhost:7263/api/Station/";

    const [station, SetStation] = useState<DetailedStation | null>(null);

    const { id } = useParams()

    async function FetchStation(url: URL) {
        try {
            let response = await fetch(url);

            let statusCode = response.status;

            switch (statusCode) {
                case 204:
                    return;
            }

            let json = await response.json();

            let station = json as DetailedStation;

            SetStation(s => station);
        }
        catch (networkError) {
            SetFetchError(error => FetchErrors.NetworkError);

            return;
        }
    }

    useEffect(() => {
        FetchStation(new URL(STATION_URL + id));
    }, [])

    useEffect(() => {
        FetchStation(new URL(STATION_URL + id));
    }, [id])

    return (
        <Layout>
            <div className="h-full m-2 rounded shadow-md shadow-bluish_grey-500/50">
                {
                    fetchError.length > 0 ?
                        <FetchErrorDisplay fetchError={fetchError}></FetchErrorDisplay>
                        :
                        null
                }
                {
                    station ?
                        <StationDisplay key={Date.now().toString()} station={station}></StationDisplay>
                        :
                        null
                }

            </div>
        </Layout>
    )
}
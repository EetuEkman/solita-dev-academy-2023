import React, { useEffect, useState } from "react";
import FetchErrorDisplay from "../Shared/FetchErrorDisplay";
import { useParams } from 'react-router-dom';
import Layout from "../Shared/Layout";
import DetailedStation from "../../Models/DetailedStation";
import FetchErrors from "../../Constants/FetchErrors";
import StationDisplay from "./StationDisplay";
import appSettings from "./../../../appSettings.json";

const API_BASE_URL = appSettings.urls.api;

export default function StationPage() {
    const [fetchError, SetFetchError] = useState("");

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
        if (!id) {
            return;
        }

        let url = new URL("Station/" + id, API_BASE_URL);

        FetchStation(url);
    }, [])

    useEffect(() => {
        if (!id) {
            return;
        }

        let url = new URL("Station/" + id, API_BASE_URL);

        FetchStation(url);
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
                        <div className="text-yellow-500 py-2 px-4">Station not found.</div>
                }
            </div>
        </Layout>
    )
}
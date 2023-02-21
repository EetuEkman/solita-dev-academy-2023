import React, { useState } from "react";
import FetchErrorDisplay from "../Shared/FetchErrorDisplay";
import { useParams } from 'react-router-dom';
import Layout from "../Shared/Layout";

export default function StationPage() {
    const [fetchError, SetFetchError] = useState("");

    const { id } = useParams()

    return (
        <Layout>
            {
                fetchError.length > 0 ?
                    <FetchErrorDisplay fetchError={fetchError}></FetchErrorDisplay>
                    :
                    null
            }
            {
                id
            }
        </Layout>
    )
}
import React, { useState } from "react";
import FetchErrorDisplay from "../Shared/FetchErrorDisplay";

export default function StationPage() {
    const [fetchError, SetFetchError] = useState("");

    return (
        <div>
            {
                fetchError.length > 0 ?
                    <FetchErrorDisplay fetchError={fetchError}></FetchErrorDisplay>
                    :
                    null
            }
        </div>
    )
}
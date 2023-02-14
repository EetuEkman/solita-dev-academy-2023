import React from "react";
import FetchErrors from "./Constants/FetchErrors";
import FetchError from "./Models/FetchError";

function CreateFetchError(error: string): FetchError {
    let fetchError: FetchError = {
        description: FetchErrors.Error
    };

    switch (error) {
        case FetchErrors.NetworkError:
            fetchError = {
                description: FetchErrors.NetworkError,
                message: "The server is unreachable. Please check your internet connectivity."
            }
    }

    return fetchError;
}

interface Props {
    fetchError: string;
}

export default function FetchErrorDisplay(props: Props) {
    const fetchError = CreateFetchError(props.fetchError);

    return (
        <div className="py-1 px-2 text-yellow-500 bg-bluish_grey-500 rounded">
            <h1>{fetchError.description}</h1>
            {
                fetchError.message
                    ?
                    <p>{fetchError.message}</p>
                    :
                    null
            }
        </div>
    )
}
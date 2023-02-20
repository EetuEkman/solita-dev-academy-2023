import React from "react";
import FetchErrors from "../../Constants/FetchErrors";
import FetchError from "../../Models/FetchError";

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
            break;
        case FetchErrors.BadRequest:
            fetchError = {
                description: FetchErrors.BadRequest
            }
            break;
        case FetchErrors.InternalServerError:
            fetchError = {
                description: FetchErrors.InternalServerError
            }
    }

    return fetchError;
}

interface Props {
    fetchError: string;
    className?: string;
}

export default function FetchErrorDisplay(props: Props) {
    const fetchError = CreateFetchError(props.fetchError);

    return (
        <div className={props.className ? props.className : "" + " my-2 py-2 px-4 text-yellow-500 bg-bluish_grey-500 shadow-md shadow-bluish_grey-500/50 rounded"}>
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
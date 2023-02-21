import React from "react";
import { Link } from 'react-router-dom';

export default function NotFound() {
    return (
        <div className="h-screen flex flex-col justify-center items-center">
            <h1 className="font-bold text-7xl">404</h1>
            <p className="text-2xl">Not Found</p>
            <Link className="mt-4 text-lg text-blue-700" to="/">Return to the front page</Link>
        </div>
    )
}
import React from "react";
import { Link } from 'react-router-dom';

interface Props {
    children?: React.ReactNode
}

export default function Layout(props: Props) {
    return (
        <div className="h-screen flex flex-col">
            <nav className="flex items-center gap-4 p-4 text-yellow-500 bg-bluish_grey-500 shadow-md shadow-bluish_grey-500/50">
                <div className="inline-block font-bold m-2"><span>Helsinki city bikes</span></div>
                <Link to="/journeys">Journeys</Link>
                <Link to="/stations">Stations</Link>
            </nav>

            {props.children}
        </div>
    )
}
import React, { useEffect } from "react";
import DetailedStation from "../../Models/DetailedStation";
import * as Leaflet from "leaflet";
import { Link } from "react-router-dom";
import PopularStations from "./PopularStations";
import StationMap from "./StationMap";

interface Props {
    station: DetailedStation;
}

export default function StationDisplay(props: Props) {
    return (
        <div className="flex flex-col p-4 text-slate-300 bg-bluish_grey-500">
            <StationMap station={props.station}></StationMap>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Nimi</div>
                <div className="w-48 h-8 inline-flex">{props.station.Name_fi}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Namn</div>
                <div className="w-48 h-8 inline-flex">{props.station.Name_se}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Name</div>
                <div className="w-48 h-8 inline-flex">{props.station.Name_en}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Osoite</div>
                <div className="w-48 h-8 inline-flex">{props.station.Address_fi}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Adress</div>
                <div className="w-48 h-8 inline-flex">{props.station.Address_se}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Operator</div>
                <div className="w-48 h-8 inline-flex">{props.station.Operator}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Capacity</div>
                <div className="w-48 h-8 inline-flex">{props.station.Capacity}</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Departure count</div>
                <div className="w-48 h-8 inline-flex">{props.station.DepartureCount.toLocaleString()} departures.</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Return count</div>
                <div className="w-48 h-8 inline-flex">{props.station.ReturnCount.toLocaleString()} returns.</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Dep. distance avg.</div>
                <div className="w-48 h-8 inline-flex">{props.station.DepartureDistanceAverage.toLocaleString()} meters.</div>
            </div>
            <div className="flex">
                <div className="w-40 h-8 inline-flex">Ret. distance avg.</div>
                <div className="w-48 h-8 inline-flex">{props.station.ReturnDistanceAverage.toLocaleString()} meters.</div>
            </div>
            <PopularStations tableHeadingText="Top destination stations" stations={props.station.TopDestinationStations}></PopularStations>
            <PopularStations tableHeadingText="Top origin stations" stations={props.station.TopOriginStations}></PopularStations>
        </div>
    )
}
import React, { useEffect, useState } from "react";
import * as Leaflet from "leaflet";
import DetailedStation from "../../Models/DetailedStation";

interface Props {
    latitude?: number;
    longitude?: number;
    station: DetailedStation
}

const topOriginMarkerOptions: Leaflet.CircleMarkerOptions = {
    radius: 12,
    stroke: true,
    color: "black",
    opacity: 1,
    weight: 1,
    fill: true,
    fillColor: "red",
    fillOpacity: 0.6
}

const topDestinationMarkerOptions: Leaflet.CircleMarkerOptions = {
    radius: 12,
    stroke: true,
    color: "black",
    opacity: 1,
    weight: 1,
    fill: true,
    fillColor: "blue",
    fillOpacity: 0.6
}

export default function StationMap(props: Props) {
    function SetLeaflet() {
        if (!props.station.X || !props.station.Y) {
            return;
        }

        let longitude = props.station.X;

        let latitude = props.station.Y;

        let map = Leaflet.map("map", {
            center: [latitude, longitude],
            zoom: 16,
        });

        Leaflet.marker([latitude, longitude], { 
            
        }).addTo(map);

        props.station.TopDestinationStations.forEach(station => {
            if (station.X && station.Y) {
                Leaflet.circleMarker([station.Y, station.X], topDestinationMarkerOptions).addTo(map);
            }
        });

        props.station.TopOriginStations.forEach(station => {
            if (station.X && station.Y) {
                Leaflet.circleMarker([station.Y, station.X], topOriginMarkerOptions).addTo(map);
            }
        });

        Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            minZoom: 12,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    }

    useEffect(() => {
        SetLeaflet();
    }, [])

    return (
        <div id="map" className="w-[80em] h-[45em] mb-2"></div>
    )
}
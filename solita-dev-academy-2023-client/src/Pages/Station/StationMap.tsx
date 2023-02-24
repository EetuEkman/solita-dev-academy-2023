import React, { useEffect, useState } from "react";
import * as Leaflet from "leaflet";
import DetailedStation from "../../Models/DetailedStation";

interface Props {
    latitude?: number;
    longitude?: number;
    station: DetailedStation
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

        Leaflet.marker([latitude, longitude]).addTo(map);

        Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
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
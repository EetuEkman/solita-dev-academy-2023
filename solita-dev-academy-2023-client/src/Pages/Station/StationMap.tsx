import React, { useEffect } from "react";
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
    fillColor: "#DC2626",
    fillOpacity: 1
}

const topDestinationMarkerOptions: Leaflet.CircleMarkerOptions = {
    radius: 12,
    stroke: true,
    color: "black",
    opacity: 1,
    weight: 1,
    fill: true,
    fillColor: "#1D4ED8",
    fillOpacity: 1
}

const bothMarkerOptions: Leaflet.CircleMarkerOptions = {
    radius: 12,
    stroke: true,
    color: "black",
    opacity: 1,
    weight: 1,
    fill: true,
    fillColor: "#7E22CE",
    fillOpacity: 1
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

        Leaflet.marker([latitude, longitude], {}).addTo(map);

        let both = props.station.TopDestinationStations.filter(destinationStation => {
            if (props.station.TopOriginStations.findIndex(originStation => originStation.Id === destinationStation.Id) > -1) {
                return destinationStation;
            }

            return null;
        })

        let destinationStations = props.station.TopDestinationStations.filter(destinationStation => {
            if (both.findIndex(station => station.Id === destinationStation.Id) === -1) {
                return destinationStation
            }

            return null;
        })

        let originStations = props.station.TopOriginStations.filter(originStation => {
            if (both.findIndex(station => station.Id === originStation.Id) === -1) {
                return originStation;
            }

            return null;
        })

        both.forEach(station => {
            if (station.X && station.Y) {
                Leaflet.circleMarker([station.Y, station.X], bothMarkerOptions).addTo(map);
            }
        });

        destinationStations.forEach(station => {
            if (station.X && station.Y) {
                Leaflet.circleMarker([station.Y, station.X], topDestinationMarkerOptions).addTo(map);
            }
        });

        originStations.forEach(station => {
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
        <div className="relative">
            <div id="map" className="w-[80em] h-[45em] mb-2"></div>
            <div id="map-legend" className="absolute left-1 bottom-3 gap-0.5 inline-flex flex-col z-[400] select-none text-slate-100 bg-[#CBD5E1] border border-black_accent-500 p-1 [&>*]:h-fit [&>*]:px-1.5 [&>*]:border [&>*]:border-black_accent-500 [&>*]:flex [&>*]:items-center">
                <span className="bg-red-600">Top origin</span>
                <span className="bg-blue-700">Top destination</span>
                <span className="bg-purple-700">Both</span>
            </div>
        </div>
    )
}
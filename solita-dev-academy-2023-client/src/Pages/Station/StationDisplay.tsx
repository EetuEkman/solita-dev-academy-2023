import React from "react";
import DetailedStation from "../../Models/DetailedStation";

interface Props {
    station: DetailedStation;
}

export default function StationDisplay(props: Props) {
    return (
        <div className="flex flex-col p-4 text-slate-300 bg-bluish_grey-500">
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Id</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Id}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Nimi</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Name_fi}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Namn</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Name_se}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Name</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Name_en}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Osoite</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Address_fi}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Adress</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Address_se}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Operator</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Operator}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Capacity</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Capacity}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">X</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.X}</div>
            </div>
            <div className="flex">
                <div className="w-32 h-8 inline-flex">Y</div>
                <div className="w-32 h-8 inline-flex ml-2">{props.station.Y}</div>
            </div>
        </div>
    )
}
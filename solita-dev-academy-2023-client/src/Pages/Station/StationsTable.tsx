import React from "react";
import { Link } from "react-router-dom";
import Station from "../../Models/Station";

interface Props {
    tableHeadingText: string;
    stations: Station[]
}

export default function StationsTable(props: Props) {
    return (
        <div className="overflow-auto my-0.5 py-2">
            <h1 className="flex justify-center my-1 text-lg">{props.tableHeadingText}</h1>
            <table className="w-full h-full table-auto text-sm text-slate-400">
                <thead className="text-lg text-slate-300 border-b-2 border-slate-300">
                    <tr>
                        <th>Nimi</th>
                        <th>Namn</th>
                        <th>Name</th>
                        <th>Osoite</th>
                        <th>Adress</th>
                        <th>Capacity</th>
                        <th>Operator</th>
                        <th></th>    
                    </tr>
                </thead>
                <tbody>
                    {
                        props.stations.map((station, index) => {
                            return (
                                <tr className="border-y-[1px] first:border-y-0 last:border-y-0 border-slate-400 my-2 py-2" key={index}>
                                    <td>{station.Name_fi}</td>
                                    <td>{station.Name_se}</td>
                                    <td>{station.Name_en}</td>
                                    <td>{station.Address_fi}</td>
                                    <td>{station.Address_se}</td>
                                    <td>{station.Capacity}</td>
                                    <td>{station.Operator}</td>
                                    <td><Link to={"/station/" + station.Id} className="text-blue-500">Link</Link></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
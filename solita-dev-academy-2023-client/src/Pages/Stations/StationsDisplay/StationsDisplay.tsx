import React from "react";
import FetchedStationsPage from "../../../Models/FetchedStationsPage";
import Station from "../../../Models/Station";

interface Props {
    stationsPage: FetchedStationsPage;
    isWorking: boolean;
    OnFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function StationsDisplay(props: Props) {
    return (
        <div className="max-w-7xl bg-bluish_grey-500 text-slate-400 rounded">
            <div className="flex flex-col py-1 px-2">
                <div className="overflow-auto pb-3">
                    <table className="w-full table-fixed border-collapse">
                        <thead className="text-slate-300">
                            <tr>
                                <th>Name fi</th>
                                <th>Name se</th>
                                <th>Name en</th>
                                <th>Address fi</th>
                                <th>Address se</th>
                                <th>Operator</th>
                                <th>Capacity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                props.stationsPage.Stations.map((station, index) => {
                                    return (
                                        <tr key={index} className="border-y-[1px] first:border-y-0 last:border-y-0 border-slate-400">
                                            <td>{station.Name_fi}</td>
                                            <td>{station.Name_se}</td>
                                            <td>{station.Name_en}</td>
                                            <td>{station.Address_fi}</td>
                                            <td>{station.Address_fi}</td>
                                            <td>{station.Operator}</td>
                                            <td>{station.Capacity}</td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}
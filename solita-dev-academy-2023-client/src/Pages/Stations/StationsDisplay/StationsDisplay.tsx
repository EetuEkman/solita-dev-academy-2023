import React from "react";
import FetchedStationsPage from "../../../Models/FetchedStationsPage";
import Station from "../../../Models/Station";
import PageNavigation from "../../Shared/PageNavigation";

interface Props {
    stationsPage: FetchedStationsPage;
    isWorking: boolean;
    OnFetchPointerDown: React.PointerEventHandler<HTMLButtonElement>;
}

export default function StationsDisplay(props: Props) {
    return (
        <div className="w-full my-1 bg-bluish_grey-500 text-slate-400 shadow-md shadow-bluish_grey-500/50 rounded px-4 py-2">
            <div className="flex flex-col py-1 sm:px-1 md:px-2 lg:px-4">
                <div className="flex flex-col overflow-auto pb-3">
                    <table className="w-full min-h-[50em] table-auto border-collapse">
                        <thead className="text-slate-300 border-b">
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
                    <span className="text-slate-300">Found {props.stationsPage.Count} stations.</span>
                </div>
            </div>
            <PageNavigation HandleFetchPointerDown={props.OnFetchPointerDown} isWorking={props.isWorking} page={props.stationsPage}></PageNavigation>
        </div>
    )
}
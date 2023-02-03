import React from "react";
import Journey from "../Models/Journey";

interface Props {
    journeys: Journey[]
}

export default function JourneyTable(props: Props) {
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Departure</th>
                        <th>Return</th>
                        <th>Departure station</th>
                        <th>Departure station se</th>
                        <th>Departure station en</th>
                        <th>Departure station address</th>
                        <th>Departure station address se</th>
                        <th>Return station </th>
                        <th>Return station se</th>
                        <th>Return station en</th>
                        <th>Return station address</th>
                        <th>Return station address se</th>
                        <th>Covered distance</th>
                        <th>Duration</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        props.journeys.map((journey, index) => {
                            return (
                                <tr key={index}>
                                    <td>{new Date(journey.Departure).toLocaleString()}</td>
                                    <td>{new Date(journey.Return).toLocaleString()}</td>
                                    <td>{journey.Departure_station_name_fi}</td>
                                    <td>{journey.Departure_station_address_se}</td>
                                    <td>{journey.Departure_station_name_en}</td>
                                    <td>{journey.Departure_station_address_fi}</td>
                                    <td>{journey.Departure_station_address_se}</td>
                                    <td>{journey.Return_station_name_fi}</td>
                                    <td>{journey.Return_station_name_se}</td>
                                    <td>{journey.Return_station_name_en}</td>
                                    <td>{journey.Return_station_address_fi}</td>
                                    <td>{journey.Return_station_address_se}</td>
                                    <td>{journey.Covered_distance}</td>
                                    <td>{journey.Duration}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
export default interface Journey {
    departure: string;
    return: string;
    departure_station_name_fi: string;
    departure_station_name_se: string;
    departure_station_name_en: string;
    departure_station_address_fi: string;
    departure_station_address_se: string;
    return_station_name_fi: string;
    return_station_name_se: string;
    return_station_name_en: string;
    return_station_address_fi: string;
    return_station_address_se: string;
    covered_distance: number;
    duration: number;
}
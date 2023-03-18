CREATE TABLE stations
(
    id varchar(3) PRIMARY KEY NOT NULL, 
    name_fi varchar(64), 
    name_se varchar(64), 
    name_en varchar(64), 
    address_fi varchar(64), 
    address_se varchar(64), 
    city_fi varchar(64), 
    city_se varchar(64), 
    operator varchar(64), 
    capacity integer, 
    x decimal(16, 13), 
    y decimal(16, 13) 
); 

CREATE TABLE journeys 
(
    id SERIAL PRIMARY KEY, 
    departure timestamp(0), 
    "return" timestamp(0), 
    departure_station_id varchar(3), 
    departure_station_name varchar(64), 
    return_station_id varchar(3), 
    return_station_name varchar(64), 
    covered_distance float, 
    duration float 
); 

ALTER TABLE journeys
ADD CONSTRAINT fk_departure_id
FOREIGN KEY (departure_station_id)
REFERENCES stations (id);

ALTER TABLE journeys
ADD CONSTRAINT fk_return_id
FOREIGN KEY (return_station_id)
REFERENCES stations (id);

CREATE INDEX pk_station ON stations (id);

CREATE INDEX station_names ON stations (name_fi, name_se, name_en);

CREATE INDEX station_addresses ON stations (address_fi, address_se);

CREATE INDEX station_capacity ON stations (capacity);

CREATE INDEX pk_journey ON journeys (id);

CREATE INDEX fk_stations ON journeys (departure_station_id, return_station_id);

CREATE INDEX journey_dates ON journeys (departure, "return");

CREATE INDEX covered_distance ON journeys (covered_distance);

CREATE INDEX duration ON journeys (duration);

CREATE PROCEDURE init_stations() 
LANGUAGE plpgsql 
AS $body$ 
BEGIN 
    CREATE TEMPORARY TABLE temp_stations 
    (
        fid varchar(64), 
        id varchar(64), 
        nimi varchar(64), 
        namn varchar(64), 
        "name" varchar(64), 
        osoite varchar(64), 
        adress varchar(64), 
        kaupunki varchar(64),    
        stad varchar(64), 
        operaattor varchar(64), 
        kapasiteet varchar(64), 
        x DECIMAL(16, 13), 
        y DECIMAL(16, 13) 
    );

    COPY temp_stations
    (
        fid, 
        id, 
        nimi, 
        namn, 
        "name", 
        osoite, 
        adress, 
        kaupunki, 
        stad, 
        operaattor, 
        kapasiteet, 
        x, 
        y
    ) 
    FROM '/flatfiles/stations.csv' 
    CSV 
    HEADER 
    DELIMITER ',' 
    QUOTE '"' 
    ENCODING 'UTF8';

    INSERT INTO stations 
    ( 
        id, 
        name_fi, 
        name_se, 
        name_en, 
        address_fi, 
        address_se, 
        city_fi, 
        city_se, 
        operator, 
        capacity, 
        x, 
        y 
    )
    SELECT id, nimi, namn, "name", osoite, adress, kaupunki, stad, operaattor, kapasiteet, x, y
    FROM temp_stations;

    COMMIT; 
END; $body$; 

CREATE PROCEDURE init_journeys()
LANGUAGE plpgsql
AS $body$ 
BEGIN
    CREATE TEMPORARY TABLE temp_journeys
    (
        departure timestamp(0),
        "return" timestamp(0),
        departure_station_id varchar(4),
        departure_station_name varchar(64),
        return_station_id varchar(4),
        return_station_name varchar(64),
        covered_distance float,
        duration float
    ); 

    COPY temp_journeys
    (
        departure, 
        "return", 
        departure_station_id, 
        departure_station_name, 
        return_station_id, 
        return_station_name, 
        covered_distance, 
        duration 
    )
    FROM '/flatfiles/2021-05.csv' 
    CSV HEADER 
    DELIMITER ',' 
    QUOTE '"' 
    ENCODING 'UTF8'; 

    COPY temp_journeys
    (
        departure, 
        "return", 
        departure_station_id, 
        departure_station_name, 
        return_station_id, 
        return_station_name, 
        covered_distance, 
        duration 
    )
    FROM '/flatfiles/2021-06.csv' 
    CSV 
    HEADER 
    DELIMITER ',' 
    QUOTE '"' 
    ENCODING 'UTF8'; 

    COPY temp_journeys
    (
        departure, 
        "return", 
        departure_station_id, 
        departure_station_name, 
        return_station_id, 
        return_station_name, 
        covered_distance, 
        duration 
    )
    FROM '/flatfiles/2021-07.csv' 
    CSV HEADER 
    DELIMITER ',' 
    QUOTE '"' 
    ENCODING 'UTF8'; 

    INSERT INTO stations (id, name_fi, name_en) 
    SELECT DISTINCT departure_station_id, departure_station_name, departure_station_name 
    FROM temp_journeys 
    WHERE NOT EXISTS 
    (
    	SELECT id 
    	FROM stations 
    	WHERE stations.id = temp_journeys.departure_station_id 
    )
    ORDER BY departure_station_id ASC; 

    INSERT INTO stations (id, name_fi, name_en) 
    SELECT DISTINCT return_station_id, return_station_name, return_station_name 
    FROM temp_journeys 
    WHERE NOT EXISTS 
    (
    	SELECT id 
    	FROM stations 
    	WHERE stations.id = temp_journeys.return_station_id 
    )
    ORDER BY return_station_id ASC; 

    INSERT INTO Journeys (departure, "return", departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration) 
    SELECT departure, "return", departure_station_id, departure_station_name, return_station_id, return_station_name, covered_distance, duration 
    FROM temp_journeys 
    WHERE NOT duration < 10 
    AND NOT covered_distance < 10; 
    
    COMMIT; 
END; $body$ 
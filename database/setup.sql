USE master;

GO

CREATE DATABASE citybikes;

GO

USE citybikes;

GO

CREATE TABLE stations
(
    id varchar(3) PRIMARY KEY NOT NULL,
    name_fi nvarchar(64),
    name_se nvarchar(64),
    name_en nvarchar(64),
    address_fi nvarchar(64),
    address_se nvarchar(64),
    city_fi nvarchar(64),
    city_se nvarchar(64),
    operator nvarchar(64),
    capacity int,
    x DECIMAL(16, 13),
    y DECIMAL(16, 13)
);

CREATE TABLE journeys
(
    id bigint PRIMARY KEY iDENTITY NOT NULL,
    departure datetime2(0),
    [return] datetime2(0),
    departure_station_id varchar(3),
    departure_station_name nvarchar(64),
    return_station_id varchar(3),
    return_station_name nvarchar(64),
    covered_distance float,
    duration float
);

GO

ALTER TABLE journeys
ADD CONSTRAINT fk_departure_id
FOREIGN KEY (departure_station_id)
REFERENCES stations (id);

ALTER TABLE journeys
ADD CONSTRAINT fk_return_id
FOREIGN KEY (return_station_id)
REFERENCES stations (id);

GO

CREATE INDEX fk_stations ON journeys (departure_station_id, return_station_id);

CREATE INDEX covered_distance ON journeys (covered_distance);

CREATE INDEX fk_stations ON journeys (departure_station_id, return_station_id);

CREATE INDEX journey_dates ON journeys (departure, "return");

CREATE INDEX duration ON journeys (duration);

CREATE INDEX station_names ON stations (name_fi, name_se, name_en);

CREATE INDEX station_addresses ON stations (address_fi, address_se);

CREATE INDEX station_capacity ON stations (capacity);

GO

CREATE TABLE tempStations
(
    FID nvarchar(64),
    ID nvarchar(64),
    Nimi nvarchar(64),
    Namn nvarchar(64),
    [Name] nvarchar(64),
    Osoite nvarchar(64),
    Adress nvarchar(64),
    Kaupunki nvarchar(64),
    Stad nvarchar(64),
    Operaattor nvarchar(64),
    Kapasiteet nvarchar(64),
    x DECIMAL(16, 13),
    y DECIMAL(16, 13)
)

GO

CREATE TABLE tempJourneys
(
    Departure datetime2(0),
    [Return] datetime2(0),
    Departure_station_id nvarchar(4),
    Departure_station_name nvarchar(64),
    Return_station_id nvarchar(4),
    Return_station_name nvarchar(64),
    Covered_distance float,
    Duration float
);

GO

-- Bulk insert stations from the file in the supplied path. 

CREATE PROCEDURE BulkInsertStations @FilePath nvarchar(255)
AS
BEGIN
    IF OBJECT_iD(N'tempdb..#stations') IS NOT NULL
    BEGIN
        DROP TABLE #stations;
    END

    CREATE TABLE #stations
    (
        FID nvarchar(64),
        ID nvarchar(64),
        Nimi nvarchar(64),
        Namn nvarchar(64),
        [Name] nvarchar(64),
        Osoite nvarchar(64),
        Adress nvarchar(64),
        Kaupunki nvarchar(64),
        Stad nvarchar(64),
        Operaattor nvarchar(64),
        Kapasiteet nvarchar(64),
        x DECIMAL(16, 13),
        y DECIMAL(16, 13)
    )

    DECLARE @StationBulkInsert NVARCHAR(500)
    
    SET @StationBulkInsert = 'BULK INSERT #stations
    FROM ''' + @FilePath + '''
     WITH
    (
    	FORMAT = ''CSV'',
    	CODEPAGE = ''RAW'',
    	DATAFILETYPE=''char'',
        FIRSTROW = 2,
    	FIELDTERMINATOR = '','',
    	ROWTERMINATOR = ''0x0a'',
    	FIELDQUOTE = ''"''
    )'

    EXEC sp_executesql @StationBulkInsert;

    INSERT INTO stations (id, name_fi, name_se, name_en, address_fi, address_se, city_fi, city_se, operator, capacity, x, y)
    SELECT ID, Nimi, Namn, [Name], Osoite, Adress, Kaupunki, Stad, Operaattor, Kapasiteet, X, Y
    FROM #stations;
END

GO

-- Bulk insert journeys from the file in the supplied path. 

CREATE PROCEDURE BulkInsertJourneys @FilePath nvarchar(255)
AS
BEGIN
    IF OBJECT_iD(N'tempdb..#journeys') IS NOT NULL
    BEGIN
        DROP TABLE #journeys;
    END
    
    CREATE TABLE #journeys
    (
        Departure datetime2(0),
        [Return] datetime2(0),
        Departure_station_id nvarchar(4),
        Departure_station_name nvarchar(64),
        Return_station_id nvarchar(4),
        Return_station_name nvarchar(64),
        Covered_distance float,
        Duration float
    );

    DECLARE @JourneyBulkInsert NVARCHAR(500);
    
    SET @JourneyBulkInsert =
    'BULK INSERT #journeys FROM ''' 
    + 
    @FilePath 
    + 
    '''
     WITH
    (
    	FORMAT = ''CSV'',
    	CODEPAGE = ''RAW'',
    	DATAFILETYPE=''char'',
        FIRSTROW = 2,
    	FIELDTERMINATOR = '','',
    	ROWTERMINATOR = ''0x0a'',
    	FIELDQUOTE = ''"''
    )';

    EXEC sp_executesql @JourneyBulkInsert;

    INSERT INTO stations (id, name_fi, name_en)
    SELECT DISTINCT Departure_station_id, Departure_station_name, Departure_station_name
    FROM #journeys
    WHERE NOT EXISTS
    (
    	SELECT id
    	FROM stations
    	WHERE stations.id = #journeys.Departure_station_id
    )
    ORDER BY Departure_station_id ASC;

    INSERT INTO stations (id, name_fi, name_en)
    SELECT DISTINCT Return_station_id, [Return_station_name], [Return_station_name]
    FROM #journeys
    WHERE NOT EXISTS
    (
    	SELECT id
    	FROM stations
    	WHERE stations.id = #journeys.Return_station_id
    )
    ORDER BY Return_station_id ASC;

    INSERT INTO journeys (departure, [return], departure_station_id, departure_station_name, return_station_id, [return_station_name], covered_distance, duration)
    SELECT Departure, [Return], Departure_station_id, Departure_station_name, Return_station_id, [Return_station_name], Covered_distance, Duration
    FROM #journeys
    WHERE NOT Duration < 10
    AND NOT Covered_distance < 10
END;

GO

CREATE PROCEDURE BulkInsertStationsFromTempTable
AS
BEGIN
    INSERT INTO stations (id, name_fi, name_se, name_en, address_fi, address_se, city_fi, city_se, operator, capacity, x, y)
    SELECT ID, Nimi, Namn, [Name], Osoite, Adress, Kaupunki, Stad, Operaattor, Kapasiteet, X, Y
    FROM tempStations;

    TRUNCATE TABLE tempStations;
END

GO

CREATE PROCEDURE BulkInsertJourneysFromTempTable
AS
BEGIN
    INSERT INTO journeys (departure, [return], departure_station_id, departure_station_name, return_station_id, [return_station_name], covered_distance, duration)
    SELECT Departure, [Return], Departure_station_id, Departure_station_name, Return_station_id, [Return_station_name], Covered_distance, Duration
    FROM tempJourneys
    WHERE NOT Duration < 10
    AND NOT Covered_distance < 10;

    TRUNCATE TABLE tempJourneys;
END
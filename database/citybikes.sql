USE master

GO

IF DB_ID('Citybikes') IS NOT NULL
BEGIN
    ALTER DATABASE Citybikes SET SINGLE_USER WITH ROLLBACK IMMEDIATE

    DROP DATABASE Citybikes
END

GO

CREATE DATABASE Citybikes

GO

USE Citybikes

GO

CREATE TABLE Stations
(
    Id varchar(3) PRIMARY KEY NOT NULL,
    Name_fi nvarchar(64),
    Namn_se nvarchar(64),
    Name_en nvarchar(64),
    Address_fi nvarchar(64),
    Address_se nvarchar(64),
    City_fi nvarchar(64),
    City_se nvarchar(64),
    Operator nvarchar(64),
    Capacity int,
    X DECIMAL(16, 13),
    Y DECIMAL(16, 13)
)

CREATE TABLE Journeys
(
    Id bigint PRIMARY KEY IDENTITY NOT NULL,
    Departure smalldatetime,
    [Return] smalldatetime,
    Departure_station_id varchar(3),
    Departure_station_name nvarchar(64),
    Return_station_id varchar(3),
    Return_station_name nvarchar(64),
    Covered_distance float,
    Duration float
)

GO

ALTER TABLE Journeys
ADD CONSTRAINT FK_departure_id
FOREIGN KEY (Departure_station_id)
REFERENCES Stations (Id)

ALTER TABLE Journeys
ADD CONSTRAINT FK_return_id
FOREIGN KEY (Return_station_id)
REFERENCES Stations (Id)

GO

-- Temporary table for the station information.

CREATE TABLE #Stations
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
    X DECIMAL(16, 13),
    Y DECIMAL(16, 13)
)

GO

BULK INSERT #Stations
FROM 'C:\temp\Helsingin_ja_Espoon_kaupunkipyB6rA4asemat_avoin.csv'
WITH
(
	FORMAT = 'CSV',
	CODEPAGE = '65001',
	DATAFILETYPE='char',
    FIRSTROW = 2,
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '0x0a',
	FIELDQUOTE = '"'
)

GO

INSERT INTO Stations (Id, Name_fi, Namn_se, Name_en, Address_fi, Address_se, City_fi, City_se, Operator, Capacity, X, Y)
SELECT ID, Nimi, Namn, [Name], Osoite, Adress, Kaupunki, Stad, Operaattor, Kapasiteet, X, Y
FROM #Stations

GO

-- Temporary table for journey information.

IF OBJECT_ID(N'tempdb..#Journeys') IS NOT NULL
BEGIN
    DROP TABLE #Journeys
END

GO

CREATE TABLE #Journeys
(
    Departure smalldatetime,
    [Return] smalldatetime,
    Departure_station_id nvarchar(4),
    Departure_station_name nvarchar(64),
    Return_station_id nvarchar(4),
    Return_station_name nvarchar(64),
    Covered_distance float,
    Duration float
)

GO

BULK INSERT #Journeys
FROM 'C:\temp\2021-05.csv'
WITH
(
	FORMAT = 'CSV',
	CODEPAGE = '65001',
	DATAFILETYPE='char',
    FIRSTROW = 2,
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '0x0a',
	FIELDQUOTE = '"'
)

BULK INSERT #Journeys
FROM 'C:\temp\2021-06.csv'
WITH
(
	FORMAT = 'CSV',
	CODEPAGE = '65001',
	DATAFILETYPE='char',
    FIRSTROW = 2,
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '0x0a',
	FIELDQUOTE = '"'
)

BULK INSERT #Journeys
FROM 'C:\temp\2021-07.csv'
WITH
(
	FORMAT = 'CSV',
	CODEPAGE = '65001',
	DATAFILETYPE='char',
    FIRSTROW = 2,
	FIELDTERMINATOR = ',',
	ROWTERMINATOR = '0x0a',
	FIELDQUOTE = '"'
)

GO

-- The stations table is missing referenced stations.

-- Get missing station ids and insert missing stations into the station table.

INSERT INTO Stations (Id, Name_fi, Name_en)
SELECT DISTINCT Departure_station_id, Departure_station_name, Departure_station_name
FROM #Journeys
WHERE NOT EXISTS
(
	SELECT Id
	FROM Stations
	WHERE Stations.Id = #Journeys.Departure_station_id
)
ORDER BY Departure_station_id ASC

INSERT INTO Stations (Id, Name_fi, Name_en)
SELECT DISTINCT Return_station_id, Return_station_name, Return_station_name
FROM #Journeys
WHERE NOT EXISTS
(
	SELECT Id
	FROM Stations
	WHERE Stations.Id = #Journeys.Return_station_id
)
ORDER BY Return_station_id ASC

GO

INSERT INTO Journeys (Departure, [Return], Departure_station_id, Departure_station_name, Return_station_id, Return_station_name, Covered_distance, Duration)
SELECT Departure, [Return], Departure_station_id, Departure_station_name, Return_station_id, Return_station_name, Covered_distance, Duration
FROM #Journeys
WHERE NOT Duration < 10
AND NOT Covered_distance < 10

GO

CREATE USER Citybikes_user WITH PASSWORD = N'lPMOwK3bPm'

GO
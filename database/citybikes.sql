USE master

DROP DATABASE IF EXISTS Citybikes

CREATE DATABASE Citybikes

GO

USE Citybikes

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
    X numeric,
    Y numeric
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
    Covered_distance int,
    Duration int
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

DROP TABLE IF EXISTS StationsStaging

CREATE TABLE StationsStaging
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
    x nvarchar(64),
    y nvarchar(64)
)

GO

BULK INSERT StationsStaging
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
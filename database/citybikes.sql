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
    X DECIMAL(16, 13),
    Y DECIMAL(16, 13)
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

GO

INSERT INTO Stations (Id, Name_fi, Namn_se, Name_en, Address_fi, Address_se, City_fi, City_se, Operator, Capacity, X, Y)
SELECT ID, Nimi, Namn, [Name], Osoite, Adress, Kaupunki, Stad, Operaattor, Kapasiteet, X, Y
FROM StationsStaging

GO
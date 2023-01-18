USE master

DROP DATABASE Citybikes

CREATE DATABASE Citybikes

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
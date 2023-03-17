# Solution for Solita Dev Academy pre-assignment

This repository is a solution for Solita Dev Academy pre-assignment.

The client is hosted [here](https://victorious-bay-04e773803.2.azurestaticapps.net/).

:point_right: Please note that the SQL Server basic tier instance used for this demo is quite limited especially for the complex queries used for the detailed station page. For the best performance, please test the project locally.

The solution is an user interface and a backend service for displaying data from the city bike journeys in the Helsinki capital area.

The purpose of the project is to show off basic web developing skills: 

* Databases
    * Creating a database with tables, columns and relationships.
    * Bulk insertion, temporary tables, data validation.

* Backend
    * Receiving HTTP-requests.
    * Model binding and validation.
    * Querying the database.
    * Handling of the result set.
    * Building the response.
    * Cross Origin Domain Sharing (CORS).

* Frontend
    * Building the user interface.
    * Building and sending HTTP requests and handling the response.
    * Displaying the response payload.

For the database, I chose the Microsoft SQL Server for it's robustness and wide userbase. I have been asked about T-SQL recently, which is a Microsoft's extension of SQL. I went with the Developer edition for it's licensed use as a development and test database in a non-production environment.

For the backend, I chose to use ASP.NET Core WebApi for it's familiarity.

For the frontend, I chose the TypeScript and React set up with my own Powershell script once again for it's familiarity.

The scripts were created for and tested in Windows 11 operating system. Windows is not a requirement, but the database script uses windows file path for example.

## Database

The SQL Server database is set up in a docker Linux container.

Database, tables and stored procecures are then created by the setup.sql script-file copied to the /usr/init directory and executed with the sqlcmd-utility.

Journeys contains data about the journeys made on the city bikes, such as departure date and time, as well as duration and distance covered.

Stations contains data about the bike stations, such as the name and address.

Bulk data is imported from the .csv files in the /flatfiles directory. /flatfiles is a docker volume created in the setup script. The files are also downloaded with the wget and curl applications in the setup script.

The bulk importing is done by the stored procedures called with the sqlcmd and the docker exec.

The stored procedures import the data by bulk inserting the rows from the .csv flat files to a temporary staging table, from which the data is then inserted into the permanent table. 

The files

* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

contain data about the journeys, and

* <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>

contains information about the Helsinki Region Transport's city bicycle stations.

## Backend

The backend is an ASP.NET Core WebApi app.

For data access, the backend uses Dapper micro-orm. I heard about it and decided to try it out. Dapper is simple and light-weight, forcing you to understand what you're doing.

The connection string is found in the appsettings.json. 

I implemented a pagination for the results. The database query result set is bound to JourneyPage model class. JourneyPage represents a "page" of results, containing a list of journeys, a subset of 20 results, links to the previous and next pages, current page and the total result count.

The journey class contains information about the single city bike journey. Journey class has foreign keys referencing the departure and return stations, which are represented with the Station class.

Since the frontend is server by a different webserver and therefore origin, I ran into the CORS issue. I configured the default setting to allow CORS with all origins, headers and methods.

## Frontend

The frontend is a React app written in TypeScript.

I decided to use [Tailwind CSS framework](https://tailwindcss.com/) for this project.

# Setup

Requirements

* Docker
* Powershell 7

The solution uses docker containers for convenient and consistent setup.

The containers are setup with a PowerShell script.

On Windows and Mac systems, use Unblock-File cmdlet to allow the script to run with the command `PS> Unblock-File ./setup_sqlserver.ps1`.

Run the setup_sqlserver.ps1 script in PowerShell 7 with the command `PS> ./setup_sqlserver.ps1`.

# Issues

SQL Server BULK INSERT with Codepage = 65001 is unsupported on Linux systems and rows from the .CSV are inserted with Codepage = "RAW" option instead.

The bcp bulk copy program tool provided with the SQL Server doesn't understand field quotes, e.g.

Id = 5, Name = "Aalto university, tietotie", Address = Tietotie 4

becomes

Id, Name, address
Id = 5, Name = "Aalto university, Address = tietotie", extra column causing the error: Tietotie 4

Ä's and ö's are therefore not displayed correctly.
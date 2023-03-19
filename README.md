# Solution for Solita Dev Academy pre-assignment

This repository is a solution for [Solita Dev Academy pre-assignment](https://github.com/solita/dev-academy-2023-exercise).

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

For the database, I initially chose the Microsoft SQL Server for it's robustness and wide userbase. I have been asked about T-SQL recently, which is a Microsoft's extension of SQL. I went with the Developer edition for it's licensed use as a development and test database in a non-production environment.

After issued with bulk importing data with ä's and ö's from the flat files I added the option for the PostgreSQL database, which is another robust and popular relational database.

For the backend, I chose to use ASP.NET Core WebApi for it's familiarity.

For the frontend, I chose the TypeScript and React set up with my own Powershell script once again for it's familiarity.

## Database

Both database options are set up in Docker Linux containers.

Both scripts create a docker volume to store the downloaded the flat files. The volume is mounted as /flatfiles. The files are downloaded with the wget and curl applications.

The files

* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

contain data about the journeys, and

* <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>

contains information about the Helsinki Region Transport's city bicycle stations.

Journeys table contains data about the journeys made on the city bikes, such as departure date and time, as well as duration and distance covered.

Stations table contains data about the bike stations, such as the name and address.

### PostgreSQL

Database tables and stored procedures are defined inside the init.sql script ran on the Docker container creation.

The data importing from the .csv-files is done with the COPY-command inside the stored procedure to a temporary table from which the data is then inserted into proper tables.

### SQL Server

Database, tables and stored procecures are then created by the setup.sql script-file copied to the /usr/init directory and executed with the sqlcmd-utility.

The bulk importing is done by the stored procedures called with the sqlcmd and the docker exec.

The stored procedures import the data by bulk inserting the rows from the .csv flat files to a temporary staging table, from which the data is then inserted into the permanent table. 

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
* Powershell

The solution uses docker containers for convenient and consistent setup.

The containers are setup with a PowerShell script.

There are two scripts

* setup_postgresql.ps1
* setup_sqlserver.ps1

The former setups the solution with a postgresql database and the latter with a sql server database.

Reasoning for adding Postgres is SQL Server's lack of tools to bulk import UTF-8 encoded .CSV files. 

On Windows and Mac systems, use Unblock-File cmdlet to allow the script to run with the command `PS> Unblock-File ./setup_postgresql.ps1` or `PS> Unblock-File ./setup_sqlserver.ps1`.

Run either of the scripts in PowerShell with command `PS> ./setup_postgresql.ps1` or `PS> ./setup_sqlserver.ps1`.

Make sure the docker is up and running.

After the setup script finishes, open up browser and go to http://localhost:5000.

The client is hosted [here](https://victorious-bay-04e773803.2.azurestaticapps.net/).

:point_right: Please note that the SQL Server basic tier instance used for this demo is quite limited especially for the complex queries used for the detailed station page. For the best performance, please test the project locally.

# Issues

## SQL Server

SQL Server BULK INSERT with Codepage = 65001 is unsupported on Linux systems and rows from the .CSV are inserted with Codepage = "RAW" option instead.

The bcp bulk copy program tool provided with the SQL Server doesn't understand field quotes, e.g.

Id = 5, Name = "Aalto university, tietotie", Address = Tietotie 4

becomes

Id, Name, address
Id = 5, Name = "Aalto university, Address = tietotie", extra column causing the error: Tietotie 4

Ä's and ö's are therefore not displayed correctly.
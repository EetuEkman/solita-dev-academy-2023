# Solution for Solita Dev Academy pre-assignment

This repository is a solution for Solita Dev Academy pre-assignment.

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

The database is set up in Citybikes.sql script-file. The script was tested on Microsoft SQL Server development edition.

The script requires permissions to create database, tables and columns and relationships.

The script creates database Citybikes and creates tables Journeys and Stations.

Journeys contains data about the journeys made on the city bikes, such as departure date and time, as well as duration and distance covered.

Stations contains data about the bike stations, such as the name and address.

The script imports data by bulk inserting from the .csv flat files to a temporary staging table, from which data is inserted into the permanent table. 

The script checks path C:\temp for .csv files. Download and place the required files in the `C:\temp` directory.

The files

* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-05.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-06.csv>
* <https://dev.hsl.fi/citybikes/od-trips-2021/2021-07.csv>

contain data about the journeys, and

* <https://opendata.arcgis.com/datasets/726277c507ef4914b0aec3cbcfcbfafc_0.csv>

contains information about the Helsinki Region Transport's city bicycle stations.

Script creates user Citybikes_user and grants the user permissions to read, write and execute on the Citybikes-database.

## Backend

The backend is an ASP.NET Core WebApi app.

### Testing

#### Using Microsoft Visual Studio

To test out the backend I recommend using the latest version of Microsoft Visual Studio. 

Open the solution in Visual Studio. Click the "green arrow" or press Ctrl+F5 to start without debugging.

Visual Studio might ask to trust the development certificate. Select yes.

#### Using Visual Studio Code

Trust the HTTPS development certificate by running the command `dotnet dev-cets https --trust` and selecting yes.

In Visual Studio Code, press Ctrl+F5 to start.

### Notes

For data access, the backend uses Dapper micro-orm. I heard about it and decided to try it out. Dapper is simple and light-weight, forcing you to understand what you're doing.

The connection string is found in the appsettings.json. Database connection is made with the user Citybikes_user created in the database script, with permissions only to the Citybikes database.

I implemented a pagination for the results. The database query result set is bound to JourneyPage model class. JourneyPage represents a "page" of results, containing a list of journeys, a subset of 20 results, links to the previous and next pages, current page and the total result count.

The journey class contains information about the single city bike journey. Journey class has foreign keys referencing the departure and return stations, which are represented with the Station class.

Since the frontend is server by a different webserver and therefore origin, I ran into the CORS issue. I configured the default setting to allow CORS on all localhost origins. I also made a policy to allow all origins, but the policy needs to be setup on controller actions for example by decorating the actions with the CORS policy option before the API goes public.

## Frontend

The frontend is a React app written in TypeScript.

First, run command `npm install` to install all all the dependencies.

Then, start the server by running the command `npm run start` which will start the server in development mode.

After that, open the browser and navigate to http://localhost:8080.

The SearchOptions holds the state of the search options from which the url and query parameters are built from, as well as the journey search components.
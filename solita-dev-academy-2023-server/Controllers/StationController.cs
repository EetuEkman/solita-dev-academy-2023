using Dapper;
using dev_academy_server_library;
using dev_academy_server_library.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Hosting;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace solita_dev_academy_2023_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StationController : Controller
    {
        private readonly IConfiguration configuration;

        private readonly string? connectionString;

        public StationController(IConfiguration configuration)
        {
            this.configuration = configuration;

            connectionString = configuration.GetConnectionString("Citybikes");
        }

        [HttpGet("{Id}", Name = "GetStation")]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(204)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromRoute] string Id)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Station Id's start from 001 instead of 1.

            // Add leading zeroes to values from 1 to 99.

            switch (Id.Length)
            {
                case 1:
                    Id = "00" + Id;
                    break;
                case 2:
                    Id = "0" + Id;
                    break;
                default:
                    break;
            }

            var parameters = new DynamicParameters();

            parameters.Add("Id", Id, DbType.String, ParameterDirection.Input);

            /*
              
            Functionality

            Recommended

            Station name
            Station address
            Total number of journeys starting from the station
            Total number of journeys ending at the station

            Additional

            Station location on the map
            The average distance of a journey starting from the station
            The average distance of a journey ending at the station
            Top 5 most popular return stations for journeys starting from the station
            Top 5 most popular departure stations for journeys ending at the station
            Ability to filter all the calculations per month

            */

            var query = $@"SELECT TOP 1 *
                FROM [dbo].[Stations] S
                WHERE [Id] = @Id;

                SELECT COUNT(1)
                FROM [dbo].[Journeys]
                WHERE [Departure_station_id] = @Id;

                SELECT COUNT(1)
                FROM [dbo].[Journeys]
                WHERE [Return_station_id] = @Id;

                SELECT AVG([Covered_distance])
                FROM [dbo].[Journeys] 
                WHERE Departure_station_id = @Id;

                SELECT AVG([Covered_distance])
                FROM [dbo].[Journeys] 
                WHERE [Return_station_id] = @Id;

                SELECT * 
                FROM Stations 
                WHERE Id IN 
                ( 
                    SELECT Id 
                    FROM 
                    ( 
                        SELECT TOP 5 Departure_station_id Id, 
                        COUNT(Departure_station_id) C 
                        FROM Journeys 
                        WHERE [Return_station_id] = @Id 
                        GROUP BY Departure_station_id 
                        ORDER BY C DESC 
                    ) Ids
                );

                SELECT *
                FROM 
                ( 
                    SELECT TOP 5 Departure_station_id Id, 
                    COUNT(Departure_station_id) [Count] 
                    FROM Journeys 
                    WHERE [Return_station_id] = @Id
                    GROUP BY Departure_station_id 
                    ORDER BY [Count] DESC 
                ) Id_Count;

                SELECT * 
                FROM Stations 
                WHERE Id IN 
                ( 
                    SELECT Id 
                    FROM 
                    ( 
                        SELECT TOP 5 [Return_station_id] Id, 
                        COUNT([Return_station_id]) C 
                        FROM Journeys 
                        WHERE Departure_station_id = @Id 
                        GROUP BY [Return_station_id] 
                        ORDER BY C DESC 
                    ) Ids
                );
    
                SELECT *
                FROM 
                ( 
                    SELECT TOP 5 [Return_station_id] Id, 
                    COUNT([Return_station_id]) [Count] 
                    FROM Journeys 
                    WHERE Departure_station_id = @Id
                    GROUP BY [Return_station_id] 
                    ORDER BY [Count] DESC 
                ) Id_Count;
                ";

            DetailedStation? station;

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    var reader = await connection.QueryMultipleAsync(query, parameters, commandTimeout: 120);

                    station = await reader.ReadSingleOrDefaultAsync<DetailedStation>();

                    if (station is null)
                    {
                        return NoContent();
                    }

                    var readDepartureCount = reader.ReadSingleAsync<int>();

                    var readReturnCount = reader.ReadSingleAsync<int>();

                    var readDepartureDistanceAverage = reader.ReadSingleAsync<double>();

                    var readReturnDistanceAverage = reader.ReadSingleAsync<double>();

                    var readTopOriginStations = reader.ReadAsync<Station>();

                    var readTopOriginStationsIdCount = reader.ReadAsync<StationIdCount>();

                    var readTopDestinationStations = reader.ReadAsync<Station>();

                    var readTopDestinationStationsIdCount = reader.ReadAsync<StationIdCount>();

                    var departureCount = await readDepartureCount;

                    station.DepartureCount = departureCount;

                    var returnCount = await readReturnCount;

                    station.ReturnCount = returnCount;

                    var departureDistanceAverage = await readDepartureDistanceAverage;

                    station.DepartureDistanceAverage = departureDistanceAverage;

                    var returnDistanceAverage = await readReturnDistanceAverage;

                    station.ReturnDistanceAverage = returnDistanceAverage;

                    var topOriginStations = await readTopOriginStations;

                    var topOriginStationsIdCount = await readTopOriginStationsIdCount;

                    var topOriginStationsWithCount = new List<PopularStation>();

                    foreach (var idCount in topOriginStationsIdCount)
                    {
                        var topOriginStation = topOriginStations.FirstOrDefault(station => station.Id == idCount.Id);

                        if (topOriginStation is not null)
                        {
                            var popularStation = new PopularStation()
                            {
                                Id = topOriginStation.Id,
                                Address_fi = topOriginStation.Address_fi,
                                Address_se = topOriginStation.Address_se,
                                Capacity = topOriginStation.Capacity,
                                Name_en = topOriginStation.Name_en,
                                Name_fi = topOriginStation.Name_fi,
                                Name_se = topOriginStation.Name_se,
                                X = topOriginStation.X,
                                Y = topOriginStation.Y,
                                Operator = topOriginStation.Operator,
                                Count = idCount.Count,
                            };

                            topOriginStationsWithCount.Add(popularStation);
                        }
                    }

                    station.TopOriginStations = topOriginStationsWithCount;

                    var topDestinationStations = await readTopDestinationStations;

                    var topDestinationStationsIdCount = await readTopDestinationStationsIdCount;

                    var topDestinationStationsWithCount = new List<PopularStation>();

                    foreach (var idCount in topDestinationStationsIdCount)
                    {
                        var topDestinationStation = topDestinationStations.FirstOrDefault(station => station.Id == idCount.Id);

                        if (topDestinationStation is not null)
                        {
                            var popularStation = new PopularStation()
                            {
                                Id = topDestinationStation.Id,
                                Address_fi = topDestinationStation.Address_fi,
                                Address_se = topDestinationStation.Address_se,
                                Capacity = topDestinationStation.Capacity,
                                Name_en = topDestinationStation.Name_en,
                                Name_fi = topDestinationStation.Name_fi,
                                Name_se = topDestinationStation.Name_se,
                                X = topDestinationStation.X,
                                Y = topDestinationStation.Y,
                                Operator = topDestinationStation.Operator,
                                Count = idCount.Count,
                            };

                            topDestinationStationsWithCount.Add(popularStation);
                        }
                    }

                    station.TopDestinationStations = topDestinationStationsWithCount;
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }

            if (station is null)
            {
                return NoContent();
            }

            var json = JsonSerializer.Serialize(station);

            return Content(json, "application/json", System.Text.Encoding.UTF8);
        }

        [HttpGet(Name = "GetStations")]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromQuery] StationQueryParameters queryParameters)
        {
            if (queryParameters.Page is not null && queryParameters.Page < 0)
            {
                ModelState.AddModelError("Page", "Page number cannot be less than 0.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var parameters = new DynamicParameters();

            parameters.Add("Name_fi", "%", DbType.String, ParameterDirection.Input);
            parameters.Add("Name_se", "%", DbType.String, ParameterDirection.Input);
            parameters.Add("Name_en", "%", DbType.String, ParameterDirection.Input);
            parameters.Add("Address_fi", "%", DbType.String, ParameterDirection.Input);
            parameters.Add("Address_se", "%", DbType.String, ParameterDirection.Input);
            parameters.Add("Operator", "%", DbType.String, ParameterDirection.Input);

            if (queryParameters.NameFi is not null)
            {
                parameters.Add("Name_fi", "%" + queryParameters.NameFi + "%", DbType.String, ParameterDirection.Input);
            }

            if (queryParameters.NameSe is not null)
            {
                parameters.Add("Name_se", "%" + queryParameters.NameSe + "%", DbType.String, ParameterDirection.Input);
            }

            if (queryParameters.NameEn is not null)
            {
                parameters.Add("Name_en", "%" + queryParameters.NameEn + "%", DbType.String, ParameterDirection.Input);
            }

            if (queryParameters.AddressFi is not null)
            {
                parameters.Add("Address_fi", "%" + queryParameters.AddressFi + "%", DbType.String, ParameterDirection.Input);
            }

            if (queryParameters.AddressSe is not null)
            {
                parameters.Add("Address_se", "%" + queryParameters.AddressSe + "%", DbType.String, ParameterDirection.Input);
            }

            if (queryParameters.Operator is not null)
            {
                parameters.Add("Operator", "%" + queryParameters.Operator + "%", DbType.String, ParameterDirection.Input);
            }

            var query = "SELECT *" +
                " FROM [dbo].[Stations]" +
                " WHERE Name_fi LIKE @Name_fi" +
                " AND Name_se LIKE @Name_se" +
                " AND Name_en LIKE @Name_en" +
                " AND Address_fi LIKE @Address_fi" +
                " AND Address_se LIKE @Address_se" +
                " AND Operator LIKE @Operator";

            var countQuery = " SELECT COUNT(1)" +
                " FROM [dbo].[Stations]" +
                " WHERE Name_fi LIKE @Name_fi" +
                " AND Name_se LIKE @Name_se" +
                " AND Name_en LIKE @Name_en" +
                " AND Address_fi LIKE @Address_fi" +
                " AND Address_se LIKE @Address_se" +
                " AND Operator LIKE @Operator";

            if (queryParameters.CapacityFrom is not null)
            {
                query += " AND Capacity >= @CapacityFrom";

                countQuery += " AND Capacity >= @CapacityFrom";

                parameters.Add("CapacityFrom", queryParameters.CapacityFrom, DbType.Int64, ParameterDirection.Input);
            }

            if (queryParameters.CapacityTo is not null)
            {
                query += " AND Capacity <= @CapacityTo";

                countQuery += " AND Capacity <= @CapacityTo";

                parameters.Add("CapacityTo", queryParameters.CapacityTo, DbType.Int64, ParameterDirection.Input);
            }

            // ORDER BY, needed for OFFSET.

            query += " ORDER BY Id ASC";

            var currentPage = 1;

            // Offset.

            query += " OFFSET @Offset ROWS";

            var offset = 0;

            // Use the keyword "FIRST" instead of "NEXT" for the first page.

            if (queryParameters.Page is not null && queryParameters.Page > 1)
            {
                offset = 20 * ((int)queryParameters.Page - 1);

                currentPage = (int)queryParameters.Page;

                query += " FETCH NEXT 20 ROWS ONLY;";
            }
            else
            {
                query += " FETCH FIRST 20 ROWS ONLY;";
            }

            parameters.Add("Offset", offset, DbType.Int32, ParameterDirection.Input);

            // Include the count in the same query.

            query += countQuery;

            //List<Station> stations;

            StationsPage stationsPage = new();

            // var rowCount = 0;

            try
            {
                var dataAccess = new DataAccess(configuration);

                stationsPage = await dataAccess.GetStationsPage(query, parameters);
            }

            catch (Exception exception)
            {
                return StatusCode(500, exception.Message);
            }


            var scheme = Url.ActionContext.HttpContext.Request.Scheme;

            // Set the url to the previous page as null if there is no previous page.

            string? previous = null;

            if (currentPage > 1 && stationsPage.Count > 0)
            {
                queryParameters.Page -= 1;

                previous = Url.Action("Index", "Station", queryParameters, scheme);
            }

            stationsPage.Previous = previous;

            // Set the url to the next page as null if there is no next page.

            string? next = null;

            if ((int)Math.Ceiling((double)(stationsPage.Count / 20)) >= currentPage && stationsPage.Count > 0)
            {
                queryParameters.Page = currentPage + 1;

                next = Url.Action("Index", "Station", queryParameters, scheme);
            }

            stationsPage.Next = next;

            stationsPage.CurrentPage = currentPage;

            if (stationsPage.Count == 0)
            {
                stationsPage.CurrentPage = 0;
            }

            var json = JsonSerializer.Serialize(stationsPage);

            return Content(json, "application/json", System.Text.Encoding.UTF8);
        }
    }
}

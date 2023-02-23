using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Hosting;
using solita_dev_academy_2023_server.Models;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace solita_dev_academy_2023_server.Controllers
{
    public class StationQueryParameters
    {
        public string? NameFi { get; set; }
        public string? NameSe { get; set; }
        public string? NameEn { get; set; }
        public string? AddressFi { get; set; }
        public string? AddressSe { get; set; }
        public string? Operator { get; set; }
        public int? CapacityFrom { get; set; }
        public int? CapacityTo { get; set; }
        public int? Page { get; set; }
        
    }

    [ApiController]
    [Route("api/[controller]")]
    public class StationController : Controller
    {
        private readonly IConfiguration configuration;
        public StationController(IConfiguration configuration)
        {
            this.configuration = configuration;
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

            var query = "SELECT TOP 1 *" +
                " FROM [dbo].[Stations] S" +
                " WHERE [Id] = @Id;" +

                " SELECT COUNT(1)" +
                " FROM [dbo].[Journeys]" +
                " WHERE [Departure_station_id] = @Id;" +

                " SELECT COUNT(1)" +
                " FROM [dbo].[Journeys]" +
                " WHERE [Return_station_id] = @Id;" +

                " SELECT AVG([Covered_distance])" +
                " FROM [dbo].[Journeys] " +
                " WHERE [Id] = @Id;" +

                " SELECT AVG([Covered_distance])" +
                " FROM [dbo].[Journeys] " +
                " WHERE [Id] = @Id;" +

                " ( SELECT [Return_station_id] AS [Id], COUNT([Return_station_id]) AS [Count] FROM [Journeys] WHERE [Departure_station_id] = @Id GROUP BY [Return_station_id] ) ORDER BY [Count] DESC OFFSET 0 ROWS FETCH FIRST 5 ROWS ONLY;" +

                " ( SELECT [Departure_station_id] AS [Id], COUNT([Departure_station_id]) AS [Count] FROM [Journeys] WHERE [Return_station_id] = @Id GROUP BY [Departure_station_id] ) ORDER BY [Count] DESC OFFSET 0 ROWS FETCH FIRST 5 ROWS ONLY;" +

                // Stations created from the result sets of these queries had property values other than the Id null.

                // Queries returned proper values in SQL Management Studio.

                /*
                
                " SELECT *" +
                " FROM Stations WHERE Id IN" +
                " ( SELECT Id FROM ( SELECT TOP 5 Departure_station_id Id, COUNT(Departure_station_id) C FROM Journeys WHERE [Return_station_id] = @Id GROUP BY Departure_station_id ORDER BY C DESC ) A );" +

                " SELECT *" +
                " FROM Stations" +
                " WHERE Id IN" +
                " ( SELECT Id FROM ( SELECT TOP 5 [Return_station_id] Id, COUNT([Return_station_id]) C FROM Journeys WHERE Departure_station_id = @Id GROUP BY [Return_station_id] ORDER BY C DESC ) A );" +

                */

                // Get the ids of the top origin and destination stations.

                " SELECT Departure_station_id Id FROM ( SELECT TOP 5 Departure_station_id, COUNT(Departure_station_id) C FROM Journeys WHERE [Return_station_id] = @Id GROUP BY Departure_station_id ORDER BY C DESC ) A;" +

                " SELECT [Return_station_id] Id FROM ( SELECT TOP 5 [Return_station_id], COUNT([Return_station_id]) C FROM Journeys WHERE Departure_station_id = @Id GROUP BY [Return_station_id] ORDER BY C DESC ) A;";

            DetailedStation ? station;

            // Ids of the top origin and destination stations.

            string[] originStrings = Array.Empty<string>();

            string[] destinationStrings = Array.Empty<string>();

            var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var reader = await connection.QueryMultipleAsync(query, parameters);

                    station = await reader.ReadSingleOrDefaultAsync<DetailedStation>();

                    if (station is null)
                    {
                        return NoContent();
                    }

                    var departureCount = await reader.ReadSingleAsync<int>();

                    station.DepartureCount = departureCount;

                    var returnCount = await reader.ReadSingleAsync<int>();

                    station.ReturnCount = returnCount;

                    var departureDistanceAverage = await reader.ReadSingleAsync<double>();

                    station.DepartureDistanceAverage = departureDistanceAverage;

                    var returnDistanceAverage = await reader.ReadSingleAsync<double>();

                    station.ReturnDistanceAverage = returnDistanceAverage;
                    
                    // Station values in station list other than Id were null. Query worked fine in SQL Management Studio, returning proper values.

                    // Resorted to just fetch the top station ids and make a second query fetching stations with matching ids.

                    /*

                    var topOriginStations = reader.Read<Station>().ToList();

                    station.TopOriginStations = topOriginStations;

                    var topDestinationStations = reader.Read<Station>().ToList();

                    station.TopDestinationStations = topDestinationStations;

                    */

                    originStrings = reader.Read<string>().ToArray();

                    destinationStrings = reader.Read<string>().ToArray();

                    await connection.CloseAsync();

                    await connection.OpenAsync();

                    var topOriginQuery = "SELECT * FROM Stations WHERE Id IN @OriginStrings;";

                    var topDestinationQuery = " SELECT * FROM Stations WHERE Id IN @DestinationStrings;";

                    var topQueries = topOriginQuery + topDestinationQuery;

                    reader = await connection.QueryMultipleAsync(topQueries, new { OriginStrings = originStrings, DestinationStrings = destinationStrings });

                    var topOriginStations = (await reader.ReadAsync<Station>()).ToList();

                    var topDestinationStations = (await reader.ReadAsync<Station>()).ToList();

                    station.TopOriginStations = topOriginStations;

                    station.TopDestinationStations = topDestinationStations;
                }
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError);
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

            List<Station> stations;

            StationPage stationPage = new();

            var rowCount = 0;

            try
            {
                var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var reader = await connection.QueryMultipleAsync(query, parameters);

                    stations = reader.Read<Station>().ToList();

                    rowCount = reader.Read<int>().Single();

                    // Moved from the pure ADO.NET to Dapper.

                    /*

                    using (var command = new SqlCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {

                            while (reader.Read())
                            {
                                var station = new Station
                                {
                                    Id = reader["Id"] as string,
                                    Name_fi = reader["Name_fi"] as string,
                                    Name_se = reader["Name_se"] as string,
                                    Name_en = reader["Name_en"] as string,
                                    Address_fi = reader["Address_fi"] as string,
                                    Address_se = reader["Address_se"] as string,
                                    Operator = reader["Operator"] as string,
                                    Capacity = reader["Capacity"] as int?,
                                    X = reader["X"] == DBNull.Value ? null : reader.GetDecimal("X"),
                                    Y = reader["Y"] == DBNull.Value ? null : reader.GetDecimal("Y")
                                };

                                stations.Add(station);
                            }

                        }
                    }

                    */

                }
            }

            catch (Exception exception)
            {
                return StatusCode(500);
            }

            stationPage.Count = rowCount;

            var scheme = Url.ActionContext.HttpContext.Request.Scheme;

            // Set the url to the previous page as null if there is no previous page.

            string? previous = null;

            if (currentPage > 1 && rowCount > 0)
            {
                queryParameters.Page -= 1;

                previous = Url.Action("Index", "Station", queryParameters, scheme);
            }

            stationPage.Previous = previous;

            // Set the url to the next page as null if there is no next page.

            string? next = null;

            if ((int)Math.Ceiling((double)(rowCount / 20)) >= currentPage && rowCount > 0)
            {
                queryParameters.Page = currentPage + 1;

                next = Url.Action("Index", "Station", queryParameters, scheme);
            }

            stationPage.Next = next;

            stationPage.Stations = stations;

            stationPage.CurrentPage = currentPage;

            // Could send 204 No Content..

            if (rowCount == 0)
            {
                stationPage.CurrentPage = 0;
            }

            var json = JsonSerializer.Serialize(stationPage);

            return Content(json, "application/json", System.Text.Encoding.UTF8);
        }
    }
}

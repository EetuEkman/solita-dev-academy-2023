﻿using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using solita_dev_academy_2023_server.Models;
using System.Data;
using System.Text.Json;

namespace solita_dev_academy_2023_server.Controllers
{
    public class StationQueryParameters
    {
        public string? NameFi { get; set; }
        public string? NameSe { get; set; }
        public string? NameEn { get; set; }
        public string? AddressFi { get; set; }
        public string? AddressSe { get; set; }
        public int? Capacity { get; set; }
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
                " WHERE [Id] = @Id";

            Station? station;

            try
            {
                var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

                using (var connection = new SqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    station = await connection.QuerySingleOrDefaultAsync<Station>(query, parameters);
                }
            }
            catch (InvalidOperationException ioe)
            {
                // Dapper .QuerySingleOrDefault throws InvalidOperationException
                // when the query returns more than one element.

                return StatusCode(500);
            }
            catch (Exception exception)
            {
                return StatusCode(500);
            }

            if (station is null)
            {
                return StatusCode(204);
            }

            return Json(station);
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

            var query = "SELECT *" +
                " FROM [dbo].[Stations]" +
                " WHERE Name_fi LIKE @Name_fi" +
                " AND Name_se LIKE @Name_se" +
                " AND Name_en LIKE @Name_en" +
                " AND Address_fi LIKE @Address_fi" +
                " AND Address_se LIKE @Address_se";

            var countQuery = " SELECT COUNT(1)" +
                " FROM [dbo].[Stations]" +
                " WHERE Name_fi LIKE @Name_fi" +
                " AND Name_se LIKE @Name_se" +
                " AND Name_en LIKE @Name_en" +
                " AND Address_fi LIKE @Address_fi" +
                " AND Address_se LIKE @Address_se";

            // ORDER BY, needed for OFFSET.

            query += " ORDER BY Id ASC";

            var currentPage = 1;

            // Offset.

            query += " OFFSET @Offset ROWS";

            var offset = 0;

            // Use the keyword "FIRST" instead of "NEXT" for the first page.

            if (queryParameters.Page is not null && queryParameters.Page > 1)
            {
                offset = 20 * (int)queryParameters.Page + 1;

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

            if ((int)Math.Ceiling((double)(rowCount / 20)) > currentPage && rowCount > 0)
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

            var body = JsonSerializer.Serialize(stationPage);

            return Content(body, "application/json", System.Text.Encoding.UTF8);
        }
    }
}

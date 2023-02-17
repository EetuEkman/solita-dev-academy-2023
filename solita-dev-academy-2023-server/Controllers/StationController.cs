using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using solita_dev_academy_2023_server.Models;
using System.Collections.Generic;
using System.Data;
using System.Text.Json;

namespace solita_dev_academy_2023_server.Controllers
{
    public class StationQueryParameters
    {
        [FromQuery(Name = "name_fi")]
        public string? NameFi { get; set; }
        [FromQuery(Name = "name_se")]
        public string? NameSe { get; set; }
        [FromQuery(Name = "name_en")]
        public string? NameEn { get; set; }
        [FromQuery(Name = "address_fi")]
        public string? AddressFi { get; set; }
        [FromQuery(Name = "address_se")]
        public string? AddressSe { get; set; }
        [FromQuery(Name = "capacity")]
        public int? Capacity { get; set; }
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

                using (var connection = new SqlConnection(configuration.GetValue<string>("ConnectionStrings:Citybikes")))
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
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Dictionary for building dynamic parameters.

            var dictionary = new Dictionary<string, Object>()
            {
                { "@Name_fi", "%" },
                { "@Name_se", "%" },
                { "@Name_en", "%" },
                { "@Address_fi", "%" },
                { "@Address_se", "%" },
            };

            if (queryParameters.NameFi != null)
            {
                dictionary["@Name_fi"] = "%" + queryParameters.NameFi + "%";
            }

            if (queryParameters.NameSe != null)
            {
                dictionary["@Name_se"] = "%" + queryParameters.NameSe + "%";
            }

            if (queryParameters.NameEn != null)
            {
                dictionary["@Name_en"] = "%" + queryParameters.NameEn + "%";
            }

            if (queryParameters.AddressFi != null)
            {
                dictionary["@Address_fi"] = "%" + queryParameters.AddressFi + "%";
            }

            if (queryParameters.AddressSe != null)
            {
                dictionary["@Address_se"] = "%" + queryParameters.AddressSe + "%";
            }

            var parameters = new DynamicParameters(dictionary);

            var query = "SELECT *" +
                " FROM Stations" +
                " WHERE Name_fi LIKE @Name_fi" +
                " AND Name_se LIKE @Name_se" +
                " AND Name_en LIKE @Name_en" +
                " AND Address_fi LIKE @Address_fi" +
                " AND Address_se LIKE @Address_se";

            var countQuery = "COUNT(SELECT 1)" +
                " FROM [dbo].[Stations]" +
                " AND Name_se LIKE @Name_se" +
                " AND Name_en LIKE @Name_en" +
                " AND Address_fi LIKE @Address_fi" +
                " AND Address_se LIKE @Address_se";


            List<Station> stations;

            try
            {
                var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    stations = connection.Query<Station>(query, parameters).ToList();

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

            return Json(stations);
        }
    }
}

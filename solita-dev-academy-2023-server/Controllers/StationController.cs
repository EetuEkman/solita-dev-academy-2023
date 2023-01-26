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

        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromQuery] StationQueryParameters queryParameters)
        {
            // Dictionary for building dynamic parameters.

            var dictionary = new Dictionary<string, object>();

            // Build query.

            var query = "SELECT * " +
                "FROM Stations " +
                "WHERE 1=1";

            if (queryParameters.NameFi != null)
            {
                dictionary.Add("@Name_fi", "%" + queryParameters.NameFi + "%");

                query += " AND Name_fi LIKE @Name_fi";
            }

            if (queryParameters.NameSe != null)
            {
                dictionary.Add("@Name_se", "%" + queryParameters.NameSe + "%");

                query += " AND Name_se LIKE @Name_se";
            }

            if (queryParameters.NameEn != null)
            {
                dictionary.Add("@Name_en", "%" + queryParameters.NameEn + "%");

                query += " AND Name_en LIKE @Name_en";
            }

            if (queryParameters.AddressFi != null)
            {
                dictionary.Add("@Address_fi", "%" + queryParameters.AddressFi + "%");

                query += " AND Address_fi LIKE @Address_fi";
            }

            if (queryParameters.AddressSe != null)
            {
                dictionary.Add("@Address_se", "%" + queryParameters.AddressSe + "%");

                query += " AND Address_se LIKE @Address_se";
            }

            // Dapper parameters.

            var parameters = new DynamicParameters(dictionary);

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
                Console.WriteLine(exception.ToString());

                return StatusCode(500);
            }

            return Json(stations);
        }
    }
}

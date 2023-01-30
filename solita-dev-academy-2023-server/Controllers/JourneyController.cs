using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.Data.SqlClient;
using solita_dev_academy_2023_server.Models;
using System.Text.Json;
using System.Text.Json.Serialization;


namespace solita_dev_academy_2023_server.Controllers
{
    [Serializable]
    public class JourneyQueryParameters
    {
        public string? DateFrom { get; set; }
        public string? DateTo { get; set; }
        public int? CoveredDistanceFrom { get; set; }
        public int? CoveredDistanceTo { get; set; }
        public int? DurationFrom { get; set; }
        public int? DurationTo { get; set; }
        public string? DepartureStationName { get; set; }
        public string? ReturnStationName { get; set; }
        public int? Page { get; set; }

    }
    
    [ApiController]
    [Route("api/[controller]")]
    public class JourneyController : Controller
    {
        private readonly IConfiguration configuration;

        public JourneyController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromQuery]JourneyQueryParameters queryParameters)
        {
            var dictionary = new Dictionary<string, object>()
            {
                { "@Date_from", "%" },
                { "@Date_to", "%" },
                { "@CoveredDistanceFrom", "%" },
                { "@CoveredDistanceTo", "%" },
                { "@DurationFrom", "%" },
                { "@DurationTo", "%" },
                { "@DepartureStationName", "%" },
                { "@ReturnStationName", "%" }
           };

            var query = "SELECT J.Departure, J.[Return], J.Covered_distance, J.Duration," +
                " DS.Name_fi AS Departure_station_name_fi, DS.Name_se AS Departure_station_name_se, DS.Name_en AS Departure_station_name_en, DS.Address_fi AS Departure_station_address_fi, DS.Address_se AS Departure_station_address_se," +
                " RS.Name_fi AS Return_station_name_fi, RS.Name_se AS Return_station_name_se, RS.Name_en AS Return_station_name_en, RS.Address_fi AS Return_station_address_fi, RS.Address_se AS Return_station_address_se" +
                " FROM Journeys AS J" +
                " INNER JOIN Stations AS DS ON J.Departure_station_id = DS.Id" +
                " INNER JOIN Stations AS RS ON J.Return_station_id = RS.Id" +
                " ORDER BY J.Departure DESC, J.[Return] DESC" +
                " OFFSET @Offset ROWS";

            // Limit the number of rows returned by the query.

            var offset = 0;

            if (queryParameters.Page is not null)
            {
                offset = ((int)queryParameters.Page * 20) + 1;

                query += " FETCH NEXT 20 ROWS ONLY";
            }
            else
            {
                query += " FETCH FIRST 20 ROWS ONLY";
            }

            dictionary.Add("@Offset", offset);

            var parameters = new DynamicParameters(dictionary);

            List<Journey> journeys;

            try
            {
                var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    journeys = connection.Query<Journey>(query, parameters).ToList();
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500);
            }

            var result = new JourneyResult();

            result.Journeys = journeys;

            // For building the absolute url.

            var scheme = Url.ActionContext.HttpContext.Request.Scheme;

            // Build the url to the previous page.

            string? previous = null;

            if (queryParameters.Page > 1)
            {
                // Deep copy using System.Text.Json.

                var qp = JsonSerializer.Deserialize<JourneyQueryParameters>(JsonSerializer.Serialize(queryParameters));

                qp.Page -= 1;

                previous = Url.Action("Index", "Journey", qp, scheme);
            }

            // Build the url for the next page.

            string? next = null;

            if (queryParameters.Page is null)
            {
                queryParameters.Page = 1;
            }

            queryParameters.Page += 1;

            next = Url.Action("Index", "Journey", queryParameters, scheme);

            result.Previous = previous;

            result.Next = next;

            return Json(result);
        }
    }
}

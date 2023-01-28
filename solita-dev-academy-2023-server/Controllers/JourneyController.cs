using Dapper;
using Microsoft.AspNetCore.Mvc;
using solita_dev_academy_2023_server.Models;
using System.Text.Json;


namespace solita_dev_academy_2023_server.Controllers
{
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

            var query = "SELECT J.Departure, J.Return, J.Covered_distance, J.Duration," +
                " DS.Name_fi, DS.Name_se, DS.Name_en, DS.Address_fi, DS.Address_se," +
                " RS.Name_fi, RS.Name_se, RS.Name_en, RS.Address_fi, RS.Address_se" +
                " FROM Journeys AS J" +
                " INNER JOIN Stations AS DS ON J.Departure_station_id = DS.Id" +
                " INNER JOIN AS RS ON J.Return_station_id = RS.Id" +
                " ORDER BY J.Departure DESC, J.Return DESC" +
                " OFFSET @Offset";

            // Limit the number of rows returned by the query.

            var offset = 0;

            if (queryParameters.Page is not null)
            {
                offset = ((int)queryParameters.Page * 20) + 1;

                query += "FETCH NEXT 20 ROWS ONLY";
            }
            else
            {
                query += "FETCH FIRST 20 ROWS ONLY";
            }

            dictionary.Add("@Offset", offset);

            var parameters = new DynamicParameters(dictionary);

            var result = new JourneyResult();

            List<Journey> Journeys = new();

            result.Journeys = Journeys;

            return Json(result);
        }
    }
}

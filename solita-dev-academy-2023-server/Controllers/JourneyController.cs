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
        public string? DepartureDateFrom { get; set; }
        public string? DepartureDateTo { get; set; }
        public string? ReturnDateFrom { get; set; }
        public string? ReturnDateTo { get; set; }
        public int? CoveredDistanceFrom { get; set; }
        public int? CoveredDistanceTo { get; set; }
        public double? DurationFrom { get; set; }
        public double? DurationTo { get; set; }
        public string? DepartureStationNameFi { get; set; }
        public string? DepartureStationNameSe { get; set; }
        public string? DepartureStationNameEn { get; set; }
        public string? ReturnStationNameFi { get; set; }
        public string? ReturnStationNameSe { get; set; }
        public string? ReturnStationNameEn { get; set; }
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
            // For building dynamic parameters.

            var dictionary = new Dictionary<string, object>()
            {
                { "@DepartureStationNameFi", "%" },
                { "@DepartureStationNameSe", "%" },
                { "@DepartureStationNameEn", "%" },
                { "@ReturnStationNameFi", "%" },
                { "@ReturnStationNameSe", "%" },
                { "@ReturnStationNameEn", "%" }
            };

            // Base query.

            var query = "SELECT J.Departure, J.[Return], J.Covered_distance, J.Duration," +
                " DS.Name_fi AS Departure_station_name_fi, DS.Name_se AS Departure_station_name_se, DS.Name_en AS Departure_station_name_en, DS.Address_fi AS Departure_station_address_fi, DS.Address_se AS Departure_station_address_se," +
                " RS.Name_fi AS Return_station_name_fi, RS.Name_se AS Return_station_name_se, RS.Name_en AS Return_station_name_en, RS.Address_fi AS Return_station_address_fi, RS.Address_se AS Return_station_address_se" +
                " FROM Journeys AS J" +
                " INNER JOIN Stations AS DS ON J.Departure_station_id = DS.Id" +
                " INNER JOIN Stations AS RS ON J.Return_station_id = RS.Id" +
                " WHERE DS.Name_fi LIKE @DepartureStationNameFi" +
                " AND DS.Name_se LIKE @DepartureStationNameSe" +
                " AND DS.Name_en LIKE @DepartureStationNameEn" +
                " AND RS.Name_fi LIKE @ReturnStationNameFi" +
                " AND RS.Name_se LIKE @ReturnStationNameSe" +
                " AND RS.Name_en LIKE @ReturnStationNameEn";

            // Departure datetime.

            if (queryParameters.DepartureDateFrom is not null)
            {
                query += " AND J.Departure >= @DepartureDateFrom";

                dictionary.Add("@DepartureDateFrom", queryParameters.DepartureDateFrom);
            }

            if (queryParameters.DepartureDateTo is not null)
            {
                query += " AND J.Departure <= @DepartureDateTo";

                dictionary.Add("@DepartureDateTo", queryParameters.DepartureDateTo);
            }

            // Return datetime.

            if (queryParameters.ReturnDateFrom is not null)
            {
                query += " AND J.[Return] >= @ReturnDateFrom";

                dictionary.Add("@ReturnDateFrom", queryParameters.ReturnDateFrom);
            }

            if (queryParameters.ReturnDateTo is not null)
            {
                query += " AND J.[Return] <= @ReturnDateTo";

                dictionary.Add("@ReturnDateTo", queryParameters.ReturnDateTo);
            }

            // Departure station names.

            if (queryParameters.DepartureStationNameFi is not null)
            {
                dictionary["@DepartureStationNameFi"] = "%" + queryParameters.DepartureStationNameFi + "%";
            }

            if (queryParameters.DepartureStationNameSe is not null)
            {
                dictionary["@DepartureStationNameSe"] = "%" + queryParameters.DepartureStationNameSe + "%";
            }

            if (queryParameters.DepartureStationNameEn is not null)
            {
                dictionary["@DepartureStationNameEn"] = "%" + queryParameters.DepartureStationNameEn + "%";
            }

            // Return station names.

            if (queryParameters.ReturnStationNameFi is not null)
            {
                dictionary["@ReturnStationNameFi"] = "%" + queryParameters.ReturnStationNameFi + "%";
            }

            if (queryParameters.ReturnStationNameSe is not null)
            {
                dictionary["@ReturnStationNameSe"] = "%" + queryParameters.ReturnStationNameSe + "%";
            }

            if (queryParameters.ReturnStationNameEn is not null)
            {
                dictionary["@ReturnStationNameEn"] = "%" + queryParameters.ReturnStationNameEn + "%";
            }

            // Duration.

            if (queryParameters.DurationFrom is not null && queryParameters.DurationTo is not null)
            {
                query += "AND J.Duration BETWEEN @DurationFrom AND @DurationTo";

                dictionary.Add("@DurationFrom", queryParameters.DurationFrom);

                dictionary.Add("@DurationTo", queryParameters.DurationTo);
            }
            else if (queryParameters.DurationFrom is not null && queryParameters.DurationTo is null)
            {
                query += "AND J.Duration >= @DurationFrom";

                dictionary.Add("@DurationFrom", queryParameters.DurationFrom);
            }
            else if (queryParameters.DurationTo is not null && queryParameters.DurationFrom is null)
            {
                query += "AND J.Duration <= @DurationTo";

                dictionary.Add("@DurationTo", queryParameters.DurationTo);
            }

            // Covered distance.

            if (queryParameters.CoveredDistanceFrom is not null && queryParameters.CoveredDistanceTo is not null)
            {
                query += "AND J.Covered_distance BETWEEN @CoveredDistanceFrom AND @CoveredDistanceTo";

                dictionary.Add("@CoveredDistanceFrom", queryParameters.CoveredDistanceFrom);

                dictionary.Add("@CoveredDistanceTo", queryParameters.CoveredDistanceTo);
            }
            else if (queryParameters.CoveredDistanceFrom is not null)
            {
                query += "AND J.Covered_distance >= @CoveredDistanceFrom";

                dictionary.Add("@CoveredDistanceFrom", queryParameters.CoveredDistanceFrom);
            }
            else if (queryParameters.CoveredDistanceTo is not null)
            {
                query += "AND J.CoveredDistance <= @CoveredDistanceTo";

                dictionary.Add("@Covered_distanceTo", queryParameters.CoveredDistanceTo);
            }

            // Limit the number of rows returned by the query.

            query += " ORDER BY J.Departure DESC" + 
                " OFFSET @Offset ROWS";

            var offset = 0;

            // Use the keyword "FIRST" instead of "NEXT" for the first page.

            if (queryParameters.Page is not null && queryParameters.Page != 1)
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

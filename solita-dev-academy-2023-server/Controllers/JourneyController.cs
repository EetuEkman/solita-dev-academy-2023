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
        public DateTime? DepartureDateFrom { get; set; }
        public DateTime? DepartureDateTo { get; set; }
        public DateTime? ReturnDateFrom { get; set; }
        public DateTime? ReturnDateTo { get; set; }
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
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromQuery]JourneyQueryParameters queryParameters)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

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

            // Result count.

            var countQuery = " SELECT COUNT(*)" +
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

                countQuery += " AND J.Departure >= @DepartureDateFrom";

                dictionary.Add("@DepartureDateFrom", queryParameters.DepartureDateFrom);
            }

            if (queryParameters.DepartureDateTo is not null)
            {
                query += " AND J.Departure <= @DepartureDateTo";
                
                countQuery += " AND J.Departure <= @DepartureDateTo";

                dictionary.Add("@DepartureDateTo", queryParameters.DepartureDateTo);
            }

            // Return datetime.

            if (queryParameters.ReturnDateFrom is not null)
            {
                query += " AND J.[Return] >= @ReturnDateFrom";
                
                countQuery += " AND J.[Return] >= @ReturnDateFrom";

                dictionary.Add("@ReturnDateFrom", queryParameters.ReturnDateFrom);
            }

            if (queryParameters.ReturnDateTo is not null)
            {
                query += " AND J.[Return] <= @ReturnDateTo";

                countQuery += " AND J.[Return] <= @ReturnDateTo";

                dictionary.Add("@ReturnDateTo", queryParameters.ReturnDateTo);
            }

            // Departure station names.

            if (String.IsNullOrWhiteSpace(queryParameters.DepartureStationNameFi) == false)
            {
                dictionary["@DepartureStationNameFi"] = "%" + queryParameters.DepartureStationNameFi + "%";
            }

            if (String.IsNullOrWhiteSpace(queryParameters.DepartureStationNameSe) == false)
            {
                dictionary["@DepartureStationNameSe"] = "%" + queryParameters.DepartureStationNameSe + "%";
            }

            if (String.IsNullOrWhiteSpace(queryParameters.DepartureStationNameEn) == false)
            {
                dictionary["@DepartureStationNameEn"] = "%" + queryParameters.DepartureStationNameEn + "%";
            }

            // Return station names.

            if (String.IsNullOrWhiteSpace(queryParameters.ReturnStationNameFi) == false)
            {
                dictionary["@ReturnStationNameFi"] = "%" + queryParameters.ReturnStationNameFi + "%";
            }

            if (String.IsNullOrWhiteSpace(queryParameters.ReturnStationNameSe) == false)
            {
                dictionary["@ReturnStationNameSe"] = "%" + queryParameters.ReturnStationNameSe + "%";
            }

            if (String.IsNullOrWhiteSpace(queryParameters.ReturnStationNameEn) == false)
            {
                dictionary["@ReturnStationNameEn"] = "%" + queryParameters.ReturnStationNameEn + "%";
            }

            // Duration.

            if (queryParameters.DurationFrom is not null && queryParameters.DurationTo is not null)
            {
                query += " AND J.Duration BETWEEN @DurationFrom AND @DurationTo";

                countQuery += " AND J.Duration BETWEEN @DurationFrom AND @DurationTo";

                dictionary.Add("@DurationFrom", queryParameters.DurationFrom);

                dictionary.Add("@DurationTo", queryParameters.DurationTo);
            }
            else if (queryParameters.DurationFrom is not null && queryParameters.DurationTo is null)
            {
                query += " AND J.Duration >= @DurationFrom";
                
                countQuery += " AND J.Duration >= @DurationFrom";

                dictionary.Add("@DurationFrom", queryParameters.DurationFrom);
            }
            else if (queryParameters.DurationFrom is null && queryParameters.DurationTo is not null)
            {
                query += " AND J.Duration <= @DurationTo";

                countQuery += " AND J.Duration <= @DurationTo";

                dictionary.Add("@DurationTo", queryParameters.DurationTo);
            }

            // Covered distance.

            if (queryParameters.CoveredDistanceFrom is not null && queryParameters.CoveredDistanceTo is not null)
            {
                query += " AND J.Covered_distance BETWEEN @CoveredDistanceFrom AND @CoveredDistanceTo";

                countQuery += " AND J.Covered_distance BETWEEN @CoveredDistanceFrom AND @CoveredDistanceTo";

                dictionary.Add("@CoveredDistanceFrom", queryParameters.CoveredDistanceFrom);

                dictionary.Add("@CoveredDistanceTo", queryParameters.CoveredDistanceTo);
            }
            else if (queryParameters.CoveredDistanceFrom is not null && queryParameters.CoveredDistanceTo is null)
            {
                query += " AND J.Covered_distance >= @CoveredDistanceFrom";

                countQuery += " AND J.Covered_distance >= @CoveredDistanceFrom";

                dictionary.Add("@CoveredDistanceFrom", queryParameters.CoveredDistanceFrom);
            }
            else if (queryParameters.CoveredDistanceFrom is null && queryParameters.CoveredDistanceTo is not null)
            {
                query += " AND J.CoveredDistance <= @CoveredDistanceTo";

                countQuery += " AND J.CoveredDistance <= @CoveredDistanceTo";

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

                query += " FETCH NEXT 20 ROWS ONLY;";
            }
            else
            {
                query += " FETCH FIRST 20 ROWS ONLY;";
            }

            // Combine the two queries.

            query += countQuery;

            dictionary.Add("@Offset", offset);

            var parameters = new DynamicParameters(dictionary);

            List<Journey> journeys;

            var count = 0;

            try
            {
                var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    var reader = connection.QueryMultiple(query, parameters);

                    journeys = reader.Read<Journey>().ToList();

                    count = reader.Read<int>().Single();
                }
            }
            catch(Exception ex)
            {
                return StatusCode(500);
            }

            var result = new JourneyPage();

            result.Journeys = journeys;

            result.Count = count;

            // For building the absolute url.

            var scheme = Url.ActionContext.HttpContext.Request.Scheme;

            // Current page is by default 1.

            int currentPage = 1;

            // Build the url to the previous page.

            string? previous = null;

            if (queryParameters.Page > 1)
            {
                currentPage = (int)queryParameters.Page;

                queryParameters.Page = currentPage - 1;

                previous = Url.Action("Index", "Journey", queryParameters, scheme);
            }

            result.Previous = previous;

            result.CurrentPage = currentPage;

            // Build the url for the next page.

            string? next = null;

            // 21 rows, 20 per page. We're on page 1.
            // 21 / 20 = 1.05 => 2 pages.
            // If results / results per page > current page, there's another page.
            // Build the url for that page.

            // 20 rows, 20 per page. We're on page 1.
            // 20 / 20 = 1 => 1 page.
            // 1 page == current page 1, There are no more pages,
            // keep the next null.

            // 448 results, 20 per page. We're on page 10.
            // 448 / 20 = 22.4 => 23 pages.
            // 23 > current page 10, build url for the next page.

            // 448 results, 20 per page. We're on page 23.
            // 448 / 20 = 22.4 => 23 pages.
            // 23 pages == current page 23. There are no more pages,
            // keep the next null.

            if ((int)Math.Ceiling((double)(count / 20)) > currentPage)
            {
                queryParameters.Page = currentPage + 1;
            }

            next = Url.Action("Index", "Journey", queryParameters, scheme);

            result.Next = next;

            return Json(result);
        }
    }
}

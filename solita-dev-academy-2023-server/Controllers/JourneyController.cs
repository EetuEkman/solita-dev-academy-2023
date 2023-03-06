using Dapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using solita_dev_academy_2023_server.Models;
using System.Text.Json;

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
        public string? OrderBy { get; set; }
        public string? Order { get; set; }
        public int? Page { get; set; }
    }

    [ApiController]
    [Route("api/[controller]")]
    public class JourneyController : Controller
    {
        // Accepted order by options.

        // Point is to accept capital letters and spaces.

        public static readonly string[] OrderByOptions =
        {
            "departure",
            "return",
            "distance",
            "duration",
            "departurestationnamefi",
            "departurestationnamese",
            "departurestationnameen",
            "returnstationnamefi",
            "returnstationnamese",
            "returnstationnameen"
        };

        // Accepted order options.

        public static readonly string[] OrderOptions =
        {
            "descending",
            "desc",
            "ascending",
            "asc"
        };

        private readonly IConfiguration configuration;

        public JourneyController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        [HttpGet(Name = "GetJourneys")]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromQuery] JourneyQueryParameters queryParameters)
        {
            // Validate order by option.

            string orderByOption = "";

            if (queryParameters.OrderBy is not null)
            {
                // Accept capital letters and spaces.

                orderByOption = queryParameters.OrderBy.ToLower().Replace(" ", String.Empty);

                if (OrderByOptions.Contains(orderByOption) == false)
                {
                    ModelState.AddModelError("OrderBy", "Undefined order by option " + queryParameters.OrderBy);
                }
            }

            // Validate order.

            if (queryParameters.Order is not null)
            {
                if (OrderOptions.Contains(queryParameters.Order.ToLower()) == false) 
                {
                    ModelState.AddModelError("Order", "Undefined order option " + queryParameters.Order);
                }
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // For building dynamic parameters.

            var dictionary = new Dictionary<string, object>();

            // Base query.

            var query = @$"SELECT J.Departure, J.[Return], J.Covered_distance, J.Duration,
                 DS.Name_fi Departure_station_name_fi, DS.Name_se Departure_station_name_se, DS.Name_en Departure_station_name_en, DS.Address_fi Departure_station_address_fi, DS.Address_se Departure_station_address_se,
                 RS.Name_fi Return_station_name_fi, RS.Name_se Return_station_name_se, RS.Name_en Return_station_name_en, RS.Address_fi Return_station_address_fi, RS.Address_se Return_station_address_se
                 FROM Journeys J
                 INNER JOIN Stations DS ON J.Departure_station_id = DS.Id
                 INNER JOIN Stations RS ON J.[Return_station_id] = RS.Id
                 WHERE 1 = 1";

            // Result count query.

            var countQuery = @$" SELECT COUNT(1)
                 FROM Journeys AS J
                 INNER JOIN Stations AS DS ON J.Departure_station_id = DS.Id
                 INNER JOIN Stations AS RS ON J.[Return_station_id] = RS.Id
                 WHERE 1 = 1";

            // Departure station names.

            if (String.IsNullOrEmpty(queryParameters.DepartureStationNameFi) == false)
            {
                dictionary["@DepartureStationNameFi"] = "%" + queryParameters.DepartureStationNameFi + "%";

                query += " AND DS.Name_fi LIKE @DepartureStationNameFi";

                countQuery += " AND DS.Name_fi LIKE @DepartureStationNameFi";
            }

            if (String.IsNullOrEmpty(queryParameters.DepartureStationNameSe) == false)
            {
                dictionary["@DepartureStationNameSe"] = "%" + queryParameters.DepartureStationNameSe + "%";

                query += " AND DS.Name_se LIKE @DepartureStationNameSe";

                countQuery += " AND DS.Name_se LIKE @DepartureStationNameSe";
            }

            if (String.IsNullOrEmpty(queryParameters.DepartureStationNameEn) == false)
            {
                dictionary["@DepartureStationNameEn"] = "%" + queryParameters.DepartureStationNameEn + "%";

                query += " AND DS.Name_en LIKE @DepartureStationNameEn";

                countQuery += " AND DS.Name_en LIKE @DepartureStationNameEn";
            }

            // Return station names.

            if (String.IsNullOrEmpty(queryParameters.ReturnStationNameFi) == false)
            {
                dictionary["@ReturnStationNameFi"] = "%" + queryParameters.ReturnStationNameFi + "%";

                query += " AND RS.Name_fi LIKE @ReturnStationNameFi";

                countQuery += " AND RS.Name_fi LIKE @ReturnStationNameFi";
            }

            if (String.IsNullOrEmpty(queryParameters.ReturnStationNameSe) == false)
            {
                dictionary["@ReturnStationNameSe"] = "%" + queryParameters.ReturnStationNameSe + "%";

                query += " AND RS.Name_se LIKE @ReturnStationNameSe";

                countQuery += " AND RS.Name_se LIKE @ReturnStationNameSe";
            }

            if (String.IsNullOrEmpty(queryParameters.ReturnStationNameEn) == false)
            {
                dictionary["@ReturnStationNameEn"] = "%" + queryParameters.ReturnStationNameEn + "%";

                query += " AND RS.Name_en LIKE @ReturnStationNameEn";

                countQuery += " AND RS.Name_en LIKE @ReturnStationNameEn";
            }

            // Departure datetime.

            // Using BETWEEN.

            /*

            if (queryParameters.DepartureDateFrom is not null && queryParameters.DepartureDateTo is not null)
            {
                // If departure date from is later than the departure date to, swap them.

                if (queryParameters.DepartureDateTo > queryParameters.DepartureDateFrom)
                {
                    var swap = queryParameters.DepartureDateFrom;

                    queryParameters.DepartureDateFrom = queryParameters.DepartureDateTo;

                    queryParameters.DepartureDateTo = swap;
                }

                query += " AND J.Departure BETWEEN @DepartureDateFrom AND @DepartureDateTo";
           
                countQuery += " AND J.Departure BETWEEN @DepartureDateFrom AND @DepartureDateTo";

                dictionary.Add("@DepartureDateFrom", queryParameters.DepartureDateFrom);

                dictionary.Add("@DepartureDateTo", queryParameters.DepartureDateTo);

            }
            else if (queryParameters.DepartureDateFrom is not null && queryParameters.DepartureDateTo is null)
            {
                query += " AND J.Departure >= @DepartureDateFrom";

                countQuery += " AND J.Departure >= @DepartureDateFrom";

                dictionary.Add("DepartureDateFrom", queryParameters.DepartureDateFrom);
            }
            else if (queryParameters.DepartureDateFrom is null && queryParameters.DepartureDateTo is not null)
            {
                query += " AND J.Departure <= @DepartureDateTo";

                countQuery += " AND J.Departure <= @DepartureDateTo";

                dictionary.Add("DepartureDateTo", queryParameters.DepartureDateTo);
            }

            */

            // Using comparison operators.

            if (queryParameters.DepartureDateFrom is not null)
            {
                // If departure date from is later than the return date to, swap them.

                if (queryParameters.DepartureDateTo is not null && queryParameters.DepartureDateTo < queryParameters.DepartureDateFrom)
                {
                    (queryParameters.DepartureDateTo, queryParameters.DepartureDateFrom) = (queryParameters.DepartureDateFrom, queryParameters.DepartureDateTo);
                }

                query += " AND [J].[Departure] >= @DepartureDateFrom";

                countQuery += " AND [J].[Departure] >= @DepartureDateFrom";

                var dateTime = (DateTime)queryParameters.DepartureDateFrom;

                var date = dateTime.ToString("yyyy-MM-dd");

                dictionary.Add("@DepartureDateFrom", date);
            }

            if (queryParameters.DepartureDateTo is not null)
            {
                query += " AND [J].[Departure] <= @DepartureDateTo";

                countQuery += " AND [J].[Departure] <= @DepartureDateTo";

                var dateTime = (DateTime)queryParameters.DepartureDateTo;

                var date = dateTime.ToString("yyyy-MM-dd");

                dictionary.Add("@DepartureDateTo", date);
            }

            // Return datetime.

            // Using BETWEEN.

            /*

            if (queryParameters.ReturnDateFrom is not null && queryParameters.ReturnDateTo is not null)
            {
                // If return date from is later than the return date to, swap them.

                if (queryParameters.ReturnDateTo > queryParameters.ReturnDateFrom)
                {
                    var swap = queryParameters.ReturnDateFrom;

                    queryParameters.ReturnDateFrom = queryParameters.ReturnDateTo;

                    queryParameters.ReturnDateTo = swap;
                }

                query += " AND J.Return BETWEEN @ReturnDateFrom AND @ReturnDateTo";

                countQuery += " AND J.Return BETWEEN @ReturnDateFrom AND @ReturnDateTo";

                dictionary.Add("@ReturnDateFrom", queryParameters.ReturnDateFrom);

                dictionary.Add("@ReturnDateTo", queryParameters.ReturnDateTo);

            }
            else if (queryParameters.ReturnDateFrom is not null && queryParameters.ReturnDateTo is null)
            {
                query += " AND J.Return >= @ReturnDateFrom";

                countQuery += " AND J.Return >= @ReturnDateFrom";

                dictionary.Add("ReturnDateFrom", queryParameters.ReturnDateFrom);
            }
            else if (queryParameters.ReturnDateFrom is null && queryParameters.ReturnDateTo is not null)
            {
                query += " AND J.Return <= @ReturnDateTo";

                countQuery += " AND J.Return <= @ReturnDateTo";

                dictionary.Add("ReturnDateTo", queryParameters.ReturnDateTo);
            }

           */

            // Using comparison operators.

            if (queryParameters.ReturnDateFrom is not null)
            {
                // If return date from is later than the return date to, swap them.

                if (queryParameters.ReturnDateTo is not null && queryParameters.ReturnDateTo < queryParameters.ReturnDateFrom)
                {
                    (queryParameters.ReturnDateTo, queryParameters.ReturnDateFrom) = (queryParameters.ReturnDateFrom, queryParameters.ReturnDateTo);
                }

                query += " AND [J].[Return] >= @ReturnDateFrom";

                countQuery += " AND [J].[Return] >= @ReturnDateFrom";

                var dateTime = (DateTime)queryParameters.ReturnDateFrom;

                var date = dateTime.ToString("yyyy-MM-dd");

                dictionary.Add("@ReturnDateFrom", date);
            }

            if (queryParameters.ReturnDateTo is not null)
            {
                query += " AND [J].[Return] <= @ReturnDateTo";

                countQuery += " AND [J].[Return] <= @ReturnDateTo";

                var dateTime = (DateTime)queryParameters.ReturnDateTo;

                var date = dateTime.ToString("yyyy-MM-dd");

                dictionary.Add("@ReturnDateTo", date);
            }

            // Departure station names.

            /*

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

            */

            // Duration.

            if (queryParameters.DurationFrom is not null)
            {
                // If duration from is larger than the duration to, swap them.

                if (queryParameters.DurationTo is not null && queryParameters.DurationTo < queryParameters.DurationFrom)
                {
                    (queryParameters.DurationTo, queryParameters.DurationFrom) = (queryParameters.DurationFrom, queryParameters.DurationTo);
                }

                query += " AND [J].[Duration] >= @DurationFrom";

                countQuery += " AND [J].[Duration] >= @DurationFrom";

                dictionary.Add("@DurationFrom", queryParameters.DurationFrom);
            }

            if (queryParameters.DurationTo is not null)
            {
                query += " AND [J].[Duration] <= @DurationTo";

                countQuery += " AND [J].[Duration] <= @DurationTo";

                dictionary.Add("@DurationTo", queryParameters.DurationTo);
            }

            // Changed to comparison operators.

            /*

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

            */

            // Covered distance.

            if (queryParameters.CoveredDistanceFrom is not null)
            {
                // If covered distance from is larger than the covered distance to, swap them.

                if (queryParameters.CoveredDistanceTo is not null && queryParameters.CoveredDistanceTo < queryParameters.CoveredDistanceFrom)
                {
                    (queryParameters.CoveredDistanceTo, queryParameters.CoveredDistanceFrom) = (queryParameters.CoveredDistanceFrom, queryParameters.CoveredDistanceTo);
                }

                query += " AND [J].[Covered_distance] >= @CoveredDistanceFrom";

                countQuery += " AND [J].[Covered_distance] >= @CoveredDistanceFrom";

                dictionary.Add("@CoveredDistanceFrom", queryParameters.CoveredDistanceFrom);
            }

            if (queryParameters.CoveredDistanceTo is not null)
            {
                query += " AND [J].[Covered_distance] <= @CoveredDistanceTo";

                countQuery += " AND [J].[Covered_distance] <= @CoveredDistanceTo";

                dictionary.Add("@CoveredDistanceTo", queryParameters.CoveredDistanceTo);
            }

            // Switched to comparison operators.

            /*

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

            */

            // Ordering.

            var orderBy = " ORDER BY [J].[Departure]";

            if (queryParameters.OrderBy != null)
            {
                switch (orderByOption)
                {
                    case "departure":
                        break;
                    case "return":
                        orderBy = " ORDER BY [J].[Return]";
                        break;
                    case "duration":
                        orderBy = " ORDER BY [J].[Duration]";
                        break;
                    case "distance":
                        orderBy = " ORDER BY [J].[Covered_distance]";
                        break;
                    case "departurestationnamefi":
                        orderBy = " ORDER BY [Departure_station_name_fi]";
                        break;
                    case "departurestationnamese":
                        orderBy = " ORDER BY [Departure_station_name_se]";
                        break;
                    case "departurestationnameen":
                        orderBy = " ORDER BY [Departure_station_name_en]";
                        break;
                    case "returnstationnamefi":
                        orderBy = " ORDER BY [Return_station_name_fi]";
                        break;
                    case "returnstationnamese":
                        orderBy = " ORDER BY [Return_station_name_se]";
                        break;
                    case "returnstationnameen":
                        orderBy = " ORDER BY [Return_station_name_en]";
                        break;
                    default:
                        break;
                }
            }

            query += orderBy;

            var order = " DESC";

            if (queryParameters.Order != null)
            {
                var lowerOrder = queryParameters.Order.ToLower();

                switch (lowerOrder)
                {
                    case "ascending":
                    case "asc":
                        order = " ASC";
                        break;
                    case "descending":
                    case "desc":
                        order = " DESC";
                        break;
                    default:
                       break;
                }
            }

            query += order;

            // Limit the number of rows returned by the query.

            query += " OFFSET @Offset ROWS";

            var offset = 0;

            // Use the keyword "FIRST" instead of "NEXT" for the first page.

            if (queryParameters.Page is not null && queryParameters.Page > 1)
            {
                offset = (((int)queryParameters.Page - 1) * 20);

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
                var connectionString = configuration.GetConnectionString("Citybikes");

                using (var connection = new SqlConnection(connectionString))
                {
                    var reader = await connection.QueryMultipleAsync(query, parameters);

                    var readJourneys = reader.ReadAsync<Journey>();

                    var readCount = reader.ReadSingleAsync<int>();

                    journeys = (await readJourneys).ToList();

                    count = (await readCount);
                }
            }
            catch (Exception exception)
            {
                return StatusCode(500, exception.Message);
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

            if ((int)Math.Ceiling((double)(count / 20)) >= currentPage)
            {
                queryParameters.Page = currentPage + 1;

                next = Url.Action("Index", "Journey", queryParameters, scheme);
            }

            result.Next = next;

            var page = JsonSerializer.Serialize(result);

            return Content(page, "application/json", System.Text.Encoding.UTF8);
        }
    }
}

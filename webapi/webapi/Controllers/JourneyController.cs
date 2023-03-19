using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using webapi_library;
using webapi_library.Models;

namespace webapi.Controllers
{
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

        private readonly DataAccess dataAccess;
        private readonly QueryBuilder queryBuilder = new();

        public JourneyController(IConfiguration configuration)
        {

            dataAccess = new DataAccess(configuration);
        }

        [HttpGet(Name = "GetJourneys")]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index([FromQuery] JourneyQueryParameters queryParameters)
        {
            // Validate order by option.

            if (queryParameters.OrderBy is not null)
            {
                // Accept capital letters and spaces.

                var orderByOption = queryParameters.OrderBy.ToLower().Replace(" ", String.Empty);

                if (OrderByOptions.Contains(orderByOption) == false)
                {
                    ModelState.AddModelError("OrderBy", "Undefined order by option " + queryParameters.OrderBy);
                }
                else
                {
                    queryParameters.OrderBy = orderByOption;
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

            var query = queryBuilder.GetJourneysQueryString(queryParameters);

            JourneysPage journeysPage;

            try
            {
                journeysPage = await dataAccess.GetJourneysPage(query);
            }
            catch (Exception exception)
            {
                return StatusCode(500, exception.Message);
            }

            // For building the absolute url.

            var scheme = Url.ActionContext.HttpContext.Request.Scheme;

            // Current page is by default 1.

            int currentPage = 1;

            // Build the url to the previous page.

            string? previous = null;

            if (queryParameters.Page > 1 && journeysPage.Count > 20)
            {
                currentPage = (int)queryParameters.Page;

                queryParameters.Page = currentPage - 1;

                previous = Url.Action("Index", "Journey", queryParameters, scheme);
            }

            journeysPage.Previous = previous;

            journeysPage.CurrentPage = currentPage;

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

            if ((int)Math.Ceiling((double)(journeysPage.Count / 20)) >= currentPage)
            {
                queryParameters.Page = currentPage + 1;

                next = Url.Action("Index", "Journey", queryParameters, scheme);
            }

            journeysPage.Next = next;

            var json = JsonSerializer.Serialize(journeysPage);

            return Content(json, "application/json", System.Text.Encoding.UTF8);
        }
    }
}

using Dapper;
using dev_academy_server_library;
using dev_academy_server_library.Models;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Text.Json;

namespace solita_dev_academy_2023_server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class StationController : Controller
    {
        private readonly DataAccess dataAccess;
        private readonly QueryBuilder queryBuilder = new();

        public StationController(IConfiguration configuration)
        {
            dataAccess = new DataAccess(configuration);
        }

        [HttpGet("{Id}", Name = "GetStation")]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(400)]
        [ProducesResponseType(404)]
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

            DetailedStation? station;

            var query = queryBuilder.GetStationQueryString(Id);

            try
            {
                station = await dataAccess.GetDetailedStation(query);
            }
            catch (Exception exception)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, exception.Message);
            }

            if (station == null)
            {
                return NotFound();
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

            var query = queryBuilder.GetStationsQueryString(queryParameters);

            StationsPage stationsPage = new();

            try
            {
                stationsPage = await dataAccess.GetStationsPage(query);
            }

            catch (Exception exception)
            {
                return StatusCode(500, exception.Message);
            }

            var currentPage = 1;

            var scheme = Url.ActionContext.HttpContext.Request.Scheme;

            // Set the url to the previous page as null if there is no previous page.

            string? previous = null;

            if (queryParameters.Page > 1 && stationsPage.Count > 20)
            {
                currentPage = (int)queryParameters.Page;

                queryParameters.Page -= 1;

                previous = Url.Action("Index", "Station", queryParameters, scheme);
            }

            stationsPage.Previous = previous;

            // Set the url to the next page as null if there is no next page.

            string? next = null;

            if ((int)Math.Ceiling((double)(stationsPage.Count / 20)) >= currentPage && stationsPage.Count > 0)
            {
                queryParameters.Page = currentPage + 1;

                next = Url.Action("Index", "Station", queryParameters, scheme);
            }

            stationsPage.Next = next;

            stationsPage.CurrentPage = currentPage;

            if (stationsPage.Count == 0)
            {
                stationsPage.CurrentPage = 0;
            }

            var json = JsonSerializer.Serialize(stationsPage);

            return Content(json, "application/json", System.Text.Encoding.UTF8);
        }
    }
}

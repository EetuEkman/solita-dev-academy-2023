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

    }
    [ApiController]
    [Route("api/[controller]")]
    public class JourneyController : Controller
    {
        List<Journey> Journeys = new();

        [HttpGet]
        [Produces("application/json")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index(JourneyQueryParameters parameters)
        {
            return Json(Journeys);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace solita_dev_academy_2023_server.Controllers
{
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
        [Produces("text/plain")]
        [ProducesResponseType(200)]
        [ProducesResponseType(500)]
        public async Task<IActionResult> Index()
        {
            var connectionString = configuration.GetValue<string>("ConnectionStrings:Citybikes");

            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();

                    var query = "SELECT *" +
                        "FROM [dbo].[Stations]";

                    using (var command = new SqlCommand(query, connection))
                    {
                        using (var reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                    
                            }
                        }
                    }
                }
            }

            catch (Exception exception)
            {
                Console.WriteLine(exception.ToString());

                return StatusCode(500);
            }
            

            return Content("List of bike stations.");
        }
    }
}

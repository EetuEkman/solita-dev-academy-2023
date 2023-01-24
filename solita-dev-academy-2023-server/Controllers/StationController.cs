using Microsoft.AspNetCore.Mvc;

namespace solita_dev_academy_2023_server.Controllers
{
    public class StationController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}

namespace webapi_library.Models
{
    public class JourneysPage
    {
        public IEnumerable<Journey> Journeys { get; set; } = new List<Journey>();
        public int Count { get; set; } = 0;
        public int CurrentPage { get; set; }
        public string? Next { get; set; }
        public string? Previous { get; set; }
    }
}

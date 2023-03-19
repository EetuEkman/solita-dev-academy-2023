namespace webapi_library.Models
{
    public class StationsPage
    {
        public IEnumerable<Station> Stations { get; set; } = new List<Station>();
        public int Count { get; set; }
        public int CurrentPage { get; set; }
        public string? Next { get; set; }
        public string? Previous { get; set; }
    }
}

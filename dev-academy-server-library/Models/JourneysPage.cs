namespace dev_academy_server_library.Models
{
    [Serializable]
    public class JourneysPage
    {
        public IEnumerable<Journey> Journeys { get; set; } = new List<Journey>();
        public int? Count { get; set; }
        public int CurrentPage { get; set; }
        public string? Next { get; set; }
        public string? Previous { get; set; }
    }
}

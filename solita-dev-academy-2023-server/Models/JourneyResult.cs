namespace solita_dev_academy_2023_server.Models
{
    public class JourneyResult
    {
        public List<Journey> Journeys { get; set; }
        public string? Next { get; set; }
        public string? Previous { get; set; }
    }
}

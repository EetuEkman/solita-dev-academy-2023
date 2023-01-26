namespace solita_dev_academy_2023_server.Models
{
    public class Journey
    {
        public int? Id { get; set; }
        public DateTime? Departure { get; set; }
        public DateTime? Return { get; set; }
        public string? Departure_station_id { get; set; }
        public string? Departure_station_name { get; set; }
        public string? Return_station_id { get; set; }
        public string? Return_station_name { get; set; }
        public double? Covered_distance { get; set; }
        public double? Duration { get; set; }
    }
}

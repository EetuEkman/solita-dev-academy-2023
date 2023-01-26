namespace solita_dev_academy_2023_server.Models
{
    public record Journey
    {
        public int? Id { get; init; }
        public DateTime? Departure { get; init; }
        public DateTime? Return { get; init; }
        public string? Departure_station_id { get; init; }
        public string? Departure_station_name { get; init; }
        public string? Return_station_id { get; init; }
        public string? Return_station_name { get; init; }
        public double? Covered_distance { get; init; }
        public double? Duration { get; init; }
    }
}

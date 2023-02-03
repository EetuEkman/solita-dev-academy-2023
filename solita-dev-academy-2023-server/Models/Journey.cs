namespace solita_dev_academy_2023_server.Models
{
    [Serializable]
    public class Journey
    {
        public DateTime? Departure { get; set; }
        public DateTime? Return { get; set; }
        public string? Departure_station_name_fi { get; set; }
        public string? Departure_station_name_se { get; set; }
        public string? Departure_station_name_en { get; set; }
        public string? Departure_station_address_fi { get; set; }
        public string? Departure_station_address_se { get; set; }
        public string? Return_station_name_fi { get; set; }
        public string? Return_station_name_se { get; set; }
        public string? Return_station_name_en { get; set; }
        public string? Return_station_address_fi { get; set; }
        public string? Return_station_address_se { get; set; }
        public double? Covered_distance { get; set; }
        public float? Duration { get; set; }
    }
}

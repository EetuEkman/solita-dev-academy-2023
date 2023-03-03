namespace solita_dev_academy_2023_server.Models
{
    public class DetailedStation : Station
    {
        public int DepartureCount { get; set; }
        public int ReturnCount { get; set; }
        public double DepartureDistanceAverage { get; set; }
        public double ReturnDistanceAverage { get; set; }
        public ICollection<PopularStation> TopDestinationStations { get; set; }
        public ICollection<PopularStation> TopOriginStations { get; set; }
    }
}

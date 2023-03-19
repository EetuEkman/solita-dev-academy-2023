namespace webapi_library.Models
{
    public class DetailedStation : Station
    {
        public int DepartureCount { get; set; }
        public int ReturnCount { get; set; }
        public double DepartureDistanceAverage { get; set; }
        public double ReturnDistanceAverage { get; set; }
        public IEnumerable<PopularStation> TopDestinationStations { get; set; } = new List<PopularStation>();
        public IEnumerable<PopularStation> TopOriginStations { get; set; } = new List<PopularStation>();
    }
}

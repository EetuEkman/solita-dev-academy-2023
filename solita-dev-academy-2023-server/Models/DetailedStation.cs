namespace solita_dev_academy_2023_server.Models
{
    public class DetailedStation : Station
    {
        public int DepartureCount { get; set; }
        public int ReturnCount { get; set; }
        public double DepartureDistanceAverage { get; set; }
        public double ReturnDistanceAverage { get; set; }
        public List<Station> TopDestinationStations { get; set; }
        public List<Station> TopOriginStations { get; set; }
    }
}

/*  
            Functionality

            Recommended

            Station name
            Station address
            Total number of journeys starting from the station
            Total number of journeys ending at the station

            Additional

            Station location on the map
            The average distance of a journey starting from the station
            The average distance of a journey ending at the station
            Top 5 most popular return stations for journeys starting from the station
            Top 5 most popular departure stations for journeys ending at the station
            Ability to filter all the calculations per month
*/

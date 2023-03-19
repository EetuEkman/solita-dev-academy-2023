namespace dev_academy_server_library.Models
{
    public class JourneyQueryParameters
    {
        public DateTime? DepartureDateFrom { get; set; }
        public DateTime? DepartureDateTo { get; set; }
        public DateTime? ReturnDateFrom { get; set; }
        public DateTime? ReturnDateTo { get; set; }
        public int? CoveredDistanceFrom { get; set; }
        public int? CoveredDistanceTo { get; set; }
        public double? DurationFrom { get; set; }
        public double? DurationTo { get; set; }
        public string? DepartureStationNameFi { get; set; }
        public string? DepartureStationNameSe { get; set; }
        public string? DepartureStationNameEn { get; set; }
        public string? ReturnStationNameFi { get; set; }
        public string? ReturnStationNameSe { get; set; }
        public string? ReturnStationNameEn { get; set; }
        public string? OrderBy { get; set; }
        public string? Order { get; set; }
        public int? Page { get; set; }
    }
}

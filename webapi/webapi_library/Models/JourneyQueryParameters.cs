using System.ComponentModel.DataAnnotations;

namespace webapi_library.Models
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
        [MaxLength(64)]
        public string? DepartureStationNameFi { get; set; }
        [MaxLength(64)]
        public string? DepartureStationNameSe { get; set; }
        [MaxLength(64)]
        public string? DepartureStationNameEn { get; set; }
        [MaxLength(64)]
        public string? ReturnStationNameFi { get; set; }
        [MaxLength(64)]
        public string? ReturnStationNameSe { get; set; }
        [MaxLength(64)]
        public string? ReturnStationNameEn { get; set; }
        public string? OrderBy { get; set; }
        public string? Order { get; set; }
        public int? Page { get; set; }
    }
}

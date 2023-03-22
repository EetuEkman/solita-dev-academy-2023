using System.ComponentModel.DataAnnotations;

namespace webapi_library.Models
{
    public class StationQueryParameters
    {
        [MaxLength(64)]
        public string? NameFi { get; set; }
        [MaxLength(64)]
        public string? NameSe { get; set; }
        [MaxLength(64)]
        public string? NameEn { get; set; }
        [MaxLength(64)]
        public string? AddressFi { get; set; }
        [MaxLength(64)]
        public string? AddressSe { get; set; }
        [MaxLength(64)]
        public string? Operator { get; set; }
        public int? CapacityFrom { get; set; }
        public int? CapacityTo { get; set; }
        public int? Page { get; set; }
    }
}

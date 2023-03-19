namespace dev_academy_server_library.Models
{
    public class StationQueryParameters
    {
        public string? NameFi { get; set; }
        public string? NameSe { get; set; }
        public string? NameEn { get; set; }
        public string? AddressFi { get; set; }
        public string? AddressSe { get; set; }
        public string? Operator { get; set; }
        public int? CapacityFrom { get; set; }
        public int? CapacityTo { get; set; }
        public int? Page { get; set; }
    }
}

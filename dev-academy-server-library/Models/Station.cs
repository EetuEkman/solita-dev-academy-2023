namespace solita_dev_academy_2023_server.Models
{
    public class Station
    {
        public string Id { get; set; }
        public string Name_fi { get; set; }
        public string Name_se { get; set; }
        public string Name_en { get; set; }
        public string Address_fi { get; set; }
        public string Address_se { get; set; }
        public string Operator { get; set; }
        public int? Capacity { get; set; }
        public decimal? X { get; set; }
        public decimal? Y { get; set; }
    }
}

namespace solita_dev_academy_2023_server.Models
{
    public record Station
    {
        public string Id { get; init; }
        public string Name_fi { get; init; }
        public string Name_se { get; init; }
        public string Name_en { get; init; }
        public string Address_fi { get; init; }
        public string Address_se { get; init; }
        public string Operator { get; init; }
        public int Capacity { get; init; }
        public double X { get; init; }
        public double Y { get; init; }
    }
}

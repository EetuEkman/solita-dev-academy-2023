using System.ComponentModel.DataAnnotations.Schema;

namespace solita_dev_academy_2023_server.Models
{
    public record Station
    {
        [Column("Id")] 
        public string? Id { get; init; }
        [Column("Name_fi")]
        public string? NameFi { get; init; }
        [Column("Name_se")]
        public string? NameSe { get; init; }
        [Column("Name_en")]
        public string? NameEn { get; init; }
        [Column("Address_fi")]
        public string? AddressFi { get; init; }
        [Column("Address_se")]
        public string? AddressSe { get; init; }
        [Column("Operator")]
        public string? Operator { get; init; }
        [Column("Capacity")]
        public int? Capacity { get; init; }
        [Column("X")]
        public decimal? X { get; init; }
        [Column("Y")]
        public decimal? Y { get; init; }
    }
}

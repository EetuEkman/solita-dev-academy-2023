﻿namespace solita_dev_academy_2023_server.Models
{
    public class StationPage
    {
        public List<Station> Stations { get; set; }
        public int Count { get; set; }
        public string Next { get; set; }
        public int CurrentPage { get; set; }
        public string Previous { get; set; }
    }
}

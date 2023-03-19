using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Npgsql;
using System.Data;
using Dapper;
using dev_academy_server_library.Models;

namespace dev_academy_server_library
{
    public class DataAccess
    {
        private readonly string? connectionString;
        private readonly string? database;

        public DataAccess(IConfiguration configuration)
        {
            connectionString = configuration.GetConnectionString("citybikes");

            database = configuration["Database"];
        }

        public async Task<JourneysPage> GetJourneysPage(Query query)
        {
            var journeysPage = new JourneysPage();

            using IDbConnection connection = database switch
            {
                "SQL Server" => new SqlConnection(connectionString),
                "PostgreSQL" => new NpgsqlConnection(connectionString),
                _ => new SqlConnection(connectionString)
            };

            var reader = await connection.QueryMultipleAsync(query.QueryString, query.Parameters, commandTimeout: 120);

            var readJourneys = reader.ReadAsync<Journey>();

            var readCount = reader.ReadSingleAsync<int>();

            var journeys = (await readJourneys).ToList();

            var count = await readCount;

            journeysPage.Journeys = journeys;

            journeysPage.Count = count;

            return journeysPage;
        }

        public async Task<StationsPage> GetStationsPage(Query query)
        {
            var stationsPage = new StationsPage();

            using IDbConnection connection = database switch
            {
                "SQL Server" => new SqlConnection(connectionString),
                "Postgresql" => new NpgsqlConnection(connectionString),
                _ => new SqlConnection(connectionString)
            };

            var reader = await connection.QueryMultipleAsync(query.QueryString, query.Parameters, commandTimeout: 120);

            var readStations = reader.ReadAsync<Station>();

            var readCount = reader.ReadAsync<int>();

            var stations = (await readStations).ToList();

            var rowCount = (await readCount).Single();

            stationsPage.Stations = stations;

            stationsPage.Count = rowCount;

            return stationsPage;
        }

        public async Task<DetailedStation?> GetDetailedStation(Query query)
        {
            using IDbConnection connection = database switch
            {
                "SQL Server" => new SqlConnection(connectionString),
                "PostgreSQL" => new NpgsqlConnection(connectionString),
                _ => new SqlConnection(connectionString)
            };

            var reader = await connection.QueryMultipleAsync(query.QueryString, query.Parameters, commandTimeout: 120);

            var station = await reader.ReadSingleOrDefaultAsync<DetailedStation>();

            if (station is null)
            {
                return null;
            }

            // Read async.

            var readDepartureCount = reader.ReadSingleAsync<int>();

            var readReturnCount = reader.ReadSingleAsync<int>();

            var readDepartureDistanceAverage = reader.ReadSingleAsync<double>();

            var readReturnDistanceAverage = reader.ReadSingleAsync<double>();

            var readTopOriginStations = reader.ReadAsync<Station>();

            var readTopOriginStationsIdCount = reader.ReadAsync<StationIdCount>();

            var readTopDestinationStations = reader.ReadAsync<Station>();

            var readTopDestinationStationsIdCount = reader.ReadAsync<StationIdCount>();

            // Await and assign.

            var departureCount = await readDepartureCount;

            var returnCount = await readReturnCount;

            var departureDistanceAverage = await readDepartureDistanceAverage;

            var returnDistanceAverage = await readReturnDistanceAverage;

            var topOriginStations = await readTopOriginStations;

            var topOriginStationsIdCount = await readTopOriginStationsIdCount;

            // 
            
            station.DepartureCount = departureCount;            

            station.ReturnCount = returnCount;

            station.DepartureDistanceAverage = departureDistanceAverage;

            station.ReturnDistanceAverage = returnDistanceAverage;

            // Top origin stations with count.

            var topOriginStationsWithCount = new List<PopularStation>();

            foreach (var idCount in topOriginStationsIdCount)
            {
                var topOriginStation = topOriginStations.FirstOrDefault(station => station.Id == idCount.Id);

                if (topOriginStation is not null)
                {
                    var popularStation = new PopularStation()
                    {
                        Id = topOriginStation.Id,
                        Address_fi = topOriginStation.Address_fi,
                        Address_se = topOriginStation.Address_se,
                        Capacity = topOriginStation.Capacity,
                        Name_en = topOriginStation.Name_en,
                        Name_fi = topOriginStation.Name_fi,
                        Name_se = topOriginStation.Name_se,
                        X = topOriginStation.X,
                        Y = topOriginStation.Y,
                        Operator = topOriginStation.Operator,
                        Count = idCount.Count,
                    };

                    topOriginStationsWithCount.Add(popularStation);
                }
            }

            station.TopOriginStations = topOriginStationsWithCount;

            // Top destination stations with count.

            var topDestinationStations = await readTopDestinationStations;

            var topDestinationStationsIdCount = await readTopDestinationStationsIdCount;

            var topDestinationStationsWithCount = new List<PopularStation>();

            foreach (var idCount in topDestinationStationsIdCount)
            {
                var topDestinationStation = topDestinationStations.FirstOrDefault(station => station.Id == idCount.Id);

                if (topDestinationStation is not null)
                {
                    var popularStation = new PopularStation()
                    {
                        Id = topDestinationStation.Id,
                        Address_fi = topDestinationStation.Address_fi,
                        Address_se = topDestinationStation.Address_se,
                        Capacity = topDestinationStation.Capacity,
                        Name_en = topDestinationStation.Name_en,
                        Name_fi = topDestinationStation.Name_fi,
                        Name_se = topDestinationStation.Name_se,
                        X = topDestinationStation.X,
                        Y = topDestinationStation.Y,
                        Operator = topDestinationStation.Operator,
                        Count = idCount.Count,
                    };

                    topDestinationStationsWithCount.Add(popularStation);
                }
            }

            station.TopDestinationStations = topDestinationStationsWithCount;

            return station;
        }
    }
}

using Microsoft.Extensions.Configuration;
using solita_dev_academy_2023_server.Models;
using Microsoft.Data.SqlClient;
using Npgsql;
using System.Data;
using Dapper;

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

        public async Task<StationsPage> GetStationsPage(string query, DynamicParameters parameters)
        {
            var stationsPage = new StationsPage();

            using IDbConnection connection = database switch
            {
                "SQL Server" => new SqlConnection(connectionString),
                "Postgresql" => new NpgsqlConnection(connectionString),
                _ => new SqlConnection(connectionString)
            };

            var reader = await connection.QueryMultipleAsync(query, parameters);

            var readStations = reader.ReadAsync<Station>();

            var readCount = reader.ReadAsync<int>();

            var stations = (await readStations).ToList();

            var rowCount = (await readCount).Single();

            stationsPage.Stations = stations;

            stationsPage.Count = rowCount;

            return stationsPage;
        }

        public async Task<JourneysPage> GetJourneysPage(string query, DynamicParameters parameters) 
        { 
            var journeysPage = new JourneysPage();

            using IDbConnection connection = database switch
            {
                "SQL Server" => new SqlConnection(connectionString),
                "PostgreSQL" => new NpgsqlConnection(connectionString),
                _ => new SqlConnection(connectionString)
            };

            var reader = await connection.QueryMultipleAsync(query, parameters);

            var readJourneys = reader.ReadAsync<Journey>();

            var readCount = reader.ReadSingleAsync<int>();

            var journeys = (await readJourneys).ToList();

            var count = await readCount;

            journeysPage.Journeys = journeys;

            journeysPage.Count = count;

            return journeysPage;
        }
    }
}

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

        public async Task<List<Station>> GetStations(DynamicParameters parameters)
        {
            var stations = new List<Station>();

            using IDbConnection connection = database switch
            {
                "SQL Server" => new SqlConnection(connectionString),
                "Postgresql" => new NpgsqlConnection(connectionString),
                _ => new SqlConnection(connectionString)
            };

            var query = $@"
                
            ";


            return stations;
        }
    }
}

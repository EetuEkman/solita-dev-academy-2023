using Dapper;
using dev_academy_server_library.Models;
using System.Data;

namespace dev_academy_server_library
{
    public class QueryBuilder
    {
        public Query GetStationsQueryString(StationQueryParameters queryParameters)
        {
            var parameters = new DynamicParameters();

            var queryString = "SELECT *" +
                " FROM stations" +
                " WHERE 1=1";

            var countQuery = " SELECT COUNT(1) " +
                " FROM stations" +
                " WHERE 1=1";

            if (String.IsNullOrEmpty(queryParameters.NameFi) == false)
            {
                queryString += " AND name_fi LIKE @Name_fi";

                countQuery += " AND name_fi LIKE @Name_fi";

                parameters.Add("Name_fi", "%" + queryParameters.NameFi + "%", DbType.String, ParameterDirection.Input);
            }

            if (String.IsNullOrEmpty(queryParameters.NameSe) == false)
            {
                queryString += " AND name_se LIKE @Name_se";

                countQuery += " AND name_se LIKE @Name_se";

                parameters.Add("Name_se", "%" + queryParameters.NameSe + "%", DbType.String, ParameterDirection.Input);
            }

            if (String.IsNullOrEmpty(queryParameters.NameEn) == false)
            {
                queryString += " AND name_en LIKE @Name_en";

                countQuery += " AND name_en LIKE @Name_en";

                parameters.Add("Name_en", "%" + queryParameters.NameEn + "%", DbType.String, ParameterDirection.Input);
            }

            if (String.IsNullOrEmpty(queryParameters.AddressFi) == false)
            {
                queryString += " AND address_fi LIKE @Address_fi";

                countQuery += " AND address_fi LIKE @Address_fi";

                parameters.Add("Address_fi", "%" + queryParameters.AddressFi + "%", DbType.String, ParameterDirection.Input);
            }

            if (String.IsNullOrEmpty(queryParameters.AddressSe) == false)
            {
                queryString += " AND address_se LIKE @Address_se";

                countQuery += " AND address_se LIKE @Address_se";

                parameters.Add("Address_se", "%" + queryParameters.AddressSe + "%", DbType.String, ParameterDirection.Input);
            }

            if (String.IsNullOrEmpty(queryParameters.Operator) == false)
            {
                queryString += " AND operator LIKE @Operator";

                countQuery += " AND operator LIKE @Operator";

                parameters.Add("Operator", "%" + queryParameters.Operator + "%", DbType.String, ParameterDirection.Input);
            }

            if (queryParameters.CapacityFrom is not null)
            {
                queryString += " AND capacity >= @CapacityFrom";

                countQuery += " AND capacity >= @CapacityFrom";

                parameters.Add("CapacityFrom", queryParameters.CapacityFrom, DbType.Int64, ParameterDirection.Input);
            }

            if (queryParameters.CapacityTo is not null)
            {
                queryString += " AND capacity <= @CapacityTo";

                countQuery += " AND capacity <= @CapacityTo";

                parameters.Add("CapacityTo", queryParameters.CapacityTo, DbType.Int64, ParameterDirection.Input);
            }

            // ORDER BY, needed for OFFSET.

            queryString += " ORDER BY id ASC";

            // OFFSET.

            queryString += " OFFSET @Offset ROWS";

            var offset = 0;

            // Use the keyword "FIRST" instead of "NEXT" for the first page.

            if (queryParameters.Page is not null && queryParameters.Page > 1)
            {
                offset = 20 * ((int)queryParameters.Page - 1);

                queryString += " FETCH NEXT 20 ROWS ONLY;";
            }
            else
            {
                queryString += " FETCH FIRST 20 ROWS ONLY;";
            }

            parameters.Add("Offset", offset, DbType.Int32, ParameterDirection.Input);

            // Include the count in the same query.

            queryString += countQuery;

            var query = new Query()
            {
                QueryString = queryString,
                Parameters = parameters,
            };

            return query;
        }
    
        public Query GetStationQueryString(string id)
        {
            var parameters = new DynamicParameters();

            parameters.Add("Id", id, DbType.String, ParameterDirection.Input);

            var queryString = $@"SELECT TOP 1 *
                FROM stations
                WHERE id = @Id;

                SELECT COUNT(1)
                FROM journeys
                WHERE departure_station_id = @Id;

                SELECT COUNT(1)
                FROM journeys
                WHERE return_station_id = @Id;

                SELECT AVG(Covered_distance)
                FROM journeys 
                WHERE departure_station_id = @Id;

                SELECT AVG(Covered_distance)
                FROM journeys 
                WHERE return_station_id = @Id;

                SELECT * 
                FROM stations 
                WHERE id IN 
                ( 
                    SELECT id 
                    FROM 
                    ( 
                        SELECT TOP 5 departure_station_id id, 
                        COUNT(departure_station_id) c 
                        FROM journeys 
                        WHERE return_station_id = @Id 
                        GROUP BY departure_station_id 
                        ORDER BY c DESC 
                    ) ids
                );

                SELECT *
                FROM 
                ( 
                    SELECT TOP 5 departure_station_id id, 
                    COUNT(departure_station_id) c 
                    FROM journeys 
                    WHERE return_station_id = @Id
                    GROUP BY departure_station_id 
                    ORDER BY c DESC 
                ) id_count;

                SELECT * 
                FROM Stations 
                WHERE id IN 
                ( 
                    SELECT id 
                    FROM 
                    ( 
                        SELECT TOP 5 return_station_id id, 
                        COUNT(return_station_id) c 
                        FROM journeys 
                        WHERE departure_station_id = @Id 
                        GROUP BY return_station_id 
                        ORDER BY c DESC 
                    ) ids
                );
    
                SELECT *
                FROM 
                ( 
                    SELECT TOP 5 return_station_id id, 
                    COUNT(return_station_id) c 
                    FROM journeys 
                    WHERE departure_station_id = @Id
                    GROUP BY return_station_id 
                    ORDER BY c DESC 
                ) id_count;
                ";

            var query = new Query()
            {
                QueryString = queryString,
                Parameters = parameters
            };

            return query;
        }
    }
}

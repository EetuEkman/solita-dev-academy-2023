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

                parameters.Add("Name_fi", "%" + queryParameters.NameFi + "%");
            }

            if (String.IsNullOrEmpty(queryParameters.NameSe) == false)
            {
                queryString += " AND name_se LIKE @name_se";

                countQuery += " AND name_se LIKE @name_se";

                parameters.Add("name_se", "%" + queryParameters.NameSe + "%");
            }

            if (String.IsNullOrEmpty(queryParameters.NameEn) == false)
            {
                queryString += " AND name_en LIKE @Name_en";

                countQuery += " AND name_en LIKE @Name_en";

                parameters.Add("Name_en", "%" + queryParameters.NameEn + "%");
            }

            if (String.IsNullOrEmpty(queryParameters.AddressFi) == false)
            {
                queryString += " AND address_fi LIKE @Address_fi";

                countQuery += " AND address_fi LIKE @Address_fi";

                parameters.Add("Address_fi", "%" + queryParameters.AddressFi + "%");
            }

            if (String.IsNullOrEmpty(queryParameters.AddressSe) == false)
            {
                queryString += " AND address_se LIKE @Address_se";

                countQuery += " AND address_se LIKE @Address_se";

                parameters.Add("Address_se", "%" + queryParameters.AddressSe + "%");
            }

            if (String.IsNullOrEmpty(queryParameters.Operator) == false)
            {
                queryString += " AND operator LIKE @Operator";

                countQuery += " AND operator LIKE @Operator";

                parameters.Add("Operator", "%" + queryParameters.Operator + "%");
            }

            if (queryParameters.CapacityFrom is not null)
            {
                queryString += " AND capacity >= @CapacityFrom";

                countQuery += " AND capacity >= @CapacityFrom";

                parameters.Add("CapacityFrom", queryParameters.CapacityFrom);
            }

            if (queryParameters.CapacityTo is not null)
            {
                queryString += " AND capacity <= @CapacityTo";

                countQuery += " AND capacity <= @CapacityTo";

                parameters.Add("CapacityTo", queryParameters.CapacityTo);
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

            parameters.Add("Offset", offset);

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

            parameters.Add("Id", id);

            var queryString = $@"SELECT *
                FROM stations 
                WHERE id = @Id;

                SELECT COUNT(1)
                FROM journeys
                WHERE departure_station_id = @Id;

                SELECT COUNT(1)
                FROM journeys
                WHERE return_station_id = @Id;

                SELECT AVG(covered_distance)
                FROM journeys 
                WHERE departure_station_id = @Id;

                SELECT AVG(covered_distance)
                FROM journeys 
                WHERE return_station_id = @Id;

                SELECT * 
                FROM stations 
                WHERE id IN 
                ( 
                    SELECT id 
                    FROM 
                    ( 
                        SELECT departure_station_id id, 
                        COUNT(departure_station_id) c 
                        FROM journeys 
                        WHERE return_station_id = @Id 
                        GROUP BY departure_station_id 
                        ORDER BY c DESC
                        OFFSET 0 ROWS 
                        FETCH FIRST 5 ROWS ONLY
                    ) ids
                );

                SELECT *
                FROM 
                ( 
                    SELECT departure_station_id id, 
                    COUNT(departure_station_id) ""count"" 
                    FROM journeys 
                    WHERE return_station_id = @Id
                    GROUP BY departure_station_id 
                    ORDER BY ""count"" DESC 
                    OFFSET 0 ROWS 
                    FETCH FIRST 5 ROWS ONLY
                ) id_count;

                SELECT * 
                FROM Stations 
                WHERE id IN 
                ( 
                    SELECT id 
                    FROM 
                    ( 
                        SELECT return_station_id id, 
                        COUNT(return_station_id) c 
                        FROM journeys 
                        WHERE departure_station_id = @Id 
                        GROUP BY return_station_id 
                        ORDER BY c DESC
                        OFFSET 0 ROWS 
                        FETCH FIRST 5 ROWS ONLY
                    ) ids
                );
    
                SELECT *
                FROM 
                ( 
                    SELECT return_station_id id, 
                    COUNT(return_station_id) ""count"" 
                    FROM journeys 
                    WHERE departure_station_id = @Id
                    GROUP BY return_station_id 
                    ORDER BY ""count"" DESC 
                    OFFSET 0 ROWS 
                    FETCH FIRST 5 ROWS ONLY
                ) id_count
                ";

            var query = new Query()
            {
                QueryString = queryString,
                Parameters = parameters
            };

            return query;
        }

        public Query GetJourneysQueryString(JourneyQueryParameters queryParameters)
        {
            var parameters = new DynamicParameters();

            var queryString = @$"SELECT j.departure, j.""return"", j.covered_distance, j.duration,
                 ds.name_fi departure_station_name_fi, ds.name_se departure_station_name_se, ds.name_en departure_station_name_en, ds.address_fi departure_station_address_fi, ds.address_se departure_station_address_se,
                 rs.name_fi return_station_name_fi, rs.name_se return_station_name_se, rs.name_en return_station_name_en, rs.address_fi return_station_address_fi, rs.address_se return_station_address_se
                 FROM journeys j
                 INNER JOIN stations ds ON j.departure_station_id = ds.id
                 INNER JOIN stations rs ON j.return_station_id = rs.id
                 WHERE 1=1";

            // Result count query.

            var countQuery = @$" SELECT COUNT(1)
                 FROM journeys j
                 INNER JOIN stations ds ON j.departure_station_id = ds.id
                 INNER JOIN stations rs ON j.return_station_id = rs.id
                 WHERE 1=1";

            // Departure station names.

            if (String.IsNullOrEmpty(queryParameters.DepartureStationNameFi) == false)
            {
                parameters.Add("DepartureStationNameFi", "%" + queryParameters.DepartureStationNameFi + "%");

                queryString += " AND ds.name_fi LIKE @DepartureStationNameFi";

                countQuery += " AND ds.name_fi LIKE @DepartureStationNameFi";
            }

            if (String.IsNullOrEmpty(queryParameters.DepartureStationNameSe) == false)
            {
                parameters.Add("DepartureStationNameSe", "%" + queryParameters.DepartureStationNameSe + "%");

                queryString += " AND ds.name_se LIKE @DepartureStationNameSe";

                countQuery += " AND ds.name_se LIKE @DepartureStationNameSe";
            }

            if (String.IsNullOrEmpty(queryParameters.DepartureStationNameEn) == false)
            {
                parameters.Add("DepartureStationNameEn", "%" + queryParameters.DepartureStationNameEn + "%");

                queryString += " AND ds.name_en LIKE @DepartureStationNameEn";

                countQuery += " AND ds.name_en LIKE @DepartureStationNameEn";
            }

            // Return station names.

            if (String.IsNullOrEmpty(queryParameters.ReturnStationNameFi) == false)
            {
                parameters.Add("ReturnStationNameFi", "%" + queryParameters.ReturnStationNameFi + "%");

                queryString += " AND rs.name_fi LIKE @ReturnStationNameFi";

                countQuery += " AND rs.name_fi LIKE @ReturnStationNameFi";
            }

            if (String.IsNullOrEmpty(queryParameters.ReturnStationNameSe) == false)
            {
                parameters.Add("ReturnStationNameSe", "%" + queryParameters.ReturnStationNameSe + "%");

                queryString += " AND rs.name_se LIKE @ReturnStationNameSe";

                countQuery += " AND rs.name_se LIKE @ReturnStationNameSe";
            }

            if (String.IsNullOrEmpty(queryParameters.ReturnStationNameEn) == false)
            {
                parameters.Add("ReturnStationNameEn", "%" + queryParameters.ReturnStationNameEn + "%");

                queryString += " AND rs.name_en LIKE @ReturnStationNameEn";

                countQuery += " AND rs.name_en LIKE @ReturnStationNameEn";
            }

            // Departure date.

            if (queryParameters.DepartureDateFrom is not null)
            {
                // If departure date from is later than the return date to, swap them.

                if (queryParameters.DepartureDateTo is not null && queryParameters.DepartureDateTo < queryParameters.DepartureDateFrom)
                {
                    (queryParameters.DepartureDateTo, queryParameters.DepartureDateFrom) = (queryParameters.DepartureDateFrom, queryParameters.DepartureDateTo);
                }

                queryString += " AND j.departure >= @DepartureDateFrom";

                countQuery += " AND j.departure >= @DepartureDateFrom";

                var dateTime = (DateTime)queryParameters.DepartureDateFrom;

                var date = dateTime.ToString("yyyy-MM-dd");

                parameters.Add("DepartureDateFrom", date, DbType.Date);
            }

            if (queryParameters.DepartureDateTo is not null)
            {
                queryString += " AND j.departure <= @DepartureDateTo";

                countQuery += " AND j.departure <= @DepartureDateTo";

                var dateTime = (DateTime)queryParameters.DepartureDateTo;

                var date = dateTime.ToString("yyyy-MM-dd");

                parameters.Add("DepartureDateTo", date);
            }

            // Return date.

            if (queryParameters.ReturnDateFrom is not null)
            {
                // If return date from is later than the return date to, swap them.

                if (queryParameters.ReturnDateTo is not null && queryParameters.ReturnDateTo < queryParameters.ReturnDateFrom)
                {
                    (queryParameters.ReturnDateTo, queryParameters.ReturnDateFrom) = (queryParameters.ReturnDateFrom, queryParameters.ReturnDateTo);
                }

                queryString += " AND j.\"return\" >= @ReturnDateFrom";

                countQuery += " AND j.\"return\" >= @ReturnDateFrom";

                var dateTime = (DateTime)queryParameters.ReturnDateFrom;

                var date = dateTime.ToString("yyyy-MM-dd");

                parameters.Add("ReturnDateFrom", date);
            }

            if (queryParameters.ReturnDateTo is not null)
            {
                queryString += " AND j.\"return\" <= @ReturnDateTo";

                countQuery += " AND j.\"return\" <= @ReturnDateTo";

                var dateTime = (DateTime)queryParameters.ReturnDateTo;

                var date = dateTime.ToString("yyyy-MM-dd");

                parameters.Add("ReturnDateTo", date);
            }

            // Duration.

            if (queryParameters.DurationFrom is not null)
            {
                // If duration from is larger than the duration to, swap them.

                if (queryParameters.DurationTo is not null && queryParameters.DurationTo < queryParameters.DurationFrom)
                {
                    (queryParameters.DurationTo, queryParameters.DurationFrom) = (queryParameters.DurationFrom, queryParameters.DurationTo);
                }

                queryString += " AND j.duration >= @DurationFrom";

                countQuery += " AND j.duration >= @DurationFrom";

                parameters.Add("DurationFrom", queryParameters.DurationFrom);
            }

            if (queryParameters.DurationTo is not null)
            {
                queryString += " AND j.duration <= @DurationTo";

                countQuery += " AND j.duration <= @DurationTo";

                parameters.Add("DurationTo", queryParameters.DurationTo);
            }

            // Covered distance.

            if (queryParameters.CoveredDistanceFrom is not null)
            {
                // If covered distance from is larger than the covered distance to, swap them.

                if (queryParameters.CoveredDistanceTo is not null && queryParameters.CoveredDistanceTo < queryParameters.CoveredDistanceFrom)
                {
                    (queryParameters.CoveredDistanceTo, queryParameters.CoveredDistanceFrom) = (queryParameters.CoveredDistanceFrom, queryParameters.CoveredDistanceTo);
                }

                queryString += " AND j.covered_distance >= @CoveredDistanceFrom";

                countQuery += " AND j.covered_distance >= @CoveredDistanceFrom";

                parameters.Add("CoveredDistanceFrom", queryParameters.CoveredDistanceFrom);
            }

            if (queryParameters.CoveredDistanceTo is not null)
            {
                queryString += " AND j.covered_distance <= @CoveredDistanceTo";

                countQuery += " AND j.covered_distance <= @CoveredDistanceTo";

                parameters.Add("CoveredDistanceTo", queryParameters.CoveredDistanceTo);
            }

            // Ordering.

            var orderBy = " ORDER BY j.departure";

            if (queryParameters.OrderBy != null)
            {
                switch (queryParameters.OrderBy)
                {
                    case "departure":
                        break;
                    case "return":
                        orderBy = " ORDER BY j.\"return\"";
                        break;
                    case "duration":
                        orderBy = " ORDER BY j.duration";
                        break;
                    case "distance":
                        orderBy = " ORDER BY j.covered_distance";
                        break;
                    case "departurestationnamefi":
                        orderBy = " ORDER BY departure_station_name_fi";
                        break;
                    case "departurestationnamese":
                        orderBy = " ORDER BY departure_station_name_se";
                        break;
                    case "departurestationnameen":
                        orderBy = " ORDER BY departure_station_name_en";
                        break;
                    case "returnstationnamefi":
                        orderBy = " ORDER BY return_station_name_fi";
                        break;
                    case "returnstationnamese":
                        orderBy = " ORDER BY return_station_name_se";
                        break;
                    case "returnstationnameen":
                        orderBy = " ORDER BY return_station_name_en";
                        break;
                    default:
                        break;
                }
            }

            queryString += orderBy;

            var order = " DESC";

            if (queryParameters.Order != null)
            {
                var lowerOrder = queryParameters.Order.ToLower();

                switch (lowerOrder)
                {
                    case "ascending":
                    case "asc":
                        order = " ASC";
                        break;
                    case "descending":
                    case "desc":
                        order = " DESC";
                        break;
                    default:
                        break;
                }
            }

            queryString += order;

            // Limit the number of rows returned by the query.

            queryString += " OFFSET @Offset ROWS";

            var offset = 0;

            // Use the keyword "FIRST" instead of "NEXT" for the first page.

            if (queryParameters.Page is not null && queryParameters.Page > 1)
            {
                offset = (((int)queryParameters.Page - 1) * 20);

                queryString += " FETCH NEXT 20 ROWS ONLY;";
            }
            else
            {
                queryString += " FETCH FIRST 20 ROWS ONLY;";
            }

            // Combine the two queries.

            queryString += countQuery;

            parameters.Add("Offset", offset);

            var query = new Query()
            {
                QueryString = queryString,
                Parameters = parameters
            };

            return query;
        }
    }
}

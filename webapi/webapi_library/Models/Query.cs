using Dapper;

namespace webapi_library.Models
{
    public class Query
    {
        public string QueryString { get; set; }
        public DynamicParameters Parameters { get; set; }
    }
}

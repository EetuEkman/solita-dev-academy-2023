using Dapper;

namespace dev_academy_server_library.Models
{
    public class Query
    {
        public string QueryString { get; set; }
        public DynamicParameters Parameters { get; set; }
    }
}

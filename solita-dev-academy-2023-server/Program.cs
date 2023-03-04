namespace solita_dev_academy_2023_server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            // API is public, enable Cross Origin Resource Sharing.

            builder.Services.AddCors(options =>
            {
                // Policy to allow all origins.

                /*

                options.AddPolicy("AnyOrigin", policy =>
                {
                    policy.AllowAnyOrigin();
                });

                */

                // Allow all origins by default.

                options.AddDefaultPolicy(builder =>
                {
                    builder.AllowAnyOrigin();
                });

                // Add default policy to allow localhost origins

                /*

                options.AddDefaultPolicy(builder =>
                {
                    builder.SetIsOriginAllowed(origin => new Uri(origin).Host == "localhost");
                });

                */
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthorization();

            app.UseCors();

            app.MapControllers();

            app.Run();
        }
    }
}
using Microsoft.EntityFrameworkCore;
using TourBookingAPI.Data;
using TourBookingAPI.Services;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.WriteIndented = true;
    });
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy.WithOrigins("http://localhost:3002", "http://localhost:3001", "http://localhost:3000", "http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Tour Planner Services
builder.Services.AddHttpClient<IGoogleMapsService, GoogleMapsService>();
builder.Services.AddScoped<IGoogleMapsService, GoogleMapsService>();
builder.Services.AddScoped<ITourPlannerService, TourPlannerService>();

// Public Booking Services
builder.Services.AddScoped<IPublicBookingService, PublicBookingService>();
builder.Services.AddScoped<IPhotoUploadService, PhotoUploadService>();


// Add CORS for Azure deployment
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAzureFrontend", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Auto-migrate database on startup (for Azure deployment)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    try
    {
        // Ensure database is created and migrations are applied
        context.Database.Migrate();
        Console.WriteLine("✅ Database migrations applied successfully");

        // Seed data if needed
        // await SeedData.SeedAsync(context);
    }
    catch (Exception ex)
    {
        Console.WriteLine($"❌ Database migration failed: {ex.Message}");
        // Don't crash the app, just log the error
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Only use HTTPS redirection in production
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
}

app.UseCors("AllowLocalhost");

app.UseAuthorization();

// Enable CORS
app.UseCors("AllowAzureFrontend");

app.MapControllers();

app.Run();

using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TourBookingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddPublicBookingTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "BusAmenities",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Icon = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusAmenities", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BusPhotos",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusId = table.Column<int>(type: "int", nullable: false),
                    FileName = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    FilePath = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Caption = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsPrimary = table.Column<bool>(type: "bit", nullable: false),
                    DisplayOrder = table.Column<int>(type: "int", nullable: false),
                    UploadedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusPhotos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusPhotos_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomerAccounts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    Address = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    State = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    PostalCode = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PasswordSalt = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    IsVerified = table.Column<bool>(type: "bit", nullable: false),
                    VerificationToken = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    VerificationTokenExpiry = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastLoginAt = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerAccounts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PlannedTrips",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartingPoint = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    StartLatitude = table.Column<double>(type: "float", nullable: false),
                    StartLongitude = table.Column<double>(type: "float", nullable: false),
                    NumberOfDays = table.Column<int>(type: "int", nullable: false),
                    MaxDrivingHoursPerDay = table.Column<int>(type: "int", nullable: false),
                    ReturnDeadline = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalDistanceKm = table.Column<int>(type: "int", nullable: false),
                    TotalDrivingMinutes = table.Column<int>(type: "int", nullable: false),
                    EstimatedFuelCost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    WarningsAndNotes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    ExcludedPlaces = table.Column<string>(type: "nvarchar(2000)", maxLength: 2000, nullable: false),
                    IsFeasible = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlannedTrips", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "TouristPlaces",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    City = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    State = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Category = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    DefaultVisitDurationMinutes = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Attractions = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    IsActive = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TouristPlaces", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BusAmenityMappings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusId = table.Column<int>(type: "int", nullable: false),
                    BusAmenityId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusAmenityMappings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusAmenityMappings_BusAmenities_BusAmenityId",
                        column: x => x.BusAmenityId,
                        principalTable: "BusAmenities",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BusAmenityMappings_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PublicBookings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingNumber = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CustomerAccountId = table.Column<int>(type: "int", nullable: true),
                    CustomerName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CustomerEmail = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    CustomerPhone = table.Column<string>(type: "nvarchar(15)", maxLength: 15, nullable: false),
                    BusId = table.Column<int>(type: "int", nullable: false),
                    PickupLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Destination = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DepartureDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PassengerCount = table.Column<int>(type: "int", nullable: false),
                    SpecialRequirements = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    TotalAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    AdvanceAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BalanceAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancelledAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancellationReason = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PublicBookings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PublicBookings_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PublicBookings_CustomerAccounts_CustomerAccountId",
                        column: x => x.CustomerAccountId,
                        principalTable: "CustomerAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "TripDays",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlannedTripId = table.Column<int>(type: "int", nullable: false),
                    DayNumber = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TotalDrivingMinutes = table.Column<int>(type: "int", nullable: false),
                    TotalDistanceKm = table.Column<int>(type: "int", nullable: false),
                    DaySummary = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripDays", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripDays_PlannedTrips_PlannedTripId",
                        column: x => x.PlannedTripId,
                        principalTable: "PlannedTrips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TripPlaces",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlannedTripId = table.Column<int>(type: "int", nullable: false),
                    TouristPlaceId = table.Column<int>(type: "int", nullable: false),
                    CustomVisitDurationMinutes = table.Column<int>(type: "int", nullable: false),
                    IsIncluded = table.Column<bool>(type: "bit", nullable: false),
                    ExclusionReason = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Priority = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripPlaces", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripPlaces_PlannedTrips_PlannedTripId",
                        column: x => x.PlannedTripId,
                        principalTable: "PlannedTrips",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TripPlaces_TouristPlaces_TouristPlaceId",
                        column: x => x.TouristPlaceId,
                        principalTable: "TouristPlaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CustomerPayments",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicBookingId = table.Column<int>(type: "int", nullable: false),
                    PaymentMethod = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    TransactionId = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    PaymentDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PaymentDetails = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerPayments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerPayments_PublicBookings_PublicBookingId",
                        column: x => x.PublicBookingId,
                        principalTable: "PublicBookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "CustomerReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PublicBookingId = table.Column<int>(type: "int", nullable: false),
                    CustomerAccountId = table.Column<int>(type: "int", nullable: false),
                    BusId = table.Column<int>(type: "int", nullable: false),
                    Rating = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    IsApproved = table.Column<bool>(type: "bit", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CustomerReviews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_CustomerAccounts_CustomerAccountId",
                        column: x => x.CustomerAccountId,
                        principalTable: "CustomerAccounts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CustomerReviews_PublicBookings_PublicBookingId",
                        column: x => x.PublicBookingId,
                        principalTable: "PublicBookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TripStops",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripDayId = table.Column<int>(type: "int", nullable: false),
                    SequenceNumber = table.Column<int>(type: "int", nullable: false),
                    StopType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    TouristPlaceId = table.Column<int>(type: "int", nullable: true),
                    PlaceName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    VisitDurationMinutes = table.Column<int>(type: "int", nullable: false),
                    FromLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    ToLocation = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    TravelTimeMinutes = table.Column<int>(type: "int", nullable: false),
                    DistanceKm = table.Column<int>(type: "int", nullable: false),
                    StartTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EndTime = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TripStops", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TripStops_TouristPlaces_TouristPlaceId",
                        column: x => x.TouristPlaceId,
                        principalTable: "TouristPlaces",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_TripStops_TripDays_TripDayId",
                        column: x => x.TripDayId,
                        principalTable: "TripDays",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusAmenityMappings_BusAmenityId",
                table: "BusAmenityMappings",
                column: "BusAmenityId");

            migrationBuilder.CreateIndex(
                name: "IX_BusAmenityMappings_BusId",
                table: "BusAmenityMappings",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_BusPhotos_BusId",
                table: "BusPhotos",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerAccounts_Email",
                table: "CustomerAccounts",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_CustomerPayments_PublicBookingId",
                table: "CustomerPayments",
                column: "PublicBookingId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_BusId",
                table: "CustomerReviews",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_CustomerAccountId",
                table: "CustomerReviews",
                column: "CustomerAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_CustomerReviews_PublicBookingId",
                table: "CustomerReviews",
                column: "PublicBookingId");

            migrationBuilder.CreateIndex(
                name: "IX_PublicBookings_BookingNumber",
                table: "PublicBookings",
                column: "BookingNumber",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PublicBookings_BusId",
                table: "PublicBookings",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_PublicBookings_CustomerAccountId",
                table: "PublicBookings",
                column: "CustomerAccountId");

            migrationBuilder.CreateIndex(
                name: "IX_TripDays_PlannedTripId",
                table: "TripDays",
                column: "PlannedTripId");

            migrationBuilder.CreateIndex(
                name: "IX_TripPlaces_PlannedTripId",
                table: "TripPlaces",
                column: "PlannedTripId");

            migrationBuilder.CreateIndex(
                name: "IX_TripPlaces_TouristPlaceId",
                table: "TripPlaces",
                column: "TouristPlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_TripStops_TouristPlaceId",
                table: "TripStops",
                column: "TouristPlaceId");

            migrationBuilder.CreateIndex(
                name: "IX_TripStops_TripDayId",
                table: "TripStops",
                column: "TripDayId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusAmenityMappings");

            migrationBuilder.DropTable(
                name: "BusPhotos");

            migrationBuilder.DropTable(
                name: "CustomerPayments");

            migrationBuilder.DropTable(
                name: "CustomerReviews");

            migrationBuilder.DropTable(
                name: "TripPlaces");

            migrationBuilder.DropTable(
                name: "TripStops");

            migrationBuilder.DropTable(
                name: "BusAmenities");

            migrationBuilder.DropTable(
                name: "PublicBookings");

            migrationBuilder.DropTable(
                name: "TouristPlaces");

            migrationBuilder.DropTable(
                name: "TripDays");

            migrationBuilder.DropTable(
                name: "CustomerAccounts");

            migrationBuilder.DropTable(
                name: "PlannedTrips");
        }
    }
}

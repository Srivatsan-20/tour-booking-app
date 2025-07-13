using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TourBookingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddBusManagementSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Buses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RegistrationNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    BusType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Make = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Model = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Year = table.Column<int>(type: "int", nullable: false),
                    SeatingCapacity = table.Column<int>(type: "int", nullable: false),
                    SleeperCapacity = table.Column<int>(type: "int", nullable: false),
                    Features = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CurrentOdometer = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    LastMaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextMaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    MaintenanceNotes = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DefaultPerDayRent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    DefaultMountainRent = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AssignedDriver = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DriverPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "BusAllocations",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusId = table.Column<int>(type: "int", nullable: false),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    AllocationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TripStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TripEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    AllocatedPerDayRent = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AllocatedMountainRent = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    AssignedDriver = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DriverPhone = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    StartingOdometer = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    EndingOdometer = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Notes = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    ActualStartDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ActualEndDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancellationReason = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    CancelledDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CancelledBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusAllocations", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusAllocations_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_BusAllocations_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BusMaintenanceRecords",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BusId = table.Column<int>(type: "int", nullable: false),
                    MaintenanceDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MaintenanceType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Cost = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    OdometerReading = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    ServiceProvider = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    TechnicianName = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    InvoiceNumber = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    NextServiceDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    NextServiceKm = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    Notes = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true),
                    PartsReplaced = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusMaintenanceRecords", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusMaintenanceRecords_Buses_BusId",
                        column: x => x.BusId,
                        principalTable: "Buses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BusAllocations_BookingId",
                table: "BusAllocations",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_BusAllocations_BusId",
                table: "BusAllocations",
                column: "BusId");

            migrationBuilder.CreateIndex(
                name: "IX_BusMaintenanceRecords_BusId",
                table: "BusMaintenanceRecords",
                column: "BusId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BusAllocations");

            migrationBuilder.DropTable(
                name: "BusMaintenanceRecords");

            migrationBuilder.DropTable(
                name: "Buses");
        }
    }
}

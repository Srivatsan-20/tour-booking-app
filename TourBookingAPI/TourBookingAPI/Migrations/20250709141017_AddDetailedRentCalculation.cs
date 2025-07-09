using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TourBookingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddDetailedRentCalculation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<decimal>(
                name: "AdvancePaid",
                table: "Bookings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "MountainRent",
                table: "Bookings",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "PerDayRent",
                table: "Bookings",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AdvancePaid",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "MountainRent",
                table: "Bookings");

            migrationBuilder.DropColumn(
                name: "PerDayRent",
                table: "Bookings");
        }
    }
}

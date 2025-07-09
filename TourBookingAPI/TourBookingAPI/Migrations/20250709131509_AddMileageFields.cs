using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TourBookingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddMileageFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Add mileage tracking columns to existing BusExpenses table
            migrationBuilder.AddColumn<decimal>(
                name: "StartingOdometer",
                table: "BusExpenses",
                type: "decimal(18,2)",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "EndingOdometer",
                table: "BusExpenses",
                type: "decimal(18,2)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove mileage tracking columns from BusExpenses table
            migrationBuilder.DropColumn(
                name: "StartingOdometer",
                table: "BusExpenses");

            migrationBuilder.DropColumn(
                name: "EndingOdometer",
                table: "BusExpenses");
        }
    }
}

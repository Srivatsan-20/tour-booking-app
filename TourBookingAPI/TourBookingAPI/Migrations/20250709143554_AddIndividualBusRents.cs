using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TourBookingAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddIndividualBusRents : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "UseIndividualBusRates",
                table: "Bookings",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "BookingBusRents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    BookingId = table.Column<int>(type: "int", nullable: false),
                    BusNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    BusType = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    PerDayRent = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    MountainRent = table.Column<decimal>(type: "decimal(18,2)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BookingBusRents", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BookingBusRents_Bookings_BookingId",
                        column: x => x.BookingId,
                        principalTable: "Bookings",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_BookingBusRents_BookingId",
                table: "BookingBusRents",
                column: "BookingId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "BookingBusRents");

            migrationBuilder.DropColumn(
                name: "UseIndividualBusRates",
                table: "Bookings");
        }
    }
}

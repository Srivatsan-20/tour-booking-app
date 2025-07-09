using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TourBookingAPI.Migrations
{
    /// <inheritdoc />
    public partial class MigrateToBusBasedStructure : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Step 1: Create BusExpenses table
            migrationBuilder.CreateTable(
                name: "BusExpenses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TripExpenseId = table.Column<int>(type: "int", nullable: false),
                    BusNumber = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    DriverBatta = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NumberOfDays = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BusExpenses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BusExpenses_TripExpenses_TripExpenseId",
                        column: x => x.TripExpenseId,
                        principalTable: "TripExpenses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Step 2: Create index for BusExpenses
            migrationBuilder.CreateIndex(
                name: "IX_BusExpenses_TripExpenseId",
                table: "BusExpenses",
                column: "TripExpenseId");

            // Step 3: Migrate existing data - Create one BusExpense per TripExpense
            migrationBuilder.Sql(@"
                INSERT INTO BusExpenses (TripExpenseId, BusNumber, DriverBatta, NumberOfDays)
                SELECT 
                    Id as TripExpenseId,
                    'Bus 1' as BusNumber,
                    DriverBatta,
                    NumberOfDays
                FROM TripExpenses
            ");

            // Step 4: Add BusExpenseId column to FuelEntries
            migrationBuilder.AddColumn<int>(
                name: "BusExpenseId",
                table: "FuelEntries",
                type: "int",
                nullable: true); // Temporarily nullable for migration

            // Step 5: Add BusExpenseId column to OtherExpenses
            migrationBuilder.AddColumn<int>(
                name: "BusExpenseId",
                table: "OtherExpenses",
                type: "int",
                nullable: true); // Temporarily nullable for migration

            // Step 6: Update FuelEntries to point to BusExpenses
            migrationBuilder.Sql(@"
                UPDATE FuelEntries 
                SET BusExpenseId = (
                    SELECT be.Id 
                    FROM BusExpenses be 
                    WHERE be.TripExpenseId = FuelEntries.TripExpenseId
                )
            ");

            // Step 7: Update OtherExpenses to point to BusExpenses
            migrationBuilder.Sql(@"
                UPDATE OtherExpenses 
                SET BusExpenseId = (
                    SELECT be.Id 
                    FROM BusExpenses be 
                    WHERE be.TripExpenseId = OtherExpenses.TripExpenseId
                )
            ");

            // Step 8: Make BusExpenseId non-nullable and add foreign keys
            migrationBuilder.AlterColumn<int>(
                name: "BusExpenseId",
                table: "FuelEntries",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "BusExpenseId",
                table: "OtherExpenses",
                type: "int",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            // Step 9: Add foreign key constraints
            migrationBuilder.CreateIndex(
                name: "IX_FuelEntries_BusExpenseId",
                table: "FuelEntries",
                column: "BusExpenseId");

            migrationBuilder.CreateIndex(
                name: "IX_OtherExpenses_BusExpenseId",
                table: "OtherExpenses",
                column: "BusExpenseId");

            migrationBuilder.AddForeignKey(
                name: "FK_FuelEntries_BusExpenses_BusExpenseId",
                table: "FuelEntries",
                column: "BusExpenseId",
                principalTable: "BusExpenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_OtherExpenses_BusExpenses_BusExpenseId",
                table: "OtherExpenses",
                column: "BusExpenseId",
                principalTable: "BusExpenses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            // Step 10: Remove old foreign key constraints and columns
            migrationBuilder.DropForeignKey(
                name: "FK_FuelEntries_TripExpenses_TripExpenseId",
                table: "FuelEntries");

            migrationBuilder.DropForeignKey(
                name: "FK_OtherExpenses_TripExpenses_TripExpenseId",
                table: "OtherExpenses");

            migrationBuilder.DropIndex(
                name: "IX_FuelEntries_TripExpenseId",
                table: "FuelEntries");

            migrationBuilder.DropIndex(
                name: "IX_OtherExpenses_TripExpenseId",
                table: "OtherExpenses");

            migrationBuilder.DropColumn(
                name: "TripExpenseId",
                table: "FuelEntries");

            migrationBuilder.DropColumn(
                name: "TripExpenseId",
                table: "OtherExpenses");

            // Step 11: Remove DriverBatta and NumberOfDays from TripExpenses (now in BusExpenses)
            migrationBuilder.DropColumn(
                name: "DriverBatta",
                table: "TripExpenses");

            migrationBuilder.DropColumn(
                name: "NumberOfDays",
                table: "TripExpenses");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Reverse migration - restore original structure
            migrationBuilder.AddColumn<decimal>(
                name: "DriverBatta",
                table: "TripExpenses",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "NumberOfDays",
                table: "TripExpenses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TripExpenseId",
                table: "FuelEntries",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "TripExpenseId",
                table: "OtherExpenses",
                type: "int",
                nullable: false,
                defaultValue: 0);

            // Restore data and relationships
            migrationBuilder.Sql(@"
                UPDATE TripExpenses 
                SET DriverBatta = (SELECT TOP 1 DriverBatta FROM BusExpenses WHERE TripExpenseId = TripExpenses.Id),
                    NumberOfDays = (SELECT TOP 1 NumberOfDays FROM BusExpenses WHERE TripExpenseId = TripExpenses.Id)
            ");

            migrationBuilder.Sql(@"
                UPDATE FuelEntries 
                SET TripExpenseId = (SELECT TripExpenseId FROM BusExpenses WHERE Id = FuelEntries.BusExpenseId)
            ");

            migrationBuilder.Sql(@"
                UPDATE OtherExpenses 
                SET TripExpenseId = (SELECT TripExpenseId FROM BusExpenses WHERE Id = OtherExpenses.BusExpenseId)
            ");

            // Drop new structure
            migrationBuilder.DropForeignKey(name: "FK_FuelEntries_BusExpenses_BusExpenseId", table: "FuelEntries");
            migrationBuilder.DropForeignKey(name: "FK_OtherExpenses_BusExpenses_BusExpenseId", table: "OtherExpenses");
            migrationBuilder.DropIndex(name: "IX_FuelEntries_BusExpenseId", table: "FuelEntries");
            migrationBuilder.DropIndex(name: "IX_OtherExpenses_BusExpenseId", table: "OtherExpenses");
            migrationBuilder.DropColumn(name: "BusExpenseId", table: "FuelEntries");
            migrationBuilder.DropColumn(name: "BusExpenseId", table: "OtherExpenses");
            migrationBuilder.DropTable(name: "BusExpenses");

            // Restore original foreign keys
            migrationBuilder.CreateIndex(name: "IX_FuelEntries_TripExpenseId", table: "FuelEntries", column: "TripExpenseId");
            migrationBuilder.CreateIndex(name: "IX_OtherExpenses_TripExpenseId", table: "OtherExpenses", column: "TripExpenseId");
            migrationBuilder.AddForeignKey(name: "FK_FuelEntries_TripExpenses_TripExpenseId", table: "FuelEntries", column: "TripExpenseId", principalTable: "TripExpenses", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_OtherExpenses_TripExpenses_TripExpenseId", table: "OtherExpenses", column: "TripExpenseId", principalTable: "TripExpenses", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class updaterelation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_GramerKurallar_Temalar_TemaId",
                table: "GramerKurallar");

            migrationBuilder.DropIndex(
                name: "IX_GramerKurallar_TemaId",
                table: "GramerKurallar");

            migrationBuilder.DropColumn(
                name: "TemaId",
                table: "GramerKurallar");

            migrationBuilder.AddColumn<int>(
                name: "TemaId",
                table: "Konular",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Konular_TemaId",
                table: "Konular",
                column: "TemaId");

            migrationBuilder.AddForeignKey(
                name: "FK_Konular_Temalar_TemaId",
                table: "Konular",
                column: "TemaId",
                principalTable: "Temalar",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Konular_Temalar_TemaId",
                table: "Konular");

            migrationBuilder.DropIndex(
                name: "IX_Konular_TemaId",
                table: "Konular");

            migrationBuilder.DropColumn(
                name: "TemaId",
                table: "Konular");

            migrationBuilder.AddColumn<int>(
                name: "TemaId",
                table: "GramerKurallar",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_GramerKurallar_TemaId",
                table: "GramerKurallar",
                column: "TemaId");

            migrationBuilder.AddForeignKey(
                name: "FK_GramerKurallar_Temalar_TemaId",
                table: "GramerKurallar",
                column: "TemaId",
                principalTable: "Temalar",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}

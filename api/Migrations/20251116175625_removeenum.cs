using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class removeenum : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TemaResimleri_GramerKurallar_GramerKuralId",
                table: "TemaResimleri");

            migrationBuilder.DropForeignKey(
                name: "FK_TemaResimleri_KelimeTemalari_KelimeTemasiId",
                table: "TemaResimleri");

            migrationBuilder.DropForeignKey(
                name: "FK_TemaResimleri_MetinTemalari_MetinTemaId",
                table: "TemaResimleri");

            migrationBuilder.DropIndex(
                name: "IX_TemaResimleri_GramerKuralId",
                table: "TemaResimleri");

            migrationBuilder.DropIndex(
                name: "IX_TemaResimleri_KelimeTemasiId",
                table: "TemaResimleri");

            migrationBuilder.DropIndex(
                name: "IX_TemaResimleri_MetinTemaId",
                table: "TemaResimleri");

            migrationBuilder.DropColumn(
                name: "GramerKuralId",
                table: "TemaResimleri");

            migrationBuilder.DropColumn(
                name: "KelimeTemasiId",
                table: "TemaResimleri");

            migrationBuilder.DropColumn(
                name: "MetinTemaId",
                table: "TemaResimleri");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "GramerKuralId",
                table: "TemaResimleri",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "KelimeTemasiId",
                table: "TemaResimleri",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MetinTemaId",
                table: "TemaResimleri",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_TemaResimleri_GramerKuralId",
                table: "TemaResimleri",
                column: "GramerKuralId");

            migrationBuilder.CreateIndex(
                name: "IX_TemaResimleri_KelimeTemasiId",
                table: "TemaResimleri",
                column: "KelimeTemasiId");

            migrationBuilder.CreateIndex(
                name: "IX_TemaResimleri_MetinTemaId",
                table: "TemaResimleri",
                column: "MetinTemaId");

            migrationBuilder.AddForeignKey(
                name: "FK_TemaResimleri_GramerKurallar_GramerKuralId",
                table: "TemaResimleri",
                column: "GramerKuralId",
                principalTable: "GramerKurallar",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TemaResimleri_KelimeTemalari_KelimeTemasiId",
                table: "TemaResimleri",
                column: "KelimeTemasiId",
                principalTable: "KelimeTemalari",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_TemaResimleri_MetinTemalari_MetinTemaId",
                table: "TemaResimleri",
                column: "MetinTemaId",
                principalTable: "MetinTemalari",
                principalColumn: "Id");
        }
    }
}

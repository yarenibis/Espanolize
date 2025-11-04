using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddKelimeTemasiVeKelimeTablolari : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<int>(
                name: "GramerKuralId",
                table: "Ornekler",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateTable(
                name: "KelimeTemalari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Baslik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KelimeTemalari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kelimeler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ispanyolca = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Turkce = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    KelimeTemasiId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kelimeler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Kelimeler_KelimeTemalari_KelimeTemasiId",
                        column: x => x.KelimeTemasiId,
                        principalTable: "KelimeTemalari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Kelimeler_KelimeTemasiId",
                table: "Kelimeler",
                column: "KelimeTemasiId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kelimeler");

            migrationBuilder.DropTable(
                name: "KelimeTemalari");

            migrationBuilder.AlterColumn<int>(
                name: "GramerKuralId",
                table: "Ornekler",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");
        }
    }
}

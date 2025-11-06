using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddMetinTemaAndMetinTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "MetinTemalari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Baslik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MetinTemalari", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Metinler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    icerik = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ceviri = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    zorluk = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MetinTemaId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Metinler", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Metinler_MetinTemalari_MetinTemaId",
                        column: x => x.MetinTemaId,
                        principalTable: "MetinTemalari",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Metinler_MetinTemaId",
                table: "Metinler",
                column: "MetinTemaId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Metinler");

            migrationBuilder.DropTable(
                name: "MetinTemalari");
        }
    }
}

using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddImageFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "MetinTemalari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "KelimeTemalari",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ImageUrl",
                table: "GramerKurallar",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "GramerKuralImage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    GramerKuralId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GramerKuralImage", x => x.Id);
                    table.ForeignKey(
                        name: "FK_GramerKuralImage_GramerKurallar_GramerKuralId",
                        column: x => x.GramerKuralId,
                        principalTable: "GramerKurallar",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_GramerKuralImage_GramerKuralId",
                table: "GramerKuralImage",
                column: "GramerKuralId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GramerKuralImage");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "MetinTemalari");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "KelimeTemalari");

            migrationBuilder.DropColumn(
                name: "ImageUrl",
                table: "GramerKurallar");
        }
    }
}

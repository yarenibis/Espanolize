using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.Migrations
{
    /// <inheritdoc />
    public partial class AddGramerKuralImages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GramerKuralImage");

            migrationBuilder.RenameColumn(
                name: "ImageUrl",
                table: "GramerKurallar",
                newName: "KapakResmiUrl");

            migrationBuilder.AddColumn<string>(
                name: "DetayResimUrls",
                table: "GramerKurallar",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "DetayResimUrls",
                table: "GramerKurallar");

            migrationBuilder.RenameColumn(
                name: "KapakResmiUrl",
                table: "GramerKurallar",
                newName: "ImageUrl");

            migrationBuilder.CreateTable(
                name: "GramerKuralImage",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    GramerKuralId = table.Column<int>(type: "int", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false)
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
    }
}

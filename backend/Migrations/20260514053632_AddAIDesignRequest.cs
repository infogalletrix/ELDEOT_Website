using System;
using Microsoft.EntityFrameworkCore.Migrations;
using MySql.EntityFrameworkCore.Metadata;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddAIDesignRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AIDesignRequests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySQL:ValueGenerationStrategy", MySQLValueGenerationStrategy.IdentityColumn),
                    RoomType = table.Column<string>(type: "longtext", nullable: false),
                    DesignStyle = table.Column<string>(type: "longtext", nullable: false),
                    ColorPreferences = table.Column<string>(type: "longtext", nullable: false),
                    BudgetRange = table.Column<string>(type: "longtext", nullable: false),
                    AdditionalNotes = table.Column<string>(type: "longtext", nullable: false),
                    ImagePath = table.Column<string>(type: "longtext", nullable: false),
                    FloorPlanPath = table.Column<string>(type: "longtext", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AIDesignRequests", x => x.Id);
                })
                .Annotation("MySQL:Charset", "utf8mb4");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AIDesignRequests");
        }
    }
}

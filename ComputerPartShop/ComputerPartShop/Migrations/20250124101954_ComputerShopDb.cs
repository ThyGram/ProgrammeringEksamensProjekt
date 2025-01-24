using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ComputerPartShop.Migrations
{
    /// <inheritdoc />
    public partial class ComputerShopDb : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderProduct_Products_PartProductId",
                table: "OrderProduct");

            migrationBuilder.RenameColumn(
                name: "Price",
                table: "Products",
                newName: "Cost");

            migrationBuilder.RenameColumn(
                name: "PartProductId",
                table: "OrderProduct",
                newName: "ProductId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderProduct_PartProductId",
                table: "OrderProduct",
                newName: "IX_OrderProduct_ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Products_ProductId",
                table: "OrderProduct",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_OrderProduct_Products_ProductId",
                table: "OrderProduct");

            migrationBuilder.RenameColumn(
                name: "Cost",
                table: "Products",
                newName: "Price");

            migrationBuilder.RenameColumn(
                name: "ProductId",
                table: "OrderProduct",
                newName: "PartProductId");

            migrationBuilder.RenameIndex(
                name: "IX_OrderProduct_ProductId",
                table: "OrderProduct",
                newName: "IX_OrderProduct_PartProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Products_PartProductId",
                table: "OrderProduct",
                column: "PartProductId",
                principalTable: "Products",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}

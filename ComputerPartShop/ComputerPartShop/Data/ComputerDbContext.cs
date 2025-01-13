using ComputerPartShop.Data.Entities;
using Microsoft.EntityFrameworkCore;


namespace ComputerPartShop.Data
{
    public class ComputerDbContext : DbContext
    {
        private readonly IConfiguration _config;

        public ComputerDbContext(IConfiguration config)
        {
            _config = config;
        }

        public DbSet<Order> Orders { get; set; }
        public DbSet<PartProduct> Products { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config.GetConnectionString("DbConnection"));


        }
    }
}

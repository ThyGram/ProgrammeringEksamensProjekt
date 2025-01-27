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
        public DbSet<Product> Products { get; set; }
        public DbSet<Customer> Customer { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config.GetConnectionString("DbConnection"));


        }
    }
}

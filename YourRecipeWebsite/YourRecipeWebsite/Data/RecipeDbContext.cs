using YourRecipeWebsite.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace YourRecipeWebsite.Data
{

    public class RecipeDbContext : DbContext
    {
        private readonly IConfiguration _config;

        public RecipeDbContext(IConfiguration config)
        {
            _config = config;
        }

        public DbSet<Recipe> Recipes { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<FavoriteRecipe> FavoriteRecipes { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config.GetConnectionString("DbConnection"));
        }
    }
}

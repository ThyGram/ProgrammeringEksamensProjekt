using YourRecipeWebsite.Data.Entities;

namespace YourRecipeWebsite.Data
{
    public class UsersFavoriteRecipes
    {
        public List<User> Users { get; set; }

        public List<FavoriteRecipe> FavoriteRecipes { get; set; }

        public bool Login { get; set; }
    }
}

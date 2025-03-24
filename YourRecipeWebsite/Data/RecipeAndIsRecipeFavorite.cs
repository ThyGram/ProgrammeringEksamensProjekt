using YourRecipeWebsite.Data.Entities;

namespace YourRecipeWebsite.Data
{
    public class RecipeAndIsRecipeFavorite
    {
        public Recipe Recipe { get; set; }
        public bool Favorite { get; set; }

        public int favoriteId { get; set; }
    }
}

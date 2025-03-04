namespace YourRecipeWebsite.Data.Entities
{
    public class Recipe
    {
        public int Id { get; set; }
        public string Mealname { get; set; }
        public string? Category { get; set; }
        public string? Area { get; set; }
        public string? Instructions { get; set; }
        public string? Ingredients { get; set; }
        public string MealPNG { get; set; }
    }
}

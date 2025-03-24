using System.Diagnostics;
using System.Diagnostics.Eventing.Reader;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourRecipeWebsite.Data;
using YourRecipeWebsite.Data.Entities;
using YourRecipeWebsite.Migrations;
using YourRecipeWebsite.Models;

namespace YourRecipeWebsite.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;
    private readonly RecipeDbContext _context;

    public HomeController(ILogger<HomeController> logger, RecipeDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public IActionResult Index()
    {
        List<Recipe> recipes = _context.Recipes.ToList();
        return View(recipes);
    }

    public IActionResult Index2(string mealName, string mealPNG)
    {
        string[] arrayMealName = mealName.Split(",");
        string[] arrayMealPNG = mealPNG.Split(",");
        _context.Database.EnsureCreated();

        List<Recipe> allRec = new List<Recipe>();
        for (int i = 0; i < arrayMealName.Length; i++)
        {
            Recipe r = new Recipe();
            r.MealPNG = arrayMealPNG[i];
            r.Mealname = arrayMealName[i];
            allRec.Add(r);
        }
        if (!_context.Recipes.Any())
        {
            if (allRec != null)
            {
                _context.Recipes.AddRange(allRec);
            }
        }
        _context.SaveChanges();

        return RedirectToAction("Index");


    }

    public IActionResult Account(int UserID, bool login, bool OpenedOnce)
    {
        UsersFavoriteRecipes result = new UsersFavoriteRecipes(); // Class is only used for this and is not a database.

        List<User> Users = _context.Users.ToList();

        List<FavoriteRecipe> UsersFavoriteRecipes = _context.FavoriteRecipes.Include(fr => fr.Recipe).Include(fr => fr.User).ToList();
        List<FavoriteRecipe> FavoriteRecipes = new List<FavoriteRecipe>();
        for (int i = 0; i < UsersFavoriteRecipes.Count(); i++)
        {
            if (UsersFavoriteRecipes[i].User.Id == UserID)
            {
                FavoriteRecipes.Add(UsersFavoriteRecipes[i]);
            }
        }

        result.Users = Users;
        result.FavoriteRecipes = FavoriteRecipes;
        if (login == true)
        {
            result.Login = login;
        }
        else
        {
            result.Login = false;
        }

        if (OpenedOnce != true)
        {
            result.OpenedOnce = false;
        }
        else
        {
            result.OpenedOnce = OpenedOnce;
        }

            return View(result);
    }

    public IActionResult Account2(string email, string firstname, string lastname, string phonenumber)
    {
        int integerPhonennumber = int.Parse(phonenumber);

        User User = new User();

        if (email != null)
        {
            User.Email = email;
            User.Firstname = firstname;
            User.Lastname = lastname;
            User.Phonenumber = integerPhonennumber;

            if (User != null)
            {
                _context.Users.AddRange(User);
            }
        }
        int UserID = User.Id;
        _context.SaveChanges();

        return RedirectToAction("Account", UserID);
    }


    public IActionResult About()
    {
        return View();
    }

    public IActionResult AlterRecipes()
    {
        List<Recipe> allRec = _context.Recipes.ToList();
        return View(allRec);
    }

    public IActionResult Recipes(string MealId)
    {
        List<Recipe> result = _context.Recipes.ToList();
        List<List<Recipe>> tester = new List<List<Recipe>>();
        List<Recipe> allRec = new List<Recipe>();
        if (MealId != null)
        {
            string[] arrayMealId = MealId.Split(",");

            for (int i = 0; i < arrayMealId.Length; i++)
            {
                var recipe = _context.Recipes.Find(int.Parse(arrayMealId[i]));
                allRec.Add(recipe);
            }
            tester.Add(allRec);
            tester.Add(result);
            return View(tester);
        }
        else
        {
            tester.Add(allRec);
            tester.Add(result);
            return View(tester);
        }
            
    }

    public IActionResult SpecificRecipe(string Category, string Area, string Instructions, string Ingredients, int recipeId, int userId)
    {
        List<Recipe> allRec = _context.Recipes.ToList();
        _context.Database.EnsureCreated();
        RecipeAndIsRecipeFavorite result = new RecipeAndIsRecipeFavorite();
        Recipe recipe = _context.Recipes.Find(recipeId);
        
        if (recipe != null && Category != "no")
        {
            recipe.Category = Category;
            recipe.Area = Area;
            recipe.Instructions = Instructions;
            recipe.Ingredients = Ingredients;
        }

        List<FavoriteRecipe> favoriterecipes = _context.FavoriteRecipes.Include(fr => fr.Recipe).Include(fr => fr.User).ToList();

        for (int i = 0; i < favoriterecipes.Count(); i++)
        {
            if (favoriterecipes[i].Recipe.Id == recipeId && favoriterecipes[i].User.Id == userId)
            {
                result.Favorite = true;
                result.favoriteId = favoriterecipes[i].Id;
            }
        }
        result.Recipe = recipe;
        _context.SaveChanges();

        return View(result);
    }

    public IActionResult AddFavorite(int userId, int recipeId)
    {
        _context.Database.EnsureCreated();
        FavoriteRecipe favRec = new FavoriteRecipe();
        Recipe Recipe = _context.Recipes.Find(recipeId);
        if (Recipe != null)
        {
            favRec.Recipe = Recipe;
        }
        User User = _context.Users.Find(userId);
        if (User != null)
        {
            favRec.User = User;
        }

        _context.FavoriteRecipes.Add(favRec);
        _context.SaveChanges();


        return RedirectToAction("SpecificRecipe", new { Category = "no", recipeId = recipeId, userId = userId });
    }

    public IActionResult RemoveFavorite(int favoriteRecipeId)
    {
        _context.Database.EnsureCreated();
        FavoriteRecipe favRec = new FavoriteRecipe();
        favRec = _context.FavoriteRecipes.Include(fr => fr.Recipe).Include(fr => fr.User).FirstOrDefault(fr => fr.Id == favoriteRecipeId);
        _context.FavoriteRecipes.Remove(favRec);
        
        _context.SaveChanges();


        return RedirectToAction("SpecificRecipe", (new { Category = "no", recipeId = favRec.Recipe.Id, userId = favRec.User.Id }));
    }

    public IActionResult ChangeRecipe(string mealName, string mealPNG, string Category, string Area, string Instructions, string Ingredients)
    {
        List<Recipe> Recipes = _context.Recipes.ToList();
        int mealId = 0;

        for (int i = 0; i < Recipes.Count(); i++)
        {
            if (Recipes[i].Mealname == mealName)
            {
                mealId = Recipes[i].Id;
            }
        }
        Recipe ChosenRecipe = _context.Recipes.Find(mealId);

        if (mealId > 0 && ChosenRecipe != null)
        {
            ChosenRecipe.MealPNG = mealPNG;
            ChosenRecipe.Category = Category;
            ChosenRecipe.Area = Area;
            ChosenRecipe.Instructions = Instructions;
            ChosenRecipe.Ingredients = Ingredients;
        }

        _context.SaveChanges();

        return RedirectToAction("AlterRecipes");
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

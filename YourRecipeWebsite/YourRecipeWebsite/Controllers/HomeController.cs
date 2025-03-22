using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
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
        return View();
    }

    public IActionResult Account(int UserID, bool login)
    {
        UsersFavoriteRecipes result = new UsersFavoriteRecipes(); // Class is only used for this and is not a database.

        List<User> Users = _context.Users.ToList();

        List<FavoriteRecipe> UsersFavoriteRecipes = _context.FavoriteRecipes.ToList();
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
    public IActionResult Privacy()
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

    public IActionResult SpecificRecipe(string Category, string Area, string Instructions, string Ingredients, int id)
    {
        _context.Database.EnsureCreated();

        var recipe = _context.Recipes.Find(id);
        
        if (recipe != null)
        {
            recipe.Category = Category;
            recipe.Area = Area;
            recipe.Instructions = Instructions;
            recipe.Ingredients = Ingredients;
        }

        _context.SaveChanges();

        return View(recipe);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

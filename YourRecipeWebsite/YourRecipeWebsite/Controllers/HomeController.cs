using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using YourRecipeWebsite.Data;
using YourRecipeWebsite.Data.Entities;
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
            if (mealName != null)
            {   
                _context.Recipes.AddRange(allRec);
            }
        }
        else
        {
            _context.Recipes.RemoveRange(_context.Recipes);
        }

        _context.SaveChanges();
        return RedirectToAction("Index");
    }
    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}

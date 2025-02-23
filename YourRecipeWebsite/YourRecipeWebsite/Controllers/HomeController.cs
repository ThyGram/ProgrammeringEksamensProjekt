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

    public IActionResult Index2(Recipe p)
    {
        _context.Database.EnsureCreated();
        if (!_context.Recipes.Any())
        {
            if (p != null)
            {
                _context.Recipes.AddRange(p);
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

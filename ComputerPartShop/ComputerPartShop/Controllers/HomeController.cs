using ComputerPartShop.Data;
using ComputerPartShop.Data.Entities;
using ComputerPartShop.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace ComputerPartShop.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly ComputerDbContext _context;

        public HomeController(ILogger<HomeController> logger, ComputerDbContext context)
        {
            _logger = logger;
            _context = context;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Index2(Product p)
        {
            _context.Database.EnsureCreated();
            if (!_context.Products.Any())
            {
                if (p != null)
                {
                    _context.Products.AddRange(p);
                }
            }
            else
            {
                _context.Products.RemoveRange(_context.Products);
            }
            _context.SaveChanges();
            return RedirectToAction("Index");
        }

        public IActionResult Privacy()
        {
            return View();
        }

        public IActionResult About()
        {
            return View();
        }

        public IActionResult ShowProducts() 
        {
            List<Product> result = _context.Products.OrderBy(p => p.Cost).ToList();
            return View(result);
        }

        [HttpGet]
        public IActionResult AddProduct() 
        {
            return View();
        }

        [HttpPost]
        public IActionResult AddProduct(Product product)
        {
            _context.Products.Add(product);
            _context.SaveChanges();
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

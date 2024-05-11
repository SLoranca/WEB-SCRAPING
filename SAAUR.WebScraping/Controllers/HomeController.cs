using HtmlAgilityPack;
using Microsoft.AspNetCore.Mvc;
using SAAUR.WebScraping.Models;
using ScrapySharp.Extensions;
using System.Diagnostics;

namespace SAAUR.WebScraping.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
		private readonly IConfiguration _config;

		public HomeController(ILogger<HomeController> logger, IConfiguration config)
		{
			_logger = logger;
			_config = config;
		}

		public IActionResult Index()
        {
			var cookie = HttpContext.Request.Cookies["SSOCookie"];

			if (cookie != null)
			{
				return View();
			}
			else
			{
				return RedirectToAction("Error", "Home");
			}
		}

        public IActionResult Privacy()
        {
            return View();
        }

		public IActionResult History()
		{
			var cookie = HttpContext.Request.Cookies["SSOCookie"];

			if (cookie != null)
			{
				return View();
			}
			else
			{
				return RedirectToAction("Error", "Home");
			}
		}

		public IActionResult Scraping(string urlScraping, string classScraping)
		{
			ModelResponse result = new();
			try
			{
				HtmlWeb web = new HtmlWeb();
				HtmlDocument html = web.Load(urlScraping);

				var nodes = html.DocumentNode.CssSelect("[class=" + classScraping + "]").Select(x => x.InnerText).ToList();
				result.status = "OK";

				if (nodes.Count > 0)
				{
					result.data = nodes;
					result.message = "Éxito";
				}
				else
				{
					result.data = null;
					result.message = "No se encontraron resultados";
				}
			}
			catch (Exception ex)
			{
				result.status = "ERROR";
				result.data = null;
				result.message = ex.Message.ToString();
			}

			return Json(result);
		}

		public IActionResult Logout()
		{
			var cookie = HttpContext.Request.Cookies[_config["AccessSSO:Cookie"]];

			if (cookie != null)
			{
				Response.Cookies.Delete(_config["AccessSSO:Cookie"]);
				return Redirect(_config["AccessSSO:Url"] + "Account/Login");
			}
			else
			{
				return LocalRedirect("/");
			}
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

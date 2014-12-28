using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Security.Claims;

using Microsoft.AspNet.Mvc;

namespace Server
{
	[NoCache]
    public class SiteController : Controller
	{
		public object Information()
		{
			var assemblyInformation =
				from assembly in AppDomain.CurrentDomain.GetAssemblies()
				select new
				{
					Name = assembly.GetName().Name,
					Version = assembly.GetName().Version.ToString()
				};

			return new
			{
				Name = "Stage Clear",
				Version = Assembly.GetExecutingAssembly().GetName().Version.ToString(),
				Assemblies = assemblyInformation.OrderBy(a => a.Name).ToArray()
			};
		}
    }
}
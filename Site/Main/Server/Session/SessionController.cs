using System;
using System.Collections.Generic;
using System.Security.Claims;

using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Http.Security;
using Microsoft.AspNet.PipelineCore.Infrastructure;
using Microsoft.AspNet.Security.Cookies;
using Microsoft.AspNet.HttpFeature.Security;

namespace Server.Session
{
	[NoCache]
	public class SessionController : Controller
	{
		public ActionResult Login( string username, string password )
		{
			var claims = new List<Claim>();
			claims.Add( new Claim( ClaimTypes.Name, username ) );

			Context.Response.SignIn( new ClaimsIdentity( claims, CookieAuthenticationDefaults.AuthenticationType ) );

			// TODO: It would be nice to just return Status() but the User isn't
			//       updated in the same call. Hopefully this gets fixed.
			return Redirect( "/Session/Status" );
		}

		public ActionResult Status()
		{
			return Json( new
			{
				username = Context.User.Identity.Name,
				isLoggedIn = Context.User.Identity.IsAuthenticated,
				sessionTimeRemaining = 10000000,
				permissions = new string[] { }
			} );
		}

		public ActionResult Logout()
		{
			Context.Response.SignOut( CookieAuthenticationDefaults.AuthenticationType );

			// TODO: It would be nice to just return Status() but the User isn't
			//       updated in the same call. Hopefully this gets fixed.
			return Redirect( "/Session/Status" );
		}
	}
}
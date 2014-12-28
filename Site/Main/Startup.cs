using System;
using System.IO;
#if !ASPNET50
using System.Reflection;
#endif
using System.Security.Claims;

using Microsoft.AspNet.Builder;
using Microsoft.AspNet.FileSystems;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Routing;
using Microsoft.AspNet.Security.Cookies;
using Microsoft.AspNet.StaticFiles;
using Microsoft.AspNet.StaticFiles.Infrastructure;
using Microsoft.Framework.DependencyInjection;
using Server;

namespace Server
{
	public class Startup
	{
		public void Configure( IApplicationBuilder app )
		{
			app.UseCookieAuthentication( new CookieAuthenticationOptions()
			{
				SessionStore = new MemoryCacheSessionStore(),
				ExpireTimeSpan = new TimeSpan( 8, 0, 0 ),
				SlidingExpiration = true
			} );

			ConfigureFileServer( app );

			app.UseServices( services =>
			{
				services.AddMvc();
			} );

			// TODO: Replace with Route attributes when those are available.
			app.UseMvc( routes =>
			{
				routes.MapRoute(
					"Default",
					"{controller}/{action}" );
			} );
		}

		private static void ConfigureFileServer( IApplicationBuilder app )
		{
			var contentTypes = new FileExtensionContentTypeProvider();
			contentTypes.Mappings[".js"] = "application/js";
			contentTypes.Mappings[".json"] = "application/json";
			contentTypes.Mappings[".template"] = "text/x-template";
			contentTypes.Mappings[".resources"] = "text/x-resources";

			var hostingEnvironment = app.ApplicationServices.GetService<IHostingEnvironment>();

			var fileSystems = new FileSystemList();
			fileSystems.Add( new PhysicalFileSystem( hostingEnvironment.WebRoot ) );

			fileSystems.Add(
#if ASPNET50
				new ExtendedEmbeddedResourceFileSystem( typeof(WebPF.This).Assembly )
#else
                new ExtendedEmbeddedResourceFileSystem( typeof(WebPF.This).GetTypeInfo().Assembly )
#endif
			);

			var sharedOptions = new SharedOptions();
			sharedOptions.FileSystem = fileSystems;

			var staticFileOptions = new StaticFileOptions( sharedOptions );
			staticFileOptions.ContentTypeProvider = contentTypes;

			var directoryBrowserOptions = new DirectoryBrowserOptions( sharedOptions );
			var fileServerOptions = new FileServerOptions();
			fileServerOptions.FileSystem = sharedOptions.FileSystem;
			fileServerOptions.EnableDirectoryBrowsing = true;
			fileServerOptions.EnableDefaultFiles = true;
			fileServerOptions.DefaultFilesOptions.DefaultFileNames = new[]
			{
				"Index.html",
				"index.html",
			};
			fileServerOptions.StaticFileOptions.ContentTypeProvider = contentTypes;

			app.UseFileServer( fileServerOptions );
		}
	}
}

﻿using System;
using System.Threading.Tasks;

using Microsoft.AspNet.Security;
using Microsoft.AspNet.Security.Cookies.Infrastructure;
using Microsoft.Framework.Cache.Memory;

namespace Server
{
	public class MemoryCacheSessionStore : IAuthenticationSessionStore
	{
		private const string KeyPrefix = "AuthSessionStore-";
		private IMemoryCache cache;

		public MemoryCacheSessionStore()
		{
			cache = new MemoryCache();
		}

		public async Task<string> StoreAsync( AuthenticationTicket ticket )
		{
			var guid = Guid.NewGuid();
			var key = KeyPrefix + guid.ToString();
			await RenewAsync( key, ticket );
			return key;
		}

		public Task RenewAsync( string key, AuthenticationTicket ticket )
		{
			cache.Set( key, ticket, context =>
			{
				var expiresUtc = ticket.Properties.ExpiresUtc;
				if (expiresUtc.HasValue)
				{
					context.SetAbsoluteExpiration( expiresUtc.Value );
				}
				context.SetSlidingExpiration( TimeSpan.FromHours( 1 ) ); // TODO: configurable.

				return (AuthenticationTicket) context.State;
			} );
			return Task.FromResult( 0 );
		}

		public Task<AuthenticationTicket> RetrieveAsync( string key )
		{
			AuthenticationTicket ticket;
			cache.TryGetValue( key, out ticket );
			return Task.FromResult( ticket );
		}

		public Task RemoveAsync( string key )
		{
			cache.Remove( key );
			return Task.FromResult( 0 );
		}
	}
}
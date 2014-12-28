// Always bring in the framework main first. This initializes all
// the common functionality.
define([
	using('Framework.Application'),
	using('Site.Batching.BatchService'),
	using('Site.Globalization.LanguageService'),
	using('Site.Search.SearchService'),
	using('Site.Session.SessionService')
], function(Application, BatchService, LanguageService, SearchService, SessionService) {
	"use strict";

	var container = Application.getContainer();
	container.registerType(BatchService);
	container.registerInstance(LanguageService, new LanguageService());
	container.registerType(SearchService);
	container.registerType(SessionService);
} );

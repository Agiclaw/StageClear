// Always bring in the framework main first. This initializes all
// the common functionality.
define([
	using('Framework.Application'),
	using('Site.Globalization.LanguageService')
], function(Application, LanguageService) {
	"use strict";

	var container = Application.getContainer();
	container.registerInstance( LanguageService, new LanguageService() );
} );

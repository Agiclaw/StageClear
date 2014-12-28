/**
 * This service is used to create and manage a batch of objects that
 * can be processed by actions simultaneously.
 */
define([
	using('Framework.Application'),
 	using('Framework.Environment'),
	using('Framework.RelayCommand'),
	using('Framework.Collections.Collection'),
	using('Framework.Globalization.CultureInfo'),
	using('Framework.UI.Data.CollectionViewSource'),
	using('Framework.Web.Browser')
], function(Application, Environment, RelayCommand, Collection, CultureInfo, CollectionViewSource, Browser) {

	function LanguageService() {
		DependencyObject.call(this);

		var availableLanguagesViewSource = new CollectionViewSource();
		availableLanguagesViewSource.setSorter(function(a, b) {
			var cultureA = new CultureInfo(a.name);
			var cultureB = new CultureInfo(b.name);

			return cultureA.nativeName.localeCompare(cultureB.nativeName);
		});

		availableLanguagesViewSource.bindSource(PropertyBinding.create({
			source: Application,
			path: 'resources.availableCultures'
		}));

		this.bindProperty(LanguageService.AvailableLanguagesProperty, PropertyBinding.create({
			source: availableLanguagesViewSource,
			path: 'value'
		}));

		this.setProperty(LanguageService.SetLanguageCommandProperty, new RelayCommand({
			execute: this.setLanguage.bind(this),
			canExecute: this.canSetLanguage.bind(this)
		}));

		Application.addOneTimeEventHandler(Application.InitializedEvent, this.refreshLanguage.bind(this));
	}

	LanguageService.sourcePath = this.url;
	LanguageService.baseClass = DependencyObject;

	LanguageService.UserLanguageKey = 'Site.Globalization.UserLanguage';

	LanguageService.LanguageProperty = new PropertyDescription({
		propertyChangedCallback: function(args) {
			this.onLanguageChanged(args);
		}
	});

	LanguageService.AvailableLanguagesProperty = new PropertyDescription({
		readOnly: true
	});

	LanguageService.SetLanguageCommandProperty = new PropertyDescription({
		readOnly: true
	});

	LanguageService.getInstance = function() {
		return Application.getContainer().resolve(LanguageService);
	};

	LanguageService.prototype.canSetLanguage = function(languageCode) {
		if (!Type.is(languageCode, "string")) {
			return false;
		}

		languageCode = languageCode.toLowerCase();

		var availableLanguage = Collection.toArray(this.getAvailableLanguages()).find(function(al) {
			return al.name.toLowerCase() == languageCode;
		});

		if (availableLanguage === undefined) {
			return false;
		}

		var availableCulture = CultureInfo.getAvailableCultures().find(function(c) {
			return c.toLowerCase() == languageCode;
		});

		if (availableCulture === undefined) {
			return false;
		}

		return true;
	};

	LanguageService.prototype.refreshLanguage = function() {
		var language = this.determineLanguage().toLowerCase();
		var availableLanguages = Collection.toArray(this.getAvailableLanguages());

		for (var i in availableLanguages) {
			var availableLanguage = availableLanguages[i];

			if (language.indexOf(availableLanguage.name.toLowerCase()) != -1) {
				this.setLanguage(availableLanguage.name);
				return;
			}
		}
	};

	LanguageService.prototype.determineLanguage = function() {
		// First check the query parameters for an explicit language.
		var pageParams = Browser.decodeQueryString(window.location.search.substring(1));
		if (pageParams.language && (pageParams.language != "undefined")) {
			return pageParams.language;
		}

		// Then fall back to local storage to see if there is a user
		// preference saved there.
		var localLanguage = localStorage.getItem(LanguageService.UserLanguageKey)
		if (localLanguage) {
			return localLanguage;
		}

		// Third, see if there is an accept language property.
		if (window.acceptLanguage) {
			// TODO: Some browsers, like chrome return a ; delimitted string of accepted languages
			return window.acceptLanguage;
		}

		// Forth, try navigator language and user language.
		var browserLanguage = navigator.language || navigator.userLanguage;
		if (browserLanguage) {
			return browserLanguage;
		}

		// Select current language, default to English
		return "en-US";
	};

	LanguageService.prototype.onLanguageChanged = function(args) {
		var languageCode = args.newValue;

		if (languageCode) {
			languageCode = languageCode.toLowerCase();
			localStorage.setItem(LanguageService.UserLanguageKey, languageCode);

			var availableCulture = CultureInfo.getAvailableCultures().find(function(c) {
				return c.toLowerCase() == languageCode;
			});

			Application.setCurrentCulture(new CultureInfo(availableCulture));
		}
	};

	return Type.createClass(LanguageService);
});

define([
// @formatter:off
	using('Framework.Environment'),
	using('Framework.RelayCommand'),
	using('Framework.Collections.Collection'),
	using('Framework.UI.Controls.Panel'),
	using('Framework.UI.Data.CollectionViewSource'),
	using('Framework.Web.Browser'),
	using('Framework.Web.HistoryAction'),
	using('Site.AboutPanel'),
	using('Site.HomePanel'),
	using('Site.SiteCommand'),
	using('Site.Globalization.LanguageService'),
	using('Site.Testing.TestPanel1'),
	using('Site.Testing.TestPanel2'),
	using('Site.Testing.TestPanel3'),
	using('Site.Testing.TestPanel4'),
// @formatter:on
], function(Environment, RelayCommand, Collection, Panel, CollectionViewSource, Browser, HistoryAction, AboutPanel, HomePanel, SiteCommand, LanguageService, TestPanel1, TestPanel2, TestPanel3, TestPanel4) {
	"use strict";

	/*globals PropertyDescription, Type*/

	function MainPanel(options) {
		MainPanel.instance = this;

		Panel.call(this, options);

		// Just use the control as the data context to simplify template
		// bindings.
		this.setDataContext(this);

		this.popStateListener = this.onPopState.bind(this);
		window.addEventListener('popstate', this.popStateListener);

		this.pageParams = Browser.decodeQueryString(window.location.search.substring(1));

		// Initialize site commands and their view source.
		this.setSiteCommands(new Collection());

		var siteCommandsViewSource = new CollectionViewSource();
		siteCommandsViewSource.setSorter(this.sortSiteCommands.bind(this));
		siteCommandsViewSource.bindSource(new PropertyBinding({
			source: this,
			propertyDescription: MainPanel.SiteCommandsProperty
		}));

		this.setProperty(MainPanel.SiteCommandsViewSourceProperty, siteCommandsViewSource);

		if (!MainPanel.debugInitialized && this.pageParams.debug) {
			this.loadDebugComponents();
			MainPanel.debugInitialized = true;
		}

		this.setProperty(MainPanel.ShowHomeCommandProperty, new RelayCommand({
			execute: this.showHomePanel.bind(this)
		}));
	}

	MainPanel.sourcePath = this.url;
	MainPanel.baseClass = Panel;

	MainPanel.CurrentPanelProperty = new PropertyDescription();

	MainPanel.ShowHomeCommandProperty = new PropertyDescription({
		readOnly: true
	});

	MainPanel.SiteCommandsProperty = new PropertyDescription();

	MainPanel.SiteCommandsViewSourceProperty = new PropertyDescription({
		readOnly: true
	});

	MainPanel.getInstance = function() {
		return MainPanel.instance;
	};

	MainPanel.prototype.onDispose = function() {
		window.removeEventListener('popstate', this.popStateListener);
		delete this.popStateListener;

		Panel.prototype.onDispose.call(this);
	};

	MainPanel.prototype.sortSiteCommands = function(a, b) {
		return (a.getName() || "").localeCompare(b.getName() || "");
	};

	MainPanel.prototype.showPanel = function(classFullName, constructorArguments, options) {
		// Support the first argument being a string, class definition, or class
		// type.
		if (typeof classFullName === "function") {
			classFullName = classFullName.getType().getFullName();
		} else if (classFullName instanceof ClassDescription) {
			classFullName = classFullName.getFullName();
		}

		var languageService = LanguageService.getInstance();
		var language = languageService.getLanguage();

		options = options || { historyAction: HistoryAction.Append };
		constructorArguments = constructorArguments || {};

		// Determine if the history needs to be affects and if so update it.
		var historyAction = options.historyAction || HistoryAction.None;

		if (historyAction != HistoryAction.None) {
			var historyState = {
				classFullName: classFullName,
				constructorArguments: constructorArguments,
				language: language
			};

			if (this.pageParams.debug) {
				historyState.debug = true;
			}

			var root = Environment.getWorkingDirectory();

			// Generate a new url for the panel being displayed.
			var url = root + "?" + Browser.encodeQueryString(historyState);

			switch (historyAction) {
				case HistoryAction.Append:
					history.pushState(historyState, root, url);
					break;

				case HistoryAction.Replace:
					history.replaceState(historyState, root, url);
					break;
			}
		}

		var currentPanel = this.getCurrentPanel();
		var newPanel = currentPanel;

		if (currentPanel && (currentPanel.getType().getFullName() == classFullName) && currentPanel.reinitialize) {
			currentPanel.reinitialize(constructorArguments);
		} else {
			// Get the class and create a new instance using the arguments.
			var classDefiniton = require(using(classFullName));
			var classType = classDefiniton.getType()
			newPanel = classType.createInstance(constructorArguments);

			// Now set the current panel to it.
			this.setCurrentPanel(newPanel);
		}

		return newPanel;
	};

	MainPanel.prototype.onPopState = function(args) {
		if (!args.state) {
			return;
		}

		var state = args.state;

		if (state.classFullName == null) {
			return;
		}

		this.showPanel(state.classFullName, state.constructorArguments, { historyAction: HistoryAction.None });
	};

	MainPanel.prototype.showHomePanel = function() {
		this.showPanel(HomePanel);
	};

	MainPanel.prototype.loadRequestedPanel = function() {
		if (this.pageParams.classFullName) {
			var classFullName = this.pageParams.classFullName;
			var constructorArguments = this.pageParams.constructorArguments;

			delete this.pageParams.classFullName;
			delete this.pageParams.constructorArguments;

			var self = this;

			require([using(classFullName)], function() {
				self.showPanel(classFullName, constructorArguments, { historyAction: HistoryAction.Replace });
			});

			return;
		}

		this.showHomePanel();
	};

	MainPanel.prototype.loadDebugComponents = function() {
		this.getSiteCommands().addRange([
			new SiteCommand({
				name: 'Test',
				command: this.showPanel.bind(this, TestPanel1)
			}),
			new SiteCommand({
				name: 'Test 2',
				command: this.showPanel.bind(this, TestPanel2)
			}),
			new SiteCommand({
				name: 'Test 3',
				command: this.showPanel.bind(this, TestPanel3)
			}),
			new SiteCommand({
				name: 'Test 4',
				command: this.showPanel.bind(this, TestPanel4)
			})
		]);
	};

	return Type.createClass(MainPanel);
});


/**
 * A control used to perform search.
 */
define([
	using('Framework.Collections.Collection'),
	using('Framework.UI.Controls.Panel')
], function(Collection, Panel) {
	function SearchResultsPanel(options) {
		var reinitializeOptions = {
			forceRefresh: options.forceRefresh
		};

		delete options.forceRefresh;

		Panel.call(this, options);

		this.setDataContext(this);

		this.reinitialize(options);
	}

	SearchResultsPanel.sourcePath = this.url;
	SearchResultsPanel.baseClass = Panel;

	SearchResultsPanel.QueryProperty = new PropertyDescription({
		propertyChangedCallback: function(args) {
			this.updateQueries();
		}
	});

	SearchResultsPanel.SearchProvidersProperty = new PropertyDescription({
		propertyChangedCallback: function(args) {
			this.updateProviderResultsControls(args.oldValue);
		}
	});

	SearchResultsPanel.SearchResultsControlsProperty = new PropertyDescription();

	SearchResultsPanel.prototype.reinitialize = function(args) {
		var searchService = require(using('Site.Search.SearchService'));
		var searchProviders = searchService.getInstance().getSearchProviders().slice();

		searchProviders.sort(function(a, b) {
			return (b.getOrder() || 0) - (a.getOrder() || 0);
		});

		this.setSearchProviders(new Collection({ items: searchProviders }));

		this.setQuery(args.query);

		if (args.forceRefresh) {
			this.refresh();
		}
	};

	SearchResultsPanel.prototype.refresh = function() {
		var searchResultsControls = this.getSearchResultsControls();

		if (searchResultsControls) {
			var query = this.getQuery();
			var items = searchResultsControls.getItems();

			for (var i = 0; i < items.length; ++i) {
				items[i].refresh();
			}
		}
	};

	SearchResultsPanel.prototype.updateQueries = function() {
		var searchResultsControls = this.getSearchResultsControls();

		if (searchResultsControls) {
			var query = this.getQuery();
			var items = searchResultsControls.getItems();

			for (var i = 0; i < items.length; ++i) {
				items[i].setQuery(query);
			}
		}
	};

	SearchResultsPanel.prototype.updateProviderResultsControls = function(oldProviders) {
		var searchProviders = this.getSearchProviders();

		if (!searchProviders) {
			return;
		}

		var items = searchProviders.getItems();
		var providersChanged;

		if (!oldProviders) {
			providersChanged = true;
		}
		else {
			var oldItems = searchProviders.getItems();
			providersChanged = (items.length != oldItems.length);

			if (!providersChanged) {
				for (var i = 0; i < oldItems.length; ++i) {
					if (oldItems[i] != items[i]) {
						providersChanged = true;
						break;
					}
				}
			}
		}

		if (providersChanged) {
			var query = this.getQuery();
			var searchResultsControls = new Collection();

			for (var i = 0; i < items.length; ++i) {
				searchResultsControls.push(items[i].createSearchResultsControl(query));
			}

			this.setSearchResultsControls(searchResultsControls);
		}
	};

	SearchResultsPanel.prototype.beforeApplyTemplate = function() {
		Panel.prototype.beforeApplyTemplate.call(this);

		if (this.scrollHandler) {
			window.removeEventListener("scroll", this.scrollHandler);
		}
	};

	SearchResultsPanel.prototype.applyTemplate = function() {
		Panel.prototype.applyTemplate.call(this);

		if (this.searchSectionNavigation) {
			var top = this.searchSectionNavigation.getBoundingClientRect().top;
			var self = this;

			this.scrollHandler = function(event) {
				var scrollTop = window.pageYOffset + 20;

				var marginTop = (scrollTop > top) ? (scrollTop - top) : 0;
				self.searchSectionNavigation.style.marginTop = marginTop + "px";
			};

			window.addEventListener("scroll", this.scrollHandler);
			this.scrollHandler();
		}
	};
	
	return Type.createClass(SearchResultsPanel);
});

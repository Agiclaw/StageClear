/**
 * Service used to perform site searches.
 */
define([
	using('Framework.Application'),
	using('Framework.RelayCommand'),
	using('Framework.Collections.Collection'),
	using('Site.MainPanel'),
	using('Site.Search.SearchResultsPanel')
], function(Application, RelayCommand, Collection, MainPanel, SearchResultsPanel) {
	function SearchService() {
		var self = this;

		DependencyObject.call(this);

		this.setProperty(SearchService.PerformSearchCommandProperty, new RelayCommand({
			execute: function(args) {
				args = args || {};
				self.performSearch(args.searchQuery, args.forceRefresh);
			}
		}));

		this.setSearchProviders(new Collection());
	}

	SearchService.sourcePath = this.url;
	SearchService.baseClass = DependencyObject;

	SearchService.SearchProvidersProperty = new PropertyDescription();
	SearchService.PerformSearchCommandProperty = new PropertyDescription({ readOnly: true, bindable: false });

	SearchService.getInstance = function() {
		return Application.getContainer().resolve(SearchService);
	};

	SearchService.prototype.registerSearchProvider = function(searchProvider) {
		this.getSearchProviders().push(searchProvider);
	};

	SearchService.prototype.performSearch = function(searchQuery, forceRefresh) {
		var searchProviders = this.getSearchProviders();

		if (searchProviders && searchProviders.getLength() && searchProviders.getLength() > 0) {
			var mainPanel = MainPanel.getInstance();
			mainPanel.showPanel(SearchResultsPanel, { query: searchQuery, forceRefresh: forceRefresh });
		}
	};

	SearchService.prototype.refreshSearch = function(searchQuery, forceRefresh) {
		var mainPanel = MainPanel.getInstance();
		var currentPanel = mainPanel.getCurrentPanel();

		if (currentPanel instanceof SearchResultsPanel) {
			currentPanel.refresh();
		}
	};

	return Type.createClass(SearchService);
});

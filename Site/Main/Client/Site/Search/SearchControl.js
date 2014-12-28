/**
 * A control used to perform search.
 */
define([
	using('Framework.RelayCommand'),
	using('Framework.UI.Controls.Panel'),
	using('Site.MainPanel'),
	using('Site.Search.SearchResultsPanel'),
	using('Site.Search.SearchService')
], function(RelayCommand, Panel, MainPanel, SearchResultsPanel, SearchService) {
	function SearchControl(options) {
		Panel.call(this, options);

		this.setDataContext(this);

		this.setPerformSearchCommand(new RelayCommand({
			execute: this.performSearch.bind(this)
		}));

		this.setRefreshSearchCommand(new RelayCommand({
			execute: this.refreshSearch.bind(this)
		}));

		this.setClearSearchCommand(new RelayCommand({
			execute: this.clearSearch.bind(this)
		}));

		this.bindDelayedQuery(PropertyBinding.create({
			source: this,
			path: 'query',
			delayFromSource: 300
		}));
	}

	SearchControl.sourcePath = this.url;
	SearchControl.baseClass = Panel;

	SearchControl.QueryProperty = new PropertyDescription({
		defaultValue: ''
	});

	SearchControl.DelayedQueryProperty = new PropertyDescription({
		defaultValue: '',
		propertyChangedCallback: function(args) {
			// The reason I delay this a millisecond is to prevent the
			// control from being disposed during the property change
			// notification. This would causing the property routing to
			// attempt to access a disposed of object and cause console
			// errors.
			setTimeout(this.onQueryChanged.bind(this, args), 1);
		}
	});

	SearchControl.SearchDelayProperty = new PropertyDescription({ defaultValue: 300 });
	SearchControl.PerformSearchCommandProperty = new PropertyDescription();
	SearchControl.RefreshSearchCommandProperty = new PropertyDescription();
	SearchControl.ClearSearchCommandProperty = new PropertyDescription();

	SearchControl.prototype.performSearch = function(args) {
		var query = this.getQuery();

		if (query) {
			SearchService.getInstance().performSearch(query);
		}
	};

	SearchControl.prototype.refreshSearch = function() {
		SearchService.getInstance().refreshSearch();
	};

	SearchControl.prototype.focusSearchQuery = function(args) {
		if (this.searchQuery) {
			this.searchQuery.focus();
		}
	};

	SearchControl.prototype.clearSearch = function(args) {
		args = args || {};

		this.setQuery('');

		if ((args.shouldFocus == undefined) || (args.shouldFocus)) {
			this.focusSearchQuery();
		}

		if (args.goHome === undefined || args.goHome) {
			MainPanel.getInstance().showHomePanel();
		}
	};

	SearchControl.prototype.onQueryChanged = function() {
		if (this.getQuery()) {
			this.performSearch();
		} else {
			var mainPanel = MainPanel.getInstance();
			var currentPanel = mainPanel.getCurrentPanel();

			if (currentPanel instanceof SearchResultsPanel) {
				MainPanel.getInstance().showHomePanel();
			}
		}
	};

	return Type.createClass(SearchControl);
});

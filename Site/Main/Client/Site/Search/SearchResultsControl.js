/**
 * A control used to perform search.
 */
define([
	using('Framework.UI.Control'),
    using('Site.Search.SearchProvider')
], function(Control, SearchProvider) {
	function SearchResultsControl(options) {
		Control.call(this, options);

		this.setDataContext(this);
	}

	SearchResultsControl.sourcePath = this.url;
	SearchResultsControl.baseClass = Control;

	SearchResultsControl.HasMoreProperty = new PropertyDescription({
		defaultValue: false
	});

	SearchResultsControl.FetchMoreCommandProperty = new PropertyDescription();
	SearchResultsControl.HasFetchStatisticsProperty = new PropertyDescription();
	SearchResultsControl.FetchTimeProperty = new PropertyDescription();
	SearchResultsControl.FetchDurationProperty = new PropertyDescription();

	SearchResultsControl.IsFetchingProperty = new PropertyDescription({
		defaultValue: false
	});

	SearchResultsControl.ResultsCountProperty = new PropertyDescription({
		defaultValue: 0
	});

	SearchResultsControl.ProviderProperty = new PropertyDescription();

	SearchResultsControl.QueryProperty = new PropertyDescription(
	{
		propertyChangedCallback: function(args) {
			this.refresh();
		}
	});

	SearchResultsControl.prototype.refresh = function() {
	};

	return Type.createClass(SearchResultsControl);
});

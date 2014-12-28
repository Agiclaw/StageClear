/**
 * A control used to perform search.
 */
define([
	using('Site.Search.SearchResultsControl')
], function(SearchResultsControl) {
	function TestSearchResultsControl(options) {
		SearchResultsControl.call(this, options);

		this.setDataContext(this);

		this.refresh();
	}

	TestSearchResultsControl.sourcePath = this.url;
	TestSearchResultsControl.baseClass = SearchResultsControl;

	TestSearchResultsControl.prototype.refresh = function() {
		this.setHasMore(Math.random() <= 0.5);
		this.setResultsCount(Math.floor(Math.random() * 1000));
		this.setFetchTime(new Date());
		this.setFetchDuration("10 seconds");
		this.setHasFetchStatistics(Math.random() <= 0.5);
	}

	return Type.createClass(TestSearchResultsControl);
});

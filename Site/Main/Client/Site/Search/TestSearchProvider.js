/**
 */
define([
	using('Framework.Environment'),
	using('Site.Search.SearchProvider'),
	using('Site.Search.TestSearchResultsControl')
], function(Environment, SearchProvider, SearchResultsControl) {
	function TestSearchProvider() {
		SearchProvider.call(this);

		this.setName("Test Provider " + ++TestSearchProvider.current);
		this.setImage(Environment.getResourcePath("/Site/Search/Refresh.png"));
	}

	TestSearchProvider.current = 0;
	TestSearchProvider.sourcePath = this.url;
	TestSearchProvider.baseClass = SearchProvider;

	TestSearchProvider.prototype.createSearchResultsControl = function(query) {
		var searchResultsControl = new SearchResultsControl();
		searchResultsControl.setProvider(this);
		searchResultsControl.setQuery(query);
		return searchResultsControl;
	};

	return Type.createClass(TestSearchProvider);
});

/**
 * A search provider is used to display search results when a global search is
 * performed. It provides a control that will auto populate with its own
 * search results and provide its own pagination support.
 */
define([
], function() {
	function SearchProvider() {
		DependencyObject.call(this);
	}

	SearchProvider.sourcePath = this.url;
	SearchProvider.baseClass = DependencyObject;

	SearchProvider.NameProperty = new PropertyDescription();
	SearchProvider.ImageProperty = new PropertyDescription();
	SearchProvider.OrderProperty = new PropertyDescription();

	SearchProvider.prototype.createSearchResultsControl = function(query) {
		return undefined;
	};

	return Type.createClass(SearchProvider);
});

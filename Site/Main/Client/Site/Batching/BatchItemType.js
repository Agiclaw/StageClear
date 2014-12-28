/**
 * Represents the type of an item that can be included in a batch.
 */
define([
	using('Framework.Environment'),
	using('Framework.UI.Converters.TemplateConverter')
], function(Environment, TemplateConverter) {
	function BatchItemType() {
		DependencyObject.call(this);
	}

	BatchItemType.sourcePath = this.url;
	BatchItemType.baseClass = DependencyObject;

	BatchItemType.NameProperty = new PropertyDescription();

	BatchItemType.SingleItemImageProperty = new PropertyDescription();

	BatchItemType.MultiItemImageProperty = new PropertyDescription();

	BatchItemType.NoItemsImageProperty = new PropertyDescription();

	BatchItemType.ItemTemplateProperty = new PropertyDescription({
		defaultValue: new TemplateConverter().convert(Environment.getResourcePath("/Site/Batching/DefaultItemTemplate.template"))
	});

	/**
	 * Test if the value is an instance of the item type.
	 */
	BatchItemType.prototype.isInstance = function(value) {
		return false;
	}

	/**
	 * Takes a value that is an instance of this item type and extracts
	 * the minimal data used to identified the item.
	 */
	BatchItemType.prototype.extractRecord = function(value) {
		return undefined;
	}

	/**
	 * Parses a CSV value into the item type.
	 */
	BatchItemType.prototype.fromCsv = function(value) {
		return undefined;
	}

	/**
	 * Gets the header string that corresponds to the values in order from toCsv.  #ItemType, is automatically added by export.
	 */
	BatchItemType.prototype.getCsvHeaders = function() {
		return undefined;
	}

	/**
	 * Formats a value as a CSV value.
	 */
	BatchItemType.prototype.toCsv = function(value) {
		return undefined;
	}

	/**
	 * Compare two items of this batch item type for sorting.
	 */
	BatchItemType.prototype.compare = function(item1, item2) {
		return 0;
	}

	return Type.createClass(BatchItemType);
});

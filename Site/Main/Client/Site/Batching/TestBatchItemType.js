/**
 * Represents the type of an item that can be included in a batch.
 */
define([
	using('Framework.Environment'),
	using('Framework.UI.Converters.TemplateConverter'),
	using('Site.Batching.BatchItemType')
], function(Environment, TemplateConverter, BatchItemType) {
	function TestBatchItemType() {
		BatchItemType.call(this);

		this.setName("Player");
		this.setSingleItemImage(Environment.getResourcePath("/Site/Batching/Items.png"));
		this.setMultiItemImage(Environment.getResourcePath("/Site/Batching/Items.png"));
		this.setNoItemsImage(Environment.getResourcePath("/Site/Batching/NoItems.png"));

		this.setItemTemplate(new TemplateConverter().convert(Environment.getResourcePath("/Site/Batching/TestBatchItemTemplate.template")));
	}

	TestBatchItemType.sourcePath = this.url;
	TestBatchItemType.baseClass = BatchItemType;

	TestBatchItemType.prototype.isInstance = function(value) {
		return value && value.player && value.player.name;
	}

	BatchItemType.prototype.extractRecord = function(value) {
		var object = {
			player: {
				name: value.player.name
			}
		};

		return object;
	}

	TestBatchItemType.prototype.fromCsv = function(value) {
		var object = {
			player: {
				name: value
			}
		};

		return object;
	}

	TestBatchItemType.prototype.getCsvHeaders = function() {
		return "PlayerName";
	}

	TestBatchItemType.prototype.toCsv = function(value) {
		return value.player.name;
	}

	TestBatchItemType.prototype.compare = function(item1, item2) {
		return item1.player.name.localeCompare(item2.player.name);
	}

	return Type.createClass(TestBatchItemType);
});

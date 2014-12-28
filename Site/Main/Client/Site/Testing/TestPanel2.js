/**
 * A base view for any view that displays player information.
 */
define([
	using('Framework.RelayCommand'),
	using('Framework.Collections.Collection'),
	using('Framework.UI.Controls.Panel')	
], function(RelayCommand, Collection, Panel) {
	function TestPanel2(options) {
		Panel.call(this, options);

		this.setDataContext(this);

		var collection = new Collection();

		this.setCollectionValue(collection);

		this.setAddItemCommand(new RelayCommand({
			execute: this.addItem.bind(this)
		}));

		this.setRemoveItemCommand(new RelayCommand({
			execute: this.removeItem.bind(this)
		}));

		this.setRemoveItemAtCommand(new RelayCommand({
			execute: this.removeItemAt.bind(this)
		}));

		this.setSetItemTemplateCommand(new RelayCommand({
			execute: this.setItemTemplate.bind(this)
		}));

		for (var i = 0; i < 200; ++i) {
			collection.push("Hello, world " + i + "!");
		}
	}

	TestPanel2.sourcePath = this.url;
	TestPanel2.baseClass = Panel;

	TestPanel2.CollectionValueProperty = new PropertyDescription();
	TestPanel2.AddItemCommandProperty = new PropertyDescription();
	TestPanel2.RemoveItemCommandProperty = new PropertyDescription();
	TestPanel2.RemoveItemAtCommandProperty = new PropertyDescription();
	TestPanel2.SetItemTemplateCommandProperty = new PropertyDescription();
	TestPanel2.ItemTemplateProperty = new PropertyDescription();

	TestPanel2.prototype.addItem = function(text) {
		this.getCollectionValue().push(text);
	}

	TestPanel2.prototype.removeItem = function(item) {
		this.getCollectionValue().remove(item);
	}

	TestPanel2.prototype.removeItemAt = function(index) {
		this.getCollectionValue().removeAt(index);
	}

	return Type.createClass(TestPanel2);
});

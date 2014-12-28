define([
	using('Framework.UI.Controls.ToggleButton'),
	using('Site.Batching.BatchService')
], function(ToggleButton, BatchService) {
	function BatchToggleControl(options) {
		ToggleButton.call(this, options);

		var batchService = BatchService.getInstance();

		batchService.addItemAddedHandler(this.onBatchItemAdded, this);
		batchService.addItemRemovedHandler(this.onBatchItemRemoved, this);
		batchService.addItemsClearedHandler(this.onBatchItemsCleared, this);

		this.updateImage();
	}

	BatchToggleControl.sourcePath = this.url;
	BatchToggleControl.baseClass = ToggleButton;

	BatchToggleControl.ItemProperty = new PropertyDescription({
		propertyChangedCallback: function(args) {
			this.onItemChanged(args);
		}
	});

	BatchToggleControl.ImageProperty = new PropertyDescription({
		readOnly: true
	});

	BatchToggleControl.prototype.onItemChanged = function() {
		var batchService = BatchService.getInstance();
		var item = this.getItem();

		this.itemType = batchService.getItemTypeOf(item);

		if (!this.setIsChecked(batchService.containsItem(item))) {
			this.updateImage();
		}
	}

	BatchToggleControl.prototype.onIsCheckedChanged = function(args) {
		ToggleButton.prototype.onIsCheckedChanged.call(this, args);

		var batchService = BatchService.getInstance();
		var item = this.getItem();

		if (item && this.itemType) {
			if (args.newValue) {
				batchService.addItem(item);
			}
			else {
				batchService.removeItem(item);
			}
		}

		this.updateImage();
	}

	BatchToggleControl.prototype.onBatchItemAdded = function(sender, args) {
		if (this.itemType && 0 == this.itemType.compare(args.item, this.getItem())) {
			this.setIsChecked(true);
		}
	}

	BatchToggleControl.prototype.onBatchItemRemoved = function(sender, args) {
		if (this.itemType && 0 == this.itemType.compare(args.item, this.getItem())) {
			this.setIsChecked(false);
		}
	}

	BatchToggleControl.prototype.onBatchItemsCleared = function(sender, args) {
		if (this.itemType) {
			this.setIsChecked(false);
		}
	}

	BatchToggleControl.prototype.updateImage = function() {
		if (this.itemType) {
			var isChecked = this.getIsChecked();

			if (isChecked) {
				this.setProperty(BatchToggleControl.ImageProperty, this.itemType.getSingleItemImage());
			}
			else {
				this.setProperty(BatchToggleControl.ImageProperty, this.itemType.getNoItemsImage());
			}
		}
	}

	BatchToggleControl.prototype.dispose = function() {
		ToggleButton.prototype.dispose.call(this);

		var batchService = BatchService.getInstance();

		batchService.removeItemAddedHandler(this.onBatchItemAdded, this);
		batchService.removeItemRemovedHandler(this.onBatchItemRemoved, this);
		batchService.removeItemsClearedHandler(this.onBatchItemsCleared, this);
	}

	return Type.createClass(BatchToggleControl);
});

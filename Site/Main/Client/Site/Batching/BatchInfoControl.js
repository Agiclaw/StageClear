/**
 * A control that will display the current number of items in a batch
 * and can be clicked to display a popup for manipulating the batch.
 */
define([
	using('Framework.RelayCommand'),
    using('Framework.Source'),
	using('Framework.UI.Control'),
	using('Framework.UI.Data.CollectionViewSource'),
	using('Site.MainPanel'),
	using('Site.Batching.BatchService'),
	using('Site.Batching.BatchOperationPanel')
], function(RelayCommand, Source, Control, CollectionViewSource, MainPanel, BatchService, BatchOperationPanel) {
	function BatchInfoControl(options) {
		Control.call(this, options);

		this.setDataContext(this);

		this.focusLostEventListener = this.onBatchListLostFocus.bind(this, window);

		var batchService = BatchService.getInstance();

		var batchItemsViewSource = new CollectionViewSource();
		batchItemsViewSource.setSorter(batchService.compareBatchItemsByTypeThenName.bind(batchService));
		batchItemsViewSource.bindSource(PropertyBinding.create({
			source: batchService,
			path: 'items'
		}));

		this.batchItemsViewSource = batchItemsViewSource;

		batchService.addItemsUpdatedHandler(this.onItemsUpdated, this);

		this.bindItems(PropertyBinding.create({
			source: batchItemsViewSource,
			path: 'value'
		}));

		this.setProperty(BatchInfoControl.RunCommandProperty, new RelayCommand({
			execute: this.runBatchOperation.bind(this),
			canExecute: this.canRunBatchOperation.bind(this)
		}));
	}

	BatchInfoControl.sourcePath = this.url;
	BatchInfoControl.baseClass = Control;

	BatchInfoControl.ItemsProperty = new PropertyDescription({
		readOnly: true
	});

	BatchInfoControl.RunCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchInfoControl.prototype.dispose = function(context) {
		Control.prototype.dispose.call(this, context);

		var batchService = BatchService.getInstance();
		batchService.removeItemsUpdatedHandler(this.onItemsUpdated, this);
	}

	BatchInfoControl.prototype.onShowBatchManagerPopup = function() {
		// Unfortunately the popup may not be visible when this
		// handler is called so I have to wait a frame before
		// focusing the popup. Attempting to focus it while it
		// is not visible will fail.
		if (this.batchManagerPopup) {
			var self = this;

			setTimeout(function() {
				self.batchManagerPopup.focus();
				window.addEventListener("focusout", self.focusLostEventListener);
			}, 1);
		}
	}

	BatchInfoControl.prototype.onBatchListLostFocus = function(sender, event) {
		var stillHasFocus = this.batchManagerPopup.isEqualOrParentOf(event.relatedTarget);

		if (!stillHasFocus) {
			this.batchListToggleButton.setIsChecked(stillHasFocus);
			window.removeEventListener("focusout", this.focusLostEventListener);
		}
	}

	BatchInfoControl.prototype.onItemsUpdated = function() {
		this.batchItemsViewSource.refresh();
	}

	BatchInfoControl.prototype.runBatchOperation = function() {
		MainPanel.getInstance().showPanel(BatchOperationPanel);
		this.batchListToggleButton.setIsChecked(false);
	}

	BatchInfoControl.prototype.canRunBatchOperation = function() {
		return true;
	}

	BatchInfoControl.prototype.dispose = function(context) {
		Control.prototype.dispose.call(this, context);

		var batchService = BatchService.getInstance();
		batchServiceItems = batchService.getItems();
		batchServiceItems.removeLengthChangedHandler(this.onBatchItemsChanged, this);
	}

	return Type.createClass(BatchInfoControl);
});

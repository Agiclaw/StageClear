/**
 * The panel used to select a batch operation to perform on multiple
 * objects.
 */
define([
	using('Framework.RelayCommand'),
	using('Framework.Source'),
	using('Framework.UI.Controls.Panel'),
	using('Framework.UI.Data.CollectionViewSource'),
	using('Site.Batching.BatchOperation'),
	using('Site.Batching.BatchService'),
], function(RelayCommand, Source, Panel, CollectionViewSource, BatchOperation, BatchService) {
	function BatchOperationPanel(options) {
		Panel.call(this, options);

		this.setDataContext(this);

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

		var batchOperationsViewSource = new CollectionViewSource();
		batchOperationsViewSource.setSorter(batchService.compareOperationsByGroupThenName.bind(batchService));
		batchOperationsViewSource.bindSource(PropertyBinding.create({
			source: batchService,
			path: 'operations'
		}));

		this.bindOperations(PropertyBinding.create({
			source: batchOperationsViewSource,
			path: 'value'
		}));

		this.setProperty(BatchOperationPanel.SelectOperationCommandProperty, new RelayCommand({
			execute: this.selectOperation.bind(this),
			canExecute: this.canSelectOperation.bind(this)
		}));

		this.setProperty(BatchOperationPanel.ClearOperationCommandProperty, new RelayCommand({
			execute: this.clearOperation.bind(this),
			canExecute: this.canClearOperation.bind(this)
		}));
	}

	BatchOperationPanel.sourcePath = this.url;
	BatchOperationPanel.baseClass = Panel;

	BatchOperationPanel.ItemsProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperationPanel.OperationsProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperationPanel.CurrentBatchOperationControlProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperationPanel.SelectOperationCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperationPanel.ClearOperationCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperationPanel.prototype.dispose = function(context) {
		Panel.prototype.dispose.call(this, context);

		var batchService = BatchService.getInstance();
		batchService.removeItemsUpdatedHandler(this.onItemsUpdated, this);
	}

	BatchOperationPanel.prototype.onItemsUpdated = function() {
		this.batchItemsViewSource.refresh();
		this.getSelectOperationCommand().update();
	}

	BatchOperationPanel.prototype.selectOperation = function(args) {
		if (!this.canSelectOperation(args)) {
			return;
		}

		this.setProperty(BatchOperationPanel.CurrentBatchOperationControlProperty, args.createControl());
	}

	BatchOperationPanel.prototype.canSelectOperation = function(args) {
		if (!(args instanceof BatchOperation)) {
			return false;
		}

		return args.getCanExecute();
	}

	BatchOperationPanel.prototype.clearOperation = function(args) {
		this.setProperty(BatchOperationPanel.CurrentBatchOperationControlProperty, undefined);
	}

	BatchOperationPanel.prototype.canClearOperation = function(args) {
		return this.getCurrentBatchOperationControl() != undefined;
	}

	return Type.createClass(BatchOperationPanel);
});

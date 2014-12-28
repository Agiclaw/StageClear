define([
 	using('Site.Batching.BatchOperation'),
 	using('Site.Batching.TestBatchOperationControl')
], function(BatchOperation, TestBatchOperationControl) {
	function TestBatchOperation(options) {
		BatchOperation.call(this);

		this.setProperty(BatchOperation.NameProperty, options.name);
		this.setProperty(BatchOperation.GroupProperty, options.group);
		this.setProperty(BatchOperation.DescriptionProperty, options.description);
		this.setProperty(BatchOperation.ImageProperty, options.image);
		this.setProperty(BatchOperation.CanExecuteProperty, options.canExecute);
	}

	TestBatchOperation.sourcePath = this.url;
	TestBatchOperation.baseClass = BatchOperation;

	TestBatchOperation.prototype.createControl = function(args) {
		return new TestBatchOperationControl();
	}

	return Type.createClass(TestBatchOperation);
});

define([
 	using('Framework.RelayCommand'),
], function(RelayCommand) {
	function BatchOperation() {
		DependencyObject.call(this);
	}

	BatchOperation.sourcePath = this.url;
	BatchOperation.baseClass = DependencyObject;

	BatchOperation.NameProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperation.GroupProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperation.DescriptionProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperation.ImageProperty = new PropertyDescription({
		readOnly: true
	});

	BatchOperation.CanExecuteProperty = new PropertyDescription({
		readOnly: true,
		defaultValue: false
	});

	BatchOperation.prototype.createControl = function(args) {
		return undefined;
	}

	return Type.createClass(BatchOperation);
});

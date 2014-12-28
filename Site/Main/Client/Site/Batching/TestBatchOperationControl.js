define([
	using('Framework.UI.Controls.Panel')
], function(Panel) {
	function TestBatchOperationControl(options) {
		Panel.call(this, options);
	}

	TestBatchOperationControl.sourcePath = this.url;
	TestBatchOperationControl.baseClass = Panel;

	return Type.createClass(TestBatchOperationControl);
});

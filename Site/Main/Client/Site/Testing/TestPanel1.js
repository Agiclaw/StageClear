/**
 * A base view for any view that displays player information.
 */
define([
	using('Framework.UI.Controls.Panel')
], function(Panel) {
	function TestPanel1(options) {
		Panel.call(this, options);

		this.setDataContext(this);

		this.setBoolValue(false);
		this.setIntValue(100);
	}

	TestPanel1.sourcePath = this.url;
	TestPanel1.baseClass = Panel;

	TestPanel1.IntValueProperty = new PropertyDescription();
	TestPanel1.BoolValueProperty = new PropertyDescription();

	return Type.createClass(TestPanel1);
});

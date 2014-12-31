define([
	using('Framework.UI.Controls.Panel')
], function(Panel) {
	function ApplicationPanel(options) {
		Panel.call(this);
	}

	ApplicationPanel.sourcePath = this.url;
	ApplicationPanel.baseClass = Panel;

	return Type.createClass(ApplicationPanel);
});

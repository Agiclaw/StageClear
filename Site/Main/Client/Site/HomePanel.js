define([
	using('Framework.UI.Controls.Panel')
], function(Panel) {
	function HomePanel(options) {
		Panel.call(this);
	}

	HomePanel.sourcePath = this.url;
	HomePanel.baseClass = Panel;

	return Type.createClass(HomePanel);
});

define([
// @formatter:off
	using('Framework.UI.Controls.Panel')
// @formatter:on
], function(Panel) {
	"use strict";

	/*globals Type*/

	function AboutPanel(options) {
		Panel.call(this, options);
	}

	AboutPanel.sourcePath = this.url;
	AboutPanel.baseClass = Panel;

	return Type.createClass(AboutPanel);
});


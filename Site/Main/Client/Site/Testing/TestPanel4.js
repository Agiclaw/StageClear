/**
 * A base view for any view that displays player information.
 */
define([
	using('Framework.Collections.Collection'),
	using('Framework.UI.Controls.Panel'),
	using('Framework.UI.Interactivity.Interaction'),
	using('Site.Testing.TestBehavior')
], function(Collection, Panel, Interaction, TestBehavior) {
	function TestPanel4(options) {
		Panel.call(this);

		this.setDataContext(this);
	}

	TestPanel4.sourcePath = this.url;
	TestPanel4.baseClass = Panel;

	TestPanel4.prototype.applyTemplate = function() {
		if (this.testPanel) {
			var behaviors = new Collection();
			Interaction.setBehaviors(this.testPanel, behaviors);

			var testBehavior = new TestBehavior();
			behaviors.add(testBehavior);
		}
	}

	return Type.createClass(TestPanel4);
});

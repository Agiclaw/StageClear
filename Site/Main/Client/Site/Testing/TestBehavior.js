/**
 */
define([
	using('Framework.UI.Control'),
	using('Framework.UI.Interactivity.Behavior')
], function(Control, Behavior) {
	function TestBehavior(options) {
		Behavior.call(this, options);

		this.clickHandler = this.onClick.bind(this);
	}

	TestBehavior.sourcePath = this.url;
	TestBehavior.baseClass = Behavior;

	TestBehavior.prototype.onAttached = function() {
		var associatedObject = this.getAssociatedObject();
		var domContainer = Control.getDomElement(associatedObject);

		if (domContainer) {
			domContainer.addEventListener('click', this.clickHandler)
		}
	}

	TestBehavior.prototype.onDetaching = function() {
		var associatedObject = this.getAssociatedObject();
		var domContainer = Control.getDomElement(associatedObject);

		if (domContainer) {
			domContainer.removeEventListener('click', this.clickHandler)
		}
	}

	TestBehavior.prototype.onClick = function(event) {
		var associatedObject = this.getAssociatedObject();
		var domContainer = Control.getDomElement(associatedObject);

		var randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

		domContainer.setStyle("background", randomColor);
	}

	return Type.createClass(TestBehavior);
});

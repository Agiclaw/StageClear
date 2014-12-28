/**
 * A base view for any view that displays player information.
 */
define([
	using('Framework.UI.Control'),
	using('Site.Session.SessionService')
], function(Control, SessionService) {
	function SessionStatusControl(options) {
		Control.call(this, options);
	}

	SessionStatusControl.sourcePath = this.url;
	SessionStatusControl.baseClass = Control;

	return Type.createClass(SessionStatusControl);
});

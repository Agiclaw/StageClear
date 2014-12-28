/**
 * A base view for any view that displays player information.
 */
define([
	using('Framework.UI.Control'),
	using('Site.Session.SessionService')
], function(Control, SessionService) {
	function SessionStatucControl(options) {
		Control.call(this, options);
	}

	SessionStatucControl.sourcePath = this.url;
	SessionStatucControl.baseClass = Control;

	return Type.createClass(SessionStatucControl);
});

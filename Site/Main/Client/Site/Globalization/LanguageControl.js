define([
	using('Framework.RelayCommand'),
	using('Framework.UI.Control')
], function(RelayCommand, Control) {
	function LanguageControl(options) {
		Control.call(this, options);

		this.focusLostEventListener = this.onLanguageListLostFocus.bind(this, window);
	}

	LanguageControl.sourcePath = this.url;
	LanguageControl.baseClass = Control;

	LanguageControl.prototype.onDispose = function() {
		delete this.languageSelectionPopup;
		delete this.languageListToggleButton;

		Control.prototype.onDispose.call(this);
	}

	LanguageControl.prototype.onShowLanguageSelectionPopup = function() {
		// Unfortunately the popup may not be visible when this
		// handler is called so I have to wait a frame before
		// focusing the popup. Attempting to focus it while it
		// is not visible will fail.
		if (this.languageSelectionPopup) {
			var self = this;

			setTimeout(function() {
				self.languageSelectionPopup.focus();
				window.addEventListener("focusout", self.focusLostEventListener);
			}, 1);
		}
	}

	LanguageControl.prototype.onLanguageListLostFocus = function(sender, event) {
		var stillHasFocus = this.languageSelectionPopup && this.languageSelectionPopup.isEqualOrParentOf(event.relatedTarget);

		if (this.languageListToggleButton && !stillHasFocus) {
			this.languageListToggleButton.setIsChecked(stillHasFocus);
			window.removeEventListener("focusout", this.focusLostEventListener);
		}
	}

	return Type.createClass(LanguageControl);
});

/**
 * The form used to login to the site.
 */
define([
	using('Framework.RelayCommand'),
	using('Framework.UI.Form'),
	using('Site.Session.SessionService'),
], function(RelayCommand, Form, SessionService) {
	function LoginForm() {
		Form.call(this);

		this.setDataContext(this);

		this.setProperty(LoginForm.LoginCommandProperty, new RelayCommand({
			execute: this.login.bind(this),
			canExecute: this.canLogin.bind(this)
		}));

		this.setProperty(LoginForm.ResetCommandProperty, new RelayCommand({
			execute: this.reset.bind(this),
			canExecute: this.canReset.bind(this)
		}));

		this.reset();
	}

	LoginForm.sourcePath = this.url;
	LoginForm.baseClass = Form;

	LoginForm.UsernameProperty = new PropertyDescription({
		propertyChangedCallback: function(args) {
			this.onUsernameChanged(args);
		}
	});

	LoginForm.PasswordProperty = new PropertyDescription();
	LoginForm.ErrorMessageProperty = new PropertyDescription();

	LoginForm.StateProperty = new PropertyDescription({
		propertyChangedCallback: function(args) {
			this.onStateChanged(args);
		}
	});

	LoginForm.LoginCommandProperty = new PropertyDescription({
		readOnly: true
	});

	LoginForm.ResetCommandProperty = new PropertyDescription({
		readOnly: true
	});

	LoginForm.prototype.onUsernameChanged = function(args) {
		this.getLoginCommand().update();
	}

	LoginForm.prototype.onStateChanged = function(args) {
		this.getLoginCommand().update();
		this.getResetCommand().update();
	}

	LoginForm.prototype.reset = function() {
		this.setErrorMessage(undefined);
		this.setState(0);
	}

	LoginForm.prototype.canReset = function() {
		return this.getState() == 2;
	}

	LoginForm.prototype.login = function() {
		if (this.getState() != 0) {
			return;
		}

		this.setState(1);

		var self = this;

		var username = this.getUsername();
		var password = this.getPassword();

		SessionService.getInstance().login(username, password).succeeded(function(results) {
			self.close();
		}).failed(function(exception) {
			self.setState(2);
			self.setErrorMessage("Failed to login.\n\n" + exception.message);
		});
	}

	LoginForm.prototype.canLogin = function() {
		var username = this.getUsername();
		var state = this.getState();

		return (state == 0) && (typeof username === "string") && username.length > 0;
	}

	LoginForm.prototype.onFieldKeyUp = function(sender, args) {
		if ((args.keyCode == 13) && this.canLogin()) {
			this.login();
		}
	}

	return Type.createClass(LoginForm);
});

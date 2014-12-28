/**
 * Service used to manage the current session.
 */
define([
	using('Framework.Application'),
	using('Framework.Environment'),
	using('Framework.Net.HttpClient'),
	using('Framework.RelayCommand')
], function(Application, Environment, HttpClient, RelayCommand) {
	function SessionService() {
		DependencyObject.call(this);

		this.sessionCheckTimerId = 0;

		this.setRefreshStatusCommand(new RelayCommand({
			execute: this.refreshStatus.bind(this)
		}));

		this.setLogoutCommand(new RelayCommand({
			execute: this.logout.bind(this)
		}));
	}

	SessionService.sourcePath = this.url;
	SessionService.baseClass = DependencyObject;

	// Perform 5 minute checks of the session.
	SessionService.SessionCheckInterval = 5 * 60 * 1000;

	SessionService.IsLoggedInProperty = new PropertyDescription();
	SessionService.CurrentUsernameProperty = new PropertyDescription();
	SessionService.TimeRemainingProperty = new PropertyDescription();
	SessionService.PermissionsProperty = new PropertyDescription();

	SessionService.RefreshStatusCommandProperty = new PropertyDescription();
	SessionService.LogoutCommandProperty = new PropertyDescription();

	SessionService.getInstance = function() {
		return Application.getContainer().resolve(SessionService);
	}

	SessionService.prototype.login = function(username, password) {
		var callback = SessionService.prototype.onStatusUpdate.bind(this);

		var request = HttpClient.sendPostAsync({
			requestUrl: Environment.getResourcePath("/Session/Login"),
			requestProperties: { username: username, password: password || '' }
		}).completed(callback);

		return request;
	}

	SessionService.prototype.logout = function() {
		var self = this;

		HttpClient.sendPostAsync(Environment.getResourcePath("/Session/Logout")).succeeded(function() {
			clearInterval(self.sessionCheckTimerId);
			self.sessionCheckTimerId = 0;

			self.setIsLoggedIn(false);
			self.setPermissions(undefined);
			self.setCurrentUsername(undefined);
		});
	}

	SessionService.prototype.refreshStatus = function() {
		var callback = SessionService.prototype.onStatusUpdate.bind(this);

		HttpClient.sendGetAsync(Environment.getResourcePath("/Session/Status")).completed(callback);
	}

	SessionService.prototype.onStatusUpdate = function(sender, sessionStatusResponse) {
		var sessionStatus = sessionStatusResponse.content;
		sessionStatus = sessionStatus || {};

		this.setCurrentUsername(sessionStatus.username);
		this.setIsLoggedIn(sessionStatus.isLoggedIn);
		this.setTimeRemaining(sessionStatus.sessionTimeRemaining);
		this.setPermissions(sessionStatus.permissions);

		if (!this.getIsLoggedIn()) {
			// Stop check if they're no longer logged in.
			clearInterval(self.sessionCheckTimerId);
			self.sessionCheckTimerId = 0;
			return;
		}

		// If we haven't already started the status monitor timer, do it
		// now.
		if (this.sessionCheckTimerId == 0) {
			var validator = SessionService.prototype.refreshStatus.bind(this);
			this.sessionCheckTimerId = setInterval(validator, SessionService.SessionCheckInterval);
		}
	}

	SessionService.prototype.hasPermission = function(requiredPermission) {
		var permissions = this.getPermissions();
		if (permissions == undefined || permissions.length == 0) {
			return false;
		}

		for (var i = 0; i < permissions.length; i++) {
			if (permissions[i] == requiredPermission) {
				return true;
			}
		}

		return false;
	}

	return Type.createClass(SessionService);
});

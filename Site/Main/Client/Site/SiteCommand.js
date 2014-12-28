define([
	using('Framework.RelayCommand')
], function(RelayCommand) {
	function SiteCommand(options) {
		options = options || {};

		DependencyObject.call(this, options);

		this.setName(options.name);

		var command = options.command;

		if (typeof command === "function") {
			command = new RelayCommand({
				execute: command
			});
		}

		this.setCommand(command);
	}

	SiteCommand.sourcePath = this.url;
	SiteCommand.baseClass = DependencyObject;

	SiteCommand.NameProperty = new PropertyDescription();
	SiteCommand.CommandProperty = new PropertyDescription();

	return Type.createClass(SiteCommand);
});

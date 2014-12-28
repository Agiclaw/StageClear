/**
 * Standard module definition style. Use an anonymous function for closure so
 * variables don't pollute global/window. Simply define the module.
 */
define([
	using('Framework.Environment'),
    using('Framework.UI.Form')
], function(Environment, Form) {
	function MessageBox(options) {
		Form.call(this, options);

		this.setDataContext(this);
	}

	MessageBox.sourcePath = this.url;
	MessageBox.baseClass = Form;

	MessageBox.ImageProperty = new PropertyDescription();

	MessageBox.TitleProperty = new PropertyDescription({
		defaultValue: "Error"
	});

	MessageBox.MessageProperty = new PropertyDescription();

	MessageBox.showMessageBox = function(title, message, image) {
		var messageBox = new MessageBox({
			title: title,
			image: image || Environment.getResourcePath('/Site/Error.png'),
			message: message
		});

		messageBox.show();
	}

	return Type.createClass(MessageBox);
});

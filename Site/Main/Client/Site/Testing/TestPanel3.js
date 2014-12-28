/**
 * A base view for any view that displays player information.
 */
define([
	using('Framework.RelayCommand'),
	using('Framework.UI.Controls.Panel'),
	using('Framework.UI.Controls.Expander')
], function(RelayCommand, Panel, Expander) {
	function TestPanel3(options) {
		Panel.call(this, options);

		this.setDataContext(this);

		this.setProperty(TestPanel3.ShowObject1CommandProperty, new RelayCommand({
			execute: this.setToObject1.bind(this)
		}));

		this.setProperty(TestPanel3.ShowObject2CommandProperty, new RelayCommand({
			execute: this.setToObject2.bind(this)
		}));

		this.setToObject1();
	}

	TestPanel3.sourcePath = this.url;
	TestPanel3.baseClass = Panel;

	TestPanel3.ObjectValueProperty = new PropertyDescription();

	TestPanel3.ShowObject1CommandProperty = new PropertyDescription({
		readOnly: true
	});

	TestPanel3.ShowObject2CommandProperty = new PropertyDescription({
		readOnly: true
	});

	TestPanel3.prototype.setToObject1 = function() {
		this.setObjectValue({
			player: {
				name: "Bob"
			},
			level: 10,
			email: 'bob@foo.bar',
			array: [10, 20, 30]
		});
	}

	TestPanel3.prototype.setToObject2 = function() {
		this.setObjectValue({
			player: {
				name: "Brenda"
			},
			level: 13,
			email: 'brenda@foo.bar',
			array: [32, 58, 91]
		});
	}

	return Type.createClass(TestPanel3);
});

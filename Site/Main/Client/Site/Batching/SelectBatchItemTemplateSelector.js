define([
	using('Framework.UI.Controls.TemplateSelector'),
	using('Framework.UI.Converters.TemplateConverter')
], function(TemplateSelector, TemplateConverter) {
	function SelectBatchItemTemplateSelector() {
		TemplateSelector.call(this);
	}

	SelectBatchItemTemplateSelector.sourcePath = this.url;
	SelectBatchItemTemplateSelector.baseClass = TemplateSelector;

	SelectBatchItemTemplateSelector.DefaultTemplateProperty = new PropertyDescription({
		coerceValueCallback: function(value) {
			return this.coerceTemplate(value);
		}
	});

	SelectBatchItemTemplateSelector.prototype.selectTemplate = function(item, container) {
		if (item == undefined) {
			return undefined;
		}

		return item.__itemType.getItemTemplate() || this.getDefaultTemplateProperty();
	}

	SelectBatchItemTemplateSelector.prototype.coerceTemplate = function(value) {
		var templateConverter = new TemplateConverter();
		return templateConverter.convert(value);
	}

	return Type.createClass(SelectBatchItemTemplateSelector);
});

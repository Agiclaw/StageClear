define([
	using('Framework.Converter'),
	using('Framework.Environment')
], function(Converter, Environment) {
	function LanguageImageConverter() {
		Converter.call(this);
	}

	LanguageImageConverter.sourcePath = this.url;
	LanguageImageConverter.baseClass = Converter;

	LanguageImageConverter.prototype.convert = function(languageCode) {
		if (!Type.is(languageCode, "string")) {
			return undefined;
		}

		var resource = using('Site.Globalization.Images.' + languageCode, "png");

		return Environment.getResourcePath(resource);
	}

	return Type.createClass(LanguageImageConverter);
});

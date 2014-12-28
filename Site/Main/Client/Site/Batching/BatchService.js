/**
 * This service is used to create and manage a batch of objects that
 * can be processed by actions simultaneously.
 */
define([
	using('Framework.Application'),
 	using('Framework.Environment'),
	using('Framework.RelayCommand'),
 	using('Framework.Collections.Collection'),
	using('Framework.Web.Browser'),
	using('Site.MessageBox'),
	using('Site.Batching.BatchItemType'),
	using('Site.Batching.BatchOperation'),
], function(Application, Environment, RelayCommand, Collection, Browser, MessageBox, BatchItemType, BatchOperation) {
	function BatchService() {
		DependencyObject.call(this);

		this.setProperty(BatchService.ItemTypesProperty, new Collection());

		this.setProperty(BatchService.OperationsProperty, new Collection());

		var itemsCollection = new Collection();

		this.setProperty(BatchService.ItemsProperty, itemsCollection);

		itemsCollection.addCollectionChangedHandler(this.onItemsChanged.bind(this));

		this.setProperty(BatchService.AddItemCommandProperty, new RelayCommand({
			execute: this.addItem.bind(this),
			canExecute: this.canAddItem.bind(this)
		}));

		this.setProperty(BatchService.RemoveItemCommandProperty, new RelayCommand({
			execute: this.removeItem.bind(this),
			canExecute: this.canRemoveItem.bind(this)
		}));

		this.setProperty(BatchService.ClearItemsCommandProperty, new RelayCommand({
			execute: this.clearItems.bind(this),
			canExecute: this.canClearItems.bind(this)
		}));

		this.setProperty(BatchService.ImportItemsCommandProperty, new RelayCommand({
			execute: this.importItems.bind(this),
			canExecute: this.canImportItems.bind(this)
		}));

		this.setProperty(BatchService.ExportItemsCommandProperty, new RelayCommand({
			execute: this.exportItems.bind(this),
			canExecute: this.canExportItems.bind(this)
		}));

		this.updateImage();

		this.itemTypeLookup = {};
		this.itemLookup = {};
	}

	BatchService.sourcePath = this.url;
	BatchService.baseClass = DependencyObject;

	BatchService.ItemTypesProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.OperationsProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.ItemsProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.ImageProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.NoItemsImageProperty = new PropertyDescription({
		defaultValue: Environment.getResourcePath('/Site/Batching/NoItems.png'),
		propertyChangedCallback: function(args) {
			this.onNoItemsImageChanged();
		}
	});

	BatchService.MultiTypeImageProperty = new PropertyDescription({
		defaultValue: Environment.getResourcePath('/Site/Batching/MultiType.png'),
		propertyChangedCallback: function(args) {
			this.onMultiTypeImageChanged();
		}
	});

	BatchService.IsBulkEdittingProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.AddItemCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.RemoveItemCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.ClearItemsCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.ImportItemsCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.ExportItemsCommandProperty = new PropertyDescription({
		readOnly: true
	});

	BatchService.ItemAddedEvent = new EventDescription();
	BatchService.ItemRemovedEvent = new EventDescription();
	BatchService.ItemsClearedEvent = new EventDescription();

	BatchService.ItemsUpdatedEvent = new EventDescription();

	BatchService.getInstance = function() {
		return Application.getContainer().resolve(BatchService);
	}

	BatchService.prototype.registerItemType = function(itemType) {
		if (!(itemType instanceof BatchItemType)) {
			throw "Invalid item type.";
		}

		this.getItemTypes().add(itemType);

		this.itemTypeLookup[itemType.getName()] = itemType;
	}

	BatchService.prototype.addOperation = function(operation) {
		if (!(operation instanceof BatchOperation)) {
			throw "Invalid operation object.";
		}

		this.getOperations().add(operation);
	}

	BatchService.prototype.getItemTypeOf = function(item) {
		var itemTypes = this.getItemTypes().getItems();

		for (var i = 0; i < itemTypes.length; ++i) {
			var itemType = itemTypes[i];

			if (itemType.isInstance(item)) {
				return itemType;
			}
		}

		return undefined;
	}

	BatchService.prototype.hasItemsOfType = function(type) {
		return this.getItems().getItems().some(function(x) {
			return x.__itemType instanceof type;
		});
	}

	BatchService.prototype.getItemsOfType = function(type) {
		return this.getItems().getItems().filter(function(x) {
			return x.__itemType instanceof type;
		});
	}

	BatchService.prototype.containsOnlyItemsOfType = function(type) {
		var items = this.getItems().getItems();

		return (items.length > 0) && !this.getItems().getItems().some(function(x) {
			return !(x.__itemType instanceof type);
		});
	}

	BatchService.prototype.addItem = function(item) {
		var itemType = this.getItemTypeOf(item);

		if (!itemType) {
			return false;
		}

		var stringValue = itemType.toCsv(item);

		if (this.itemLookup[stringValue]) {
			return false;
		}

		var batchRecord = itemType.extractRecord(item);
		this.itemLookup[stringValue] = batchRecord;

		batchRecord.__itemType = itemType;
		this.getItems().add(batchRecord);
		this.getClearItemsCommand().update();
		this.getExportItemsCommand().update();

		this.fireItemAdded({ item: batchRecord });

		return true;
	}

	BatchService.prototype.canAddItem = function() {
		return true;
	}

	BatchService.prototype.removeItem = function(item) {
		var itemType = item.__itemType || this.getItemTypeOf(item);

		if (!itemType) {
			return false;
		}

		var stringValue = itemType.toCsv(item);

		if (!this.itemLookup[stringValue]) {
			return false;
		}

		delete item.__itemType;

		var batchRecord = this.itemLookup[stringValue];
		delete this.itemLookup[stringValue];

		this.getItems().remove(batchRecord);
		this.getClearItemsCommand().update();
		this.getExportItemsCommand().update();

		this.fireItemRemoved({ item: batchRecord });
	}

	BatchService.prototype.canRemoveItem = function() {
		return true;
	}

	BatchService.prototype.clearItems = function() {
		this.itemLookup = {};
		this.getItems().clear();
		this.getClearItemsCommand().update();
		this.getExportItemsCommand().update();
		this.fireItemsCleared({});
	}

	BatchService.prototype.canClearItems = function() {
		return (this.getItems().getLength() > 0);
	}

	BatchService.prototype.containsItem = function(value) {
		var itemType = this.getItemTypeOf(value);

		if (!itemType) {
			return false;
		}

		var stringValue = itemType.toCsv(value);

		return this.itemLookup[stringValue];
	}

	BatchService.prototype.importItems = function() {
		var self = this;

		Browser.openFile(function(selectedFile) {
			if (!selectedFile || !selectedFile.name.endsWith(".csv")) {
				MessageBox.showMessageBox("Import failed", "Invalid file or file not a .csv file");
				return;
			}

			var fileReader = new FileReader();

			fileReader.onload = function(e) {
				self.beginBulkEdit();

				var csv = e.target.result;
				var lines = csv.split(/\n/);

				var errorText = "";
				var errorOccurred = false;

				for (var i = 0; i < lines.length; ++i) {
					var line = lines[i];
					var comma = line.indexOf(",");

					//check if this line is a comment; # in the 0 position of the line.
					var comment = line.indexOf("#");
					if (comment == 0) {
						//it is.  Skip this line.
						continue;
					}

					if (comma >= 0) {
						var itemTypeName = line.substr(0, comma);
						var data = line.substr(comma + 1);

						var itemType = self.itemTypeLookup[itemTypeName];

						if (itemType) {
							var record = itemType.fromCsv(data);

							if (record) {
								self.addItem(record);
							}
							else {
								console.warn("Failed to deserialize \"" + itemType + "\" object: " + data);
								errorOccurred = true;
								errorText += "Failed to deserialize \"" + itemType + "\" object: " + data + "\n";
							}
						}
						else {
							console.warn("Failed to find item type for \"" + itemType + "\" to deserialize: " + data);
							errorOccurred = true;
							errorText += "Failed to find item type for \"" + itemType + "\" to deserialize: " + data + "\n";
						}
					}
				}

				if (errorOccurred) {
					MessageBox.showMessageBox("Import failed", errorText);
				}

				self.endBulkEdit();
			}

			fileReader.readAsText(selectedFile);
		});
	}

	BatchService.prototype.canImportItems = function() {
		return true;
	}

	BatchService.prototype.exportItems = function() {
		var items = this.getItems().getItems();
		var csvContent = "";
		var previousItemType = "";

		//get headers and export

		items.sort(function(a, b) {
			return a.__itemType.getName().localeCompare(b.__itemType.getName());
		});

		for (var i = 0; i < items.length; ++i) {
			if (i > 0) {
				csvContent += "\n";
			}

			var item = items[i];

			if (item.__itemType.getName() != previousItemType) {
				//need to dump headers.
				var csvHeaders = "#ItemType," + item.__itemType.getCsvHeaders();
				csvContent += csvHeaders + "\n";
				previousItemType = item.__itemType.getName();
			}

			csvContent += item.__itemType.getName() + "," + item.__itemType.toCsv(item);
		}

		Browser.downloadFile(csvContent, {
			filename: "SiteBatch.csv",
			type: "text/csv",
			charset: "utf-8"
		});
	}

	BatchService.prototype.canExportItems = function() {
		return (this.getItems().getLength() > 0);
	}

	BatchService.prototype.beginBulkEdit = function() {
		this.setProperty(BatchService.IsBulkEdittingProperty, true);
	}

	BatchService.prototype.endBulkEdit = function() {
		if (this.changed) {
			this.finishEdit();
		}

		this.setProperty(BatchService.IsBulkEdittingProperty, false);

		delete this.changed;
	}

	BatchService.prototype.onItemsChanged = function() {
		if (this.getIsBulkEditting()) {
			this.changed = true;
			return;
		}

		this.finishEdit();
	}

	BatchService.prototype.finishEdit = function() {
		this.fireItemsUpdated({});
		this.updateImage();
	}

	BatchService.prototype.updateImage = function() {
		// Get the raw array.
		var items = this.getItems().getItems();

		var firstItemType;
		var hasMultipleItemTypes;

		for (var i = 0; i < items.length; ++i) {
			var item = items[i];

			if (!firstItemType) {
				firstItemType = item.__itemType;
			}
			else if (firstItemType != item.__itemType) {
				hasMultipleItemTypes = true;
				break;
			}
		}

		var newImage;

		if (items.length == 0) {
			newImage = this.getNoItemsImage();
		}
		else if (hasMultipleItemTypes) {
			newImage = this.getMultiTypeImage();
		}
		else if (items.length > 1) {
			newImage = firstItemType.getMultiItemImage();
		}
		else {
			newImage = firstItemType.getSingleItemImage();
		}

		this.setProperty(BatchService.ImageProperty, newImage);
	}

	BatchService.prototype.onNoItemsImageChanged = function() {
		this.updateImage();
	}

	BatchService.prototype.onMultiTypeImageChanged = function() {
		this.updateImage();
	}

	BatchService.prototype.compareBatchItemsByTypeThenName = function(a, b) {
		var sort = a.__itemType.getName().localeCompare(b.__itemType.getName());

		if (sort == 0) {
			sort = a.__itemType.compare(a, b);
		}

		return sort;
	}

	BatchService.prototype.compareOperationsByGroupThenName = function(a, b) {
		var sort = a.getGroup().localeCompare(b.getGroup());

		if (sort == 0) {
			sort = a.getName().localeCompare(b.getName());
		}

		return sort;
	}

	return Type.createClass(BatchService);
});

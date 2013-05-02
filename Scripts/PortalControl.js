/// <reference path="http://ajax.googleapis.com/ajax/libs/jquery/1.5.2/jquery.min.js" />
/// <reference path="http: //ajax.googleapis.com/ajax/libs/jqueryui/1.8.12/jquery-ui.min.js" />
/// <reference name="MicrosoftAjax.js" assembly="System.Web.Extensions" />
/// <reference path="jquery.timers.min.js" />
/// <reference path="jstorage.js" />
/// <reference path="CommonFunctions.js" />
/// <reference path="Array.js" />
PortalControl = function (windowElement) {
	this.element = windowElement;
	this._service = new Array();

	this._locktimeoutid = null;

	this.get_element = function () {
		return this.element;
	}

	this.set_DataSource = function (value, saveToBrowser, UniversalKey) {
		/// <summary>Saves any underlying data against element.</summary>
		/// <param name="value" type="Object">any value.</param>
		/// <param name="saveToBrowser" type="Boolean">use browser localStorage for caching.</param>
		/// <param name="UniversalKey" type="String">unique key for localStorage reference, otherwise it will use element id</param>
		var key = Exists(UniversalKey) ? UniversalKey : this.get_element().id;
		if(!Exists(this._DataSource)) this._DataSource = [];
		try {
			this._DataSource[key] = value;
			if (saveToBrowser == true) {
				$.jStorage.set(key, value);
			}
		}
		catch (e) {
			//we may have cookies disabled? or we havent done something properly... ignore and behave as usual...
			window.log(e);
		}
	}

	this.get_DataSource = function (UniversalKey) {
		/// <summary>Get the underlying data against element.</summary>
		/// <param name="UniversalKey" type="String">unique key for localStorage reference, otherwise it will use element id</param>
		/// <returns type="Object">underlying data.</returns>
		var key = Exists(UniversalKey) ? UniversalKey : this.get_element().id;
		if (!Exists(this._DataSource) || !Exists(this._DataSource[key])) {
			this.set_DataSource($.jStorage.get(key, null), false, key);
		}
		return this._DataSource[key];
	}

	this.FindDataItem = function (item_to_look_for, property_name, array) {
		/// <summary>following is used to filter an array of objects and returns the item with the provided property equal to the provided this uses binary search so ofcourse, the list must be pre-sorted.</summary>
		/// <param name="item_to_look_for" type="String">field searching for</param>
		/// <param name="property_name" type="String">property to match against</param>
		/// <param name="array" type="Array">data source, otherwise will use the data against the control</param>
		/// <returns type="Object">Data Item found</returns>
		if (array == undefined || array == null) array = myself.get_DataSource(); //thus acts as overload
		var i = array.binarySearch(item_to_look_for,
			function (item) {
				return item[property_name] - item_to_look_for;
			}
		);
		if (i == null) return null;
		else return array[i];
	}

	this._findcontrol = function (name, context) {
		/// <summary>find the first DOM object</summary>
		/// <param name="name" type="String">any part of the id</param>
		/// <param name="context" type="Object">Parent DOM Object to look in, otherwise the base element</param>
		/// <returns type="Object">Dom Object</returns>
		if (context == undefined || context == null) context = this.get_element();
		var control = $(context).find("#" + name)[0];
		if (control == undefined || control == null) control = this._findASPNETcontrol(name, context);
		return control;
	}

	this._findjcontrol = function (name, context) {
		/// <summary>find the first jQuery wrapped DOM object</summary>
		/// <param name="name" type="String">any part of the id</param>
		/// <param name="context" type="Object">Parent DOM Object to look in, otherwise the base element</param>
		/// <returns type="Object">jQuery wrapped Dom Object</returns>
		if (context == undefined || context == null) context = this.get_element();
		var control = $($(context).find("#" + name)[0]);
		if (control[0] == undefined) control = this._findASPNETjcontrol(name, context);
		return control;
	}

	this._findASPNETcontrol = function (name, context) {
		if (context == undefined || context == null) context = this.get_element();
		return $(context).find("*[id*=" + name + "]")[0];
	}

	this._findASPNETjcontrol = function (name, context) {
		if (context == undefined || context == null) context = this.get_element();
		return $($(context).find("*[id*=" + name + "]")[0]);
	}

	this.hide = function () {
		$(this.get_element()).hide();
	}

	this.show = function () {
		$(this.get_element()).show();
	}

	this.get_Service = function (name) {
		if (!name) name = 'default';
		return this._service[name];
	}
	this.set_Service = function (name, value) {
		if (!value) { value = name; name = 'default'; }
		this._service[name] = value;
		this._service[name].set_defaultFailedCallback(this._FailedCallback);
	}

	this.Lock = function (delay) {
		var myself = this;
		if (delay) {
			this._locktimeoutid = setTimeout(function () { myself.Lock(); }, delay);
		} else {
			$(this.get_element()).loading({ align: 'center', text: 'Loading...', mask: true, effect: 'ellipsis update' });
		}
	}

	this.UnLock = function () {
		clearTimeout(this._locktimeoutid);
		$(this.get_element()).loading(false);
	}

	this.LockControl = function (jItem) {
		jItem.loading({ align: 'center', text: 'Loading...', mask: true, effect: 'ellipsis update' });
	}

	this.UnLockControl = function (jItem) {
		jItem.loading(false);
	}

	this._ResetEditor = function (jControl) {
		jControl.find(":input").val("");
		jControl.find(":checkbox").attr('checked', false);
	}

	this._BindElement = function (elementid, value, context) {
		var myself = this;
		if (!context) context = myself.get_element();
		var control = myself._findjcontrol(elementid, context);
		control.val(myself.ReplaceNullWithEmptyString(value));
		return control;
	}

	this.GetElementValue = function (elementid) {
		var myself = this;
		return myself._findjcontrol(elementid).val();
	}

	this.ReplaceNullWithEmptyString = function (value) {
		if (value == null) value = "";
		return value;
	}

	this.Alert = function (stitle, message) {
		var myself = this;

		if (window.alertDiv == undefined) {
			window.alertDiv = $("<div></div>");
			window.alertDiv.dialog({
				modal: true,
				autoOpen: false,
				title: stitle,
				buttons: {
					Ok: function () {
						$(this).dialog('close');
					}
				}
			});
		}

		window.alertDiv.dialog('option', 'title', stitle);

		if (!window.alertDiv.dialog('isOpen')) {
			window.alertDiv.dialog('open');
			window.alertDiv.html(message);
		} else {
			window.alertDiv.html(window.alertDiv.html() + "<br /><br />" + message);
		}
	}

	this.Confirm = function (stitle, message, okbtntext, cancelbtntext, callback) {
		var myself = this;
		var btns = {};
		btns[okbtntext] = function () { $(this).dialog('close').remove(); callback(); };
		btns[cancelbtntext] = function () { $(this).dialog('close').remove(); };
		$("<div></div>").html(message).dialog({
			modal: true,
			title: stitle,
			buttons: btns
		});
	}

	this._FailedCallback = function (error) {

		var stackTrace = error.get_stackTrace();
		var message = error.get_message();
		var statusCode = error.get_statusCode();
		var exceptionType = error.get_exceptionType();
		var timedout = error.get_timedOut();

		$("<div></div>").html("Service Error: " + message + "<br/>" +
		"Status Code: " + statusCode + "<br/>" +
		"Exception Type: " + exceptionType + "<br/>" +
		"Timedout: " + timedout + "<br/>" +
		"Stack Trace: " + stackTrace).dialog({
			modal: true,
			title: 'ERROR!',
			buttons: {
				Ok: function () {
					$(this).dialog('close').remove();
				}
			}
		});
	}

	this.DropDownContainsText = function (dropdown, text) {
		var myself = this;
		var contains = false;
		var dd = myself._findcontrol(dropdown);
		for (var ctr = 0; ctr < dd.options.length; ctr++) {
			if (dd.options[ctr].text == text) {
				contains = true;
				break;
			}
		}
		return contains;
	}

	this.SetLabelText = function (labelid, text, context) {
		var myself = this;
		if (!context) context = myself.get_element();
		var control = myself._findjcontrol(labelid, context);
		control.html(myself.ReplaceNullWithEmptyString(text));
		return control;
	}

	//Following gets or returns a new node instance for a tree control.
	//NOTE: there is no set node, as this creates the instance and appends it to the array
	//so for example the following creates a list/tree out of country state... :
	//var country = _getNode(countryId, "USA", Countries[]);
	//var state = _getNode(StateId, "NY", country.children);
	//obviously this can also be used to find a node.
	this._getNode = function (node_id, name, nodes) {
		var myself = this;
		var node = null;
		//if preexisting set it
		for (var ctr = 0; ctr < nodes.length; ctr++) {
			if (nodes[ctr].attributes.id == node_id) {
				node = nodes[ctr];
				break;
			}
		}
		if (node == null) {
			node =
			{
				attributes: { id: node_id },
				data: name,
				state: "closed",
				children: [ /* an array of child nodes objects */]
			}
			nodes[nodes.length] = node; //add it (here?)
		}
		return node;
	}

	this.DateDeserialize = function (dateStr) {
		return eval('new' + dateStr.replace(/\//g, ' '));
	}

	///following method will trigger provided function after given time... 
	this.AsyncTrigger = function (MillisecondInterval, Callback) {
		var myself = this;
		$(myself.get_element()).oneTime(MillisecondInterval, function () {
			Callback();
		});
	}
	///following meant to remove any triggers
	this.AsyncTriggerRemove = function () {
		var myself = this;
		$(myself.get_element()).stopTime(myself.get_element().id);
	}
}
PortalControl.registerClass('PortalControl', Sys.Component);

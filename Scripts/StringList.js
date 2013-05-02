/// <reference path="jquery-1.4.2.min.js" />
//(function ($) {
//	$.fn.StringList = function (settings) {
//		settings = $.extend({}, $.fn.StringList.defaults, settings);
//		var lists = new Array();
//		return this.each(
//			function () {
//				var $this = $(this);

//			}
//		);
//	};

//	$.fn.StringList.defaults = {
//		stringArray: []
//	};
//})(jQuery);

/// <reference path="PortalControl.js" />
//Datasource expects []{id: 0, value: "hello world"}
//note id can be an object token... we have not yet added delegates to update, or throw upon add and remove etc.
function StringListControl(windowElement) {
	this.inheritFrom = PortalControl;
	this.inheritFrom(windowElement);

	this.Pre_ItemAddedDelegate;//will be provided the data item, and is expected to return true/false
	this.Post_ItemAddedDelegate;
	this.Pre_ItemRemovedDelegate;
	this.Post_ItemRemovedDelegate;

	//invokes service and updates form with data
	this.Update = function (strings) {
		var myself = this;
		myself.Lock();
		myself.Reset();
		if (Exists(strings)) myself.set_DataSource(strings);
		//if (myself.get_DataSource().length > 0) {
		var table = $("<table></table>");
		for (var ctr = 0; ctr < myself.get_DataSource().length; ctr++) {
			var item = myself.get_DataSource()[ctr];
			var tr = $("<tr>")
					.append($("<td>").append(item.value))
					.append($("<td class='ui-state-default ui-corner-all'>")
								.hover(
									function () { $(this).addClass("ui-state-hover"); },
									function () { $(this).removeClass("ui-state-hover"); }
								)
								.append(
									$("<span class='ui-icon ui-icon-minus'></span>")
												.data("itemindex", ctr)
												.data("item", item)
												.click(
													function () {
														if (Exists(myself.Pre_ItemRemovedDelegate) && typeof myself.Pre_ItemRemovedDelegate == 'function') {
															if (myself.Pre_ItemRemovedDelegate($(this).data("item"))) {
																myself.get_DataSource().splice($(this).data("itemindex"), 1);
															}
														}
														else {
															myself.get_DataSource().splice($(this).data("itemindex"), 1);
														}
														if (Exists(myself.Post_ItemRemovedDelegate) && typeof myself.Post_ItemRemovedDelegate == 'function') myself.Post_ItemRemovedDelegate($(this).data("item"));
														myself.Update();
													}
												)
								)
					);
			table.append(tr);
		}
		var newstringinput = $("<input type='text' style='width:100%;'>");
		var tr = $("<tr>")
					.append($("<td>").append(newstringinput))
					.append($("<td class='ui-state-default ui-corner-all'>")
								.hover(
									function () { $(this).addClass("ui-state-hover"); },
									function () { $(this).removeClass("ui-state-hover"); }
								)
								.append(
									$("<span class='ui-icon ui-icon-plus'></span>")
												.click(
													function () {
														var newitem = {
															id: null,
															value: $(this).parent().parent().find("input").val()
														};

														if (Exists(myself.Pre_ItemAddedDelegate) && typeof myself.Pre_ItemAddedDelegate == 'function') {
															if (myself.Pre_ItemAddedDelegate(newitem)) {
																myself.get_DataSource()[myself.get_DataSource().length] = newitem;
															}
														}
														else {
															myself.get_DataSource()[myself.get_DataSource().length] = newitem;
														}
														if (Exists(myself.Post_ItemAddedDelegate) && typeof myself.Post_ItemAddedDelegate == 'function') myself.Post_ItemAddedDelegate(newitem);
														myself.Update();
													}
												)
								)
					);
		table.append(tr);
		$(myself.get_element()).append(table);
		//}
		myself.UnLock();
	}

	//sets default values on user modifiable elements
	this.Reset = function () {
		var myself = this;
		$(myself.get_element()).empty();
	}

	//this method creates default values and adds event handlers
	this.Init = function () {
		var myself = this;
		if (!Exists(myself.get_DataSource())) myself.set_DataSource([]);
	}
}
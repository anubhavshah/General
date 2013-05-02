/// <reference path="jquery.wysiwyg.js" /> 
/// <reference path="../PortalTextbox.js" />

function WYSIWGTextbox(inputElement) {
	this.inheritFrom = Textbox;
	this._InputElement = inputElement;
	this._LabelDiv = null;
	this._OriginalValue = "";
	//    this._ValueChanged = false;
	this._DefaultBlankValue = "&nbsp;&nbsp;&nbsp;";

	this.WYSIWGEditor = null;
	this.DivEditor = null;

	/*--------- Public Instance Methods ----------*/
	this.set_Value = function (value) {
		if (this._OriginalValue.length > 0) {
			var label = this._LabelDiv;
			$(label).effect("highlight", {}, 3000);
			//$(label).addClass('TextBox_Label_ValueChanged', 1000);
			//			$(label).addClass('TextBox_Label_ValueChanged', 1000,
			//				function () {
			//					setTimeout(function () {
			//						$(label).removeClass("TextBox_Label_ValueChanged").show();
			//					}, 1500);
			//				}
			//			);
		}
		else {
			this._OriginalValue = value;
		}
		this._InputElement.value = value;
	}

	this.set_DefaultBlankValue = function (value) {
		this._DefaultBlankValue = value;
	}

	this.get_Value = function () {
		return this._InputElement.value;
	}

	this.HasValueChanged = function () {
		return $(this._LabelDiv).hasClass('TextBox_Label_ValueChanged');
	}

	this.PreLabelShownDelegate = null;
	this.PreInputShownDelegate = null;
	this.PostLabelShownDelegate = null;
	this.PostInputShownDelegate = null;

	/*--------- End Of Public Instance Methods ----------*/

	/*--------- Private Methods ----------*/
	this._DisplayLabel = function () {
		if (Exists(this.PreLabelShownDelegate) && typeof this.PreLabelShownDelegate == 'function') this.PreLabelShownDelegate(this);
		//$(this._InputElement).hide();
		this.DivEditor.hide();
		if (this.get_Value() == "") $(this._LabelDiv).empty().html(this._DefaultBlankValue);
		else {
			//for whatever reason having trouble with handinlg <p> inside content, as we lose styling... 
			//$(this._LabelDiv).empty().html($(this.get_Value()).is("p") ? $(this.get_Value()).first().html() : this.get_Value());
			$(this._LabelDiv).empty().html(this.get_Value());

		}
		$(this._LabelDiv).show();
		if (Exists(this.PostLabelShownDelegate) && typeof this.PostLabelShownDelegate == 'function') this.PostLabelShownDelegate(this);
	}

	this._DisplayInput = function () {
		if (Exists(this.PreInputShownDelegate) && typeof this.PreInputShownDelegate == 'function') this.PreInputShownDelegate(this);
		$(this._LabelDiv).hide();
		//$(this._InputElement).show().focus().trigger('click');
		this.DivEditor.show();
		if (Exists(this.PostInputShownDelegate) && typeof this.PostInputShownDelegate == 'function') this.PostInputShownDelegate(this);
	}

	this._Init = function () {
		var myself = this;
		myself.set_Value(myself._InputElement.value);

		//create label object and add before our input... 
		var text = document.createElement("div");
		text.setAttribute("id", "evotxt_" + myself._InputElement.id);
		//text.style.width = myself._InputElement.offsetWidth + "px";
		$(text).html($(myself._InputElement).val()).addClass("TextBox_Label");

		$(myself._InputElement).wrap(myself.DivEditor);
		myself.DivEditor = $(myself._InputElement).wrap("<div id='wysiwg_container'>").parent();
		myself.WYSIWGEditor = $(myself._InputElement).wysiwyg(
			{
				controls:
				{
					html: { visible : true },
					increaseFontSize: { visible: true },
					decreaseFontSize: { visible: true },
					insertTable: { visible: true },
					cut: { visible: true },
					copy: { visible: true },
					paste: { visible: true }
				}
			}
		);


		myself._LabelDiv = text;
		$(myself.DivEditor).before(text);
		//$(text).width($(myself._InputElement).width());

		//event handling... 
		$(myself._LabelDiv).click(
			function () {
				myself._DisplayInput();
			}
		);

		//The following commented out because we are displaying a div control... instead of original text area....
		//		$(myself._InputElement).blur(
		//            function () {
		//            	myself.set_Value(myself._InputElement.value);
		//            	myself._DisplayLabel();
		//            }
		//        );

		myself.DivEditor.hover(function () {
			myself.mouse_is_inside = true;
		}, function () {
			myself.mouse_is_inside = false;
		});

		//consider unbind after showing label to prevent further mouse conditionals.. but the cost is too minimal
		$("body").mouseup(function () {
			if (Exists(myself.mouse_is_inside) && !myself.mouse_is_inside && myself.DivEditor.is(":visible")) {
				myself.set_Value(myself._InputElement.value);
				myself._DisplayLabel();
			}
		});


		myself._DisplayLabel();
	}
	/*--------- End Of Private Methods ----------*/

	this._Init();
}
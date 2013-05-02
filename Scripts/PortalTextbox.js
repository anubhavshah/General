/// <reference path="jquery-1.4.2.min.js" />
/// <reference name="MicrosoftAjax.js" assembly="System.Web.Extensions" />
/*
This toggles betweeen label and input text control... 
    
usage: $("input").PortalTextbox(); //this will find and apply evotextbox to all elements of type input!
*/
jQuery.fn.PortalTextbox=PortalTextboxCreator;

function PortalTextboxCreator() {
    var textboxes = new Array();
	for(var i=0; i < this.length; i++) 
	{
		textboxes[i] = new Textbox(this[i]);
	}
	return(textboxes);
}

function Textbox(inputElement)
{
    this._InputElement = inputElement;
    this._LabelDiv = null;
    this._OriginalValue = "";
//    this._ValueChanged = false;
	this._DefaultBlankValue = "&nbsp;&nbsp;&nbsp;";
    
    /*--------- Public Instance Methods ----------*/
    this.set_Value = function(value)
    {
        if(this._OriginalValue.length > 0)
        {
            if(this._OriginalValue != value) $(this._LabelDiv).addClass('EVOTextBox_Label_ValueChanged');
            else $(this._LabelDiv).removeClass('EVOTextBox_Label_ValueChanged');
        }
        else
        {
           this._OriginalValue = value;
        }
        this._InputElement.value = value;
    }

	this.set_DefaultBlankValue = function(value)
    {
        this._DefaultBlankValue = value;
    }
    
    this.get_Value = function()
    {
        return this._InputElement.value;
    }
    
    this.HasValueChanged = function()
    {
        return $(this._LabelDiv).hasClass('EVOTextBox_Label_ValueChanged');
    }
    
    /*--------- End Of Public Instance Methods ----------*/
    
    /*--------- Private Methods ----------*/
    this._DisplayLabel = function()
    {
        $(this._InputElement).hide();
		if(this.get_Value() == "") $(this._LabelDiv).empty().html(this._DefaultBlankValue);
		else $(this._LabelDiv).empty().html(this.get_Value());
        $(this._LabelDiv).show();
    }
    
    this._DisplayInput = function()
    {
        $(this._LabelDiv).hide();
        $(this._InputElement).show().focus().trigger('click');
    }

    this._Init = function () {
        var myself = this;
        myself.set_Value(myself._InputElement.value);

        //create label object and add before our input... 
        var text = document.createElement("div");
        text.setAttribute("id", "evotxt_" + myself._InputElement.id);
        //text.style.width = myself._InputElement.offsetWidth + "px";
        $(text).html($(myself._InputElement).val()).addClass("EVOTextbox_Label");
        myself._LabelDiv = text;
        $(myself._InputElement).before(text);
        //$(text).width($(myself._InputElement).width());

        //event handling... 
        $(myself._LabelDiv).click(
            function () {
                myself._DisplayInput();
            }
        );

        $(myself._InputElement).blur(
            function () {
                myself.set_Value(myself._InputElement.value);
                myself._DisplayLabel();
            }
        );

        $(myself._InputElement).keypress(
            function (e) {
                if (e.which == Sys.UI.Key.enter || e.which == Sys.UI.Key.esc) $(myself._InputElement).trigger('blur');
            }
        );

        myself._DisplayLabel();
    }
    /*--------- End Of Private Methods ----------*/

    this._Init();
}

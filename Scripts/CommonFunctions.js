
//#region BoilerPlate Plugins.js

// usage: log('inside coolFunc', this, arguments);
// paulirish.com/2009/log-a-lightweight-wrapper-for-consolelog/
window.log = function f() { log.history = log.history || []; log.history.push(arguments); if (this.console) { var args = arguments, newarr; args.callee = args.callee.caller; newarr = [].slice.call(args); if (typeof console.log === 'object') log.apply.call(console.log, console, newarr); else console.log.apply(console, newarr); } };

// make it safe to use console.log always
(function (a) { function b() { } for (var c = "assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","), d; !!(d = c.pop()); ) { a[d] = a[d] || b; } })
(function () { try { console.log(); return window.console; } catch (a) { return (window.console = {}); } } ());


// place any jQuery/helper plugins in here, instead of separate, slower script files.



//#endregion


//allows you to format to money.
// c = decimal places
// d = decimal separator
// t = thousands separator
// sign = dollar sign string
Number.prototype.formatMoney = function (c, d, t, sign, negL, negR, negSign) {
	if (sign == undefined) sign = "$";
	if (negL == undefined) negL = "";
	if (negR == undefined) negR = "";
	if (negSign == undefined) negSign = "-";

	var o = this;
	var n = this;
	c = isNaN(c = Math.abs(c)) ? 2 : c;
	d = d == undefined ? "," : d;
	t = t == undefined ? "." : t;
	var s = n < 0 ? negSign : "";
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "";
	var j = (j = i.length) > 3 ? j % 3 : 0;

	return (o < 0 ? negL : "") + sign + s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "") + (o < 0 ? negR : "");
};


function Exists(element) {
	return element != undefined && element != null;
}

function CloneObject(obj) {
	var newObj = (obj instanceof Array) ? [] : {};
	for (i in obj) {
		if (i == 'clone') continue;
		if (obj[i] && typeof obj[i] == "object") {
			newObj[i] = CloneObject(obj[i]);
		} else newObj[i] = obj[i]
	} return newObj;
}


function getQuerystring(key, default_) {
	if (default_ == null) default_ = "";
	key = key.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regex = new RegExp("[\\?&]" + key + "=([^&#]*)");
	var qs = regex.exec(window.location.href);
	if (qs == null)
		return default_;
	else
		return qs[1];
}

var NN4 = document.layers? true : false; //Netscape Navigator 4.x.
var IE4 = document.all? true : false; // IE version 4 and above.


function ToggleButton(buttonId, stateElementId)
{
	var txtBox = document.getElementById(buttonId);
	var hf_txtBox = document.getElementById(stateElementId);
	if(txtBox.disabled)
	{
		txtBox.value = "";
		txtBox.style.borderWidth = "medium";
		txtBox.disabled = false;
		hf_txtBox.value = false;
		txtBox.focus();
		//txtBox.style.visibility = "visible";
	}
	else
	{
		txtBox.value = "Ignore";
		txtBox.style.borderWidth = 0;
		txtBox.disabled = true;
		hf_txtBox.value = true;
		//txtBox.style.visibility = "hidden";
	}
}
function ToggleSelect(SelectId, stateElementId)
{
	var ddl = document.getElementById(SelectId);
	var hf_ddl = document.getElementById(stateElementId);
	if(ddl.disabled)
	{
		removeOptionAtTop(ddl);
		ddl.selectedIndex = 0;
		ddl.disabled = false;
		hf_ddl.value = false;
	}
	else
	{
		insertOptionAtTop(ddl);
		ddl.selectedIndex = 0;
		ddl.disabled = true;
		hf_ddl.value = true;
	}
}
function ToggleCheckBox(BoxId, stateElementId)
{
	var cb = document.getElementById(BoxId);
	var hf_cb = document.getElementById(stateElementId);
	
	if(cb.disabled)
	{
		cb.checked = true;
		cb.disabled = false;
		hf_cb.value = false;
		cb.style.borderWidth = "medium";
		cb.focus();
	}
	else
	{
		cb.checked = true;
		cb.disabled = true;
		hf_cb.value = true;
	}
}

function CheckAll(container,AllCheckBoxId)
{
	var ParentElement = document.getElementById(container);
	var maincheckbox = document.getElementById(AllCheckBoxId);
	var checkboxes = ParentElement.getElementsByTagName("input");
	
	var value = maincheckbox.checked;
		
	for(i=0; i<checkboxes.length; i++)
	{
		if(checkboxes[i].type=="checkbox") checkboxes[i].checked=value;
		changeColor(checkboxes[i]);
	}
}

function DisableInputs(obj)
{
	var ParentElement = getParentElement(obj,"DIV");
	var childElements = ParentElement.getElementsByTagName("input");
	
	for(i=0; i < childElements.length; i++) 
	{
		switch(childElements[i].type)
		{
			case "checkbox":
				childElements[i].disabled = true;
				break;
			case "text":
				childElements[i].disabled = true;
				childElements[i].value = "Ignore";
				childElements[i].style.borderWidth = 0;
				break;
			case "hidden":
				childElements[i].value = true;
				break;
			default:
				break;
		}
	}
	
	//need to handle textareas seperately!?
	var childElements = ParentElement.getElementsByTagName("textarea");
	for(i=0; i < childElements.length; i++) 
	{
		childElements[i].disabled = true;
		childElements[i].value = "Ignore";
		childElements[i].style.borderWidth = 0;
	}
	
	//need to handle selects seperately!?
	var childElements = ParentElement.getElementsByTagName("select");
	for(i=0; i < childElements.length; i++) 
	{
		childElements[i].disabled = true;
		insertOptionAtTop(childElements[i]);
		childElements[i].selectedIndex = 0;
	}

}


function changeColor(obj) 
{       
	var rowObject = getParentElement(obj,"TR");     
	if(obj.checked) 
	{              
		rowObject.style.fontWeight = 'Bold';
	}
	else 
	{
		rowObject.style.fontWeight = 'Normal'; 
	}
}

function changeTextFont(columnobj) 
{       
	if(columnobj.style.fontWeight == "Normal") 
	{              
		columnobj.style.fontWeight = 'Bold';
	}
	else 
	{
		columnobj.style.fontWeight = 'Normal'; 
	}
}



function isFireFox() 
{
	return navigator.appName == "Netscape"; 
}

function getParentElement(obj,sElementTag) 
{ 
	do 
	{
		if(isFireFox()) 
		{
			obj = obj.parentNode; 
		}
		else {
		obj = obj.parentElement; 
		}
	}
	while(obj.tagName != sElementTag) 
   
   return obj;   
} 

function ToggleVisibility(id, CheckBoxesDivId) {
	var e = document.getElementById(id);
	//look for any checked cb's...
	var ParentElement = document.getElementById(CheckBoxesDivId);
	var checkboxes = ParentElement.getElementsByTagName("input");
	
	var Checked = false;

	for(i=0; i<checkboxes.length; i++)
	{
		if(checkboxes[i].type=="checkbox")
		{
			if(checkboxes[i].checked)
			{
				Checked = true;
				i = checkboxes.length;
			}
		}
	}   
	
	//if(Checked) alert("found checked!");
	//else alert("found UN checked!");

	if (NN4) 
	{
	// the code to display a layer in NN 4.x
	  if (Checked) {
		 e.style.visibility = "show";
	  } else {
		 e.style.visibility = "hidden";
	  }    
	}
	else if (IE4 || isFireFox()) {
	// the code to display a layer in IE 4 and above
	  if (Checked) {
		 e.style.visibility = "visible";
	  } else {
		 e.style.visibility = "hidden";
	  }
	}
	else{
	// the code to display a layer in IE 4 and above
	alert("browser may not be supported!");
	  if (Checked) {
		 e.style.visibility = "visible";
	  } else {
		 e.style.visibility = "hidden";
	  }
	}
}

function insertOptionAtTop(x)
{
	var y=document.createElement('option');
	y.text="Ignore";
	var sel=x.options[0];  
	try
	  {
		x.add(y,sel);  // standards compliant
	  }
	catch(ex)
	  {
		x.add(y,0); //IE
	  }
}

function removeOptionAtTop(x)
  {
	var sel=x.options[0];  
	if(sel.text == "Ignore")  x.remove(0);
  }
  
  
function CheckNumericKeyInfo($char, $mozChar) { 
	//alert("char is: " + $char + " $mozChar: " + $mozChar);
  if($mozChar != null) { // Look for a Mozilla-compatible browser 
	if(($mozChar >= 48 && $mozChar <= 57) || $mozChar == 0 || $char == 
8 || $mozChar == 13) $RetVal = true; 
	else { 
	  $RetVal = false; 
	  alert('Please enter a numeric value.'); 
	} 
  } 
  else { // Must be an IE-compatible Browser 
	if(($char >= 48 && $char <= 57) || $char == 13) $RetVal = true; 
	else { 
	  $RetVal = false; 
	  alert('Please enter a numeric value.'); 
	} 
  } 
  return $RetVal; 
}

function bindDropDownList(listElement, items) {
	listElement.options.length = 0;
	for (ctr = 0; ctr < items.length; ctr++) {
		listElement.options[ctr] = new Option(items[ctr].Text, items[ctr].Value);
	}
}

// gets the contents of a select list as an array of WebTemplate.ListOption
function getDropDownListSelection(listElement) {
	var items = new Array();
	for (var ctr = 0; ctr < listElement.options.length; ctr++) {
		if (listElement.options[ctr].selected) {
			Array.add(items, listElement.options[ctr]);
		}
	}
	return items;
}
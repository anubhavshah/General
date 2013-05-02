
/*
   This control expects an Array data source defined as [Id, Label, Object] where object represents the underlying DataItem
*/
function PortalCheckboxListControl(windowElement)
{
    this.inheritFrom = PortalControl;
    this.inheritFrom(windowElement);
    
    this.GetSelectedItems = function()
    {
        var myself = this;
        var checkedItems = $(myself.get_element()).find(":checked");
        var selectedItems = new Array();
        for (var ctr = 0; ctr < checkedItems.length; ctr++)
        {
            var checkbox = checkedItems[ctr];
            selectedItems[selectedItems.length] = $(checkbox).data("dataitem");
        }
        return selectedItems;
    }

    //expects array of id's/checkbox id's
    this.SetSelectedItems = function(itemIds)
    {
        var myself = this;
        myself.ResetEditor();
        var allCheckboxes = $(myself.get_element()).find(":checkbox");
        for (var ind = 0; ind < allCheckboxes.length && itemIds.length > 0; ind++)
        {
            var checkbox = allCheckboxes[ind];
            var itemFoundIndex = -1;//will be used to remove the found item to avoid unnecessary iterations.
            for (var ctr = 0; ctr < itemIds.length; ctr++)
            {
                if(checkbox.id == itemIds[ctr])
                {
                    itemFoundIndex = ctr;
                    $(checkbox).attr("checked", true);
                    break;
                }
            }
            if(itemFoundIndex != -1) itemIds.splice(itemFoundIndex, 1);
        }
    }
    
    this.ResetEditor = function()
    {
        var myself = this;
        myself._ResetEditor($(myself.get_element()));//invoke base
    }
    
    this.DataBind = function()
    {
        var myself = this;
        //$(myself.get_element()).empty();
        var table = document.createElement("table");
        for (var ctr = 0; ctr < myself.get_DataSource().length; ctr++)
        {
            var id = myself.get_DataSource()[ctr][0];
            var label = myself.get_DataSource()[ctr][1];
            var dataitem = myself.get_DataSource()[ctr][2];
            var tr = document.createElement("tr");
            var td = document.createElement("td");
            var checkboxInput = document.createElement("input");
            checkboxInput.setAttribute("type", "checkbox");
            checkboxInput.setAttribute("id", id);
            $(checkboxInput).data("dataitem", dataitem);
            td.appendChild(checkboxInput);
            td.appendChild(document.createTextNode(label.toString()));
            tr.appendChild(td);
            table.appendChild(tr);
            $(table).addClass("CheckboxListControl");
        }
        if($.browser.msie && parseInt($.browser.version, 10) <= 7) $($(myself.get_element())[0]).html(table.outerHTML);
        else myself.get_element().appendChild(table);
    }
    
    this.Init = function()
    {
        var myself = this;
        myself.set_DataSource(new Array());
    }
}

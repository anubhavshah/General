//courtesy of: http://www.dweebd.com/javascript/binary-search-an-array-in-javascript/
//ex. usage: myself.get_DataSource()[myself.get_DataSource().binarySearch(1044, function(item, find) { return item.Id - find; })]
Array.prototype.binarySearch = function binarySearch(find, comparator) {
  var low = 0, high = this.length - 1,
      i, comparison;
  while (low <= high) {
    i = parseInt((low + high) / 2, 10);
    comparison = comparator(this[i], find);
    if (comparison < 0) { low = i + 1; continue; };
    if (comparison > 0) { high = i - 1; continue; };
    return i;
  }
  return null;
};

//following courtesy of: http://en.wikipedia.org/wiki/Quicksort
Array.prototype.swap=function(a, b)
{
	var tmp=this[a];
	this[a]=this[b];
	this[b]=tmp;
}



Array.prototype.QuickSort = function (predicate)
{
    new SortFunctions().qsort(this, 0, this.length, predicate);
}

function SortFunctions()
{
    this.partition = function (array, begin, end, pivot, predicate) {
        var piv = array[pivot];
        array.swap(pivot, end - 1);
        var store = begin;
        var ix;
        for (ix = begin; ix < end - 1; ++ix) {
            if (typeof predicate == 'function') {
                if (predicate(array[ix]) <= predicate(piv)) {
                    array.swap(store, ix);
                    ++store;
                }
            }
            else {
                if (array[ix] <= piv) {
                    array.swap(store, ix);
                    ++store;
                }                
            }
        }
        array.swap(end - 1, store);

        return store;
    }

	this.qsort = function (array, begin, end, predicate)
    {
        var myself = this;
	    if(end-1>begin) {
		    var pivot=begin+Math.floor(Math.random()*(end-begin));

		    pivot=myself.partition(array, begin, end, pivot, predicate);

		    myself.qsort(array, begin, pivot, predicate);
		    myself.qsort(array, pivot + 1, end, predicate);
	    }
    }
}

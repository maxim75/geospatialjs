var GeospatialJS = GeospatialJS || {};

GeospatialJS.format = function(formatString) {
    var args = arguments;

    return formatString.replace(/{(\d+)}/g, function (match, number) {
        var idx = parseInt(number, 10)+1;
        return typeof args[idx] != 'undefined' ? args[idx] : match;
    });
};

GeospatialJS.formatNum = function(value, precision, options) {
  var defaultOptions = { 
    "thousandSeparator": ",",
    "decimalSeparator": "."
  };
  var opt = $.extend({}, defaultOptions, options);
  var f = "";
  if(precision && precision > 0)
    f = opt.decimalSeparator + value.toFixed(precision).slice(-precision); 
  return value.toFixed(2).slice(0,-3).replace(/(?=(?!^)(?:\d{3})+(?!\d))/g, opt.thousandSeparator) + f;
};
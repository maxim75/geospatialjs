// GeospatialJS
/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function(mod) {
    "use strict";

    mod.GeolocationCode = (function() {

        var baseSequence =  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

        var toBase = function (decimal) {
            var symbols = baseSequence.split("");
            var base = baseSequence.length;
            var conversion = "";

            if (base > symbols.length || base <= 1) {
                return false;
            }

            while (decimal >= 1) {
                conversion = symbols[(decimal - (base * Math.floor(decimal / base)))] + 
                             conversion;
                decimal = Math.floor(decimal / base);
            }

            return (base < 11) ? parseInt(conversion, 10) : conversion;
        };

        var fromBase = function(string) {
            var symbols = baseSequence.split("");
            var base = baseSequence.length;

            var digits = string.split("");
            var number = 0;
            var multiplier = 1;

            for(var i = digits.length-1; i >=0; i--) {
                var digit = digits[i];

                number += symbols.indexOf(digit) * multiplier;
                multiplier = multiplier*base;
            }

            return number;
        };

        var pad = function(string, length) {
          if (string.length < length) { 
            string = (new Array(length).join("0")+string).slice(-length); 
          }
          return string;
        };

        var parseCode =  function(code) {
            var idWithCheckDigit = fromBase(code.replace(/^GEO/, ''));
            var id = parseInt((""+idWithCheckDigit).replace(/[_0-9]$/, ''), 10);
            var checkDigit = idWithCheckDigit % 10;
            var isValid = ISO7064Mod11_10Check.computeCheck(""+id) == checkDigit;
            var lat = Math.floor(id/10000000)/10000-90;
            var lng = id%10000000/10000-180;
            return [ lat, lng ];
        };

        return {
            getCode: function(plat, plng) {
                var lat = parseFloat(plat);
                var lng = parseFloat(plng);

                if(isNaN(lat) || isNaN(lng) || plat < -90 || plat > 90 || plng < -180 || plng > 180) return "";
                var latInt = Math.floor((parseFloat(plat)+90)*10000);
                var lngInt = Math.floor((parseFloat(plng)+180)*10000);

                var id = lngInt + latInt * 10000000;
                var checkDigit = ISO7064Mod11_10Check.computeCheck(""+id);
                var idWithCheckDigit = id * 10 + checkDigit;
                return "GEO"+pad(toBase(idWithCheckDigit), 8);
            },

            parseCode: parseCode,

            findCodes: function(string) {

                var reg = /GEO[a-zA-Z0-9]{8}/g;
                var matches = [], found;
                while ((found = reg.exec(string))) {
                    matches.push(parseCode(found[0]));
                    //reg.lastIndex -= found[0].split(':')[1].length;
                }
                return matches;
            }
        };
    }());

    /* 3rd party code */

    /* CheckISO7064Mod11_1.js  Version 1.0.0  24-Jun-05
     * http://modp.com/release/checkdigits/
     * Copyright 2005, Nick Galbreath.  All Rights Reserved.
     * Terms of use: standard BSD License at http://modp.com/license-bsd.txt
     * or http://www.opensource.org/licenses/bsd-license.php
     */

    function ISO7064Mod11_10Check() {}

    ISO7064Mod11_10Check.encode = function (str) {
      return str + this.computeCheck(str);
    };

    ISO7064Mod11_10Check.verify = function (str) {
      var t = 10;
      for (var i = 0; i < str.length -1; ++i) {
        var c = str.charCodeAt(i) - 48;
        if (c < 0 || c > 9) return false;
        t = (2 * this.f(t+c)) % 11;
      }
      return (((t + this.getCheckDigit(str)) % 10) == 1);
    };

    /**
     * "private" helper function
     */
    ISO7064Mod11_10Check.f = function (x) {
      var val = x % 10;
      return (val === 0) ? 10 : val;
    };

    ISO7064Mod11_10Check.computeCheck = function (str) {
      var t = 10;
      for (var i = 0; i < str.length; ++i) {
        t = (2 * this.f(t + str.charCodeAt(i) - 48)) % 11;
      }
      return (11 - t) % 10;
    };

    ISO7064Mod11_10Check.getCheckDigit = function (str) {
      return str.charCodeAt(str.length - 1) - 48;
    };

    ISO7064Mod11_10Check.getData = function (str) {
      return str.substring(0, str.length - 1);
    };

})(GeospatialJS);;/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function(mod) {
    "use strict";

    mod.LatLng = function(data)
    {
        var self = this;

        if(data instanceof Array) {
            if(data.length != 2) {
                throw "Array with two elements expected";
            }
            if(typeof data[0] !== "number" || typeof data[1] !== "number") {
                throw "Float values expected";
            }

            self.lat = ko.observable(data[0]);
            self.lng = ko.observable(data[1]);
        }
        else if(data && data.lat && data.lng)
        {
            if(typeof data.lat !== "number" || typeof data.lng !== "number") {
                throw "Float values expected";
            }
            self.lat = ko.observable(data.lat);
            self.lng = ko.observable(data.lng); 
        }
        else
        {
            self.lat = ko.observable(0);
            self.lng = ko.observable(0);    
        }


        self.display = function()
        {
            var ew = self.lng() < 0 ? "W" : "E";
            var ns = self.lat() < 0 ? "S" : "N";
            
            return mod.format("{0}\u00a0{1} {2}\u00a0{3}", 
                Math.abs(mod.formatNum(self.lat(), 4)), 
                ns, 
                Math.abs(mod.formatNum(self.lng(), 4)),
                ew
            );
        };

        self.distance = function(point)
        {
            var toRad = function(value) { return value * Math.PI / 180; };
            
            if(!(point instanceof mod.LatLng))
                throw "GeospatialJS.LatLng object expected";
            
            var R = 6371; // km
            var dLat = toRad((point.lat()-this.lat()));
            var dLon = toRad((point.lng()-this.lng()));
            var lat1 = toRad(this.lat());
            var lat2 = toRad(point.lat());
            
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            return d;
        };

        self.toDms = function(deg) {
            var d = parseInt(deg, 10);
            var md = Math.abs(deg-d) * 60;
            var m = parseInt(md, 10);
            var sd = (md - m) * 60;
            return [d, m, sd];
        };

        self.toJS = function() {
            return { lat: self.lat(), lng: self.lng() };
        };

        self.toDmsFormat =  function(deg) {
            var dms = self.toDms(deg);
            return GeospatialJS.format("{0}\xB0 {1}\u2032 {2}\u2033", Math.abs(dms[0]), dms[1], dms[2].toFixed(2) );
        };

        self.displayDms = ko.computed(function(glatlng)
        {
            var ew = self.lng() < 0 ? "W" : "E";
            var ns = self.lat() < 0 ? "S" : "N";
            
            return GeospatialJS.format("{0} {1} {2} {3}", 
                self.toDmsFormat(self.lat()),
                ns, 
                self.toDmsFormat(self.lng()),
                ew
            );
        });

        self.displayDec = ko.computed(function(glatlng)
        {
            return self.display();
        });

        self.latlng = ko.computed(function() {
            return { lat: self.lat(), lng: self.lng() };
        });

        self.str = function(glatlng)
        {
            return "" + self.lat()  + "," + self.lng();
        };

        self.distanceDisplay = function(point)
        {
            var dist = this.distance(point);
            return (dist >= 1) ?  GeospatialJS.format("{0} {1}", GeospatialJS.formatNum(dist, 1), "km")
                : GeospatialJS.format("{0} {1}", GeospatialJS.formatNum(dist*1000), "m");
        };

        self.gridId = function() {
            return Math.round((90*100+Math.floor(self.lat()*100))*100000 + 180*100+Math.floor(self.lng()*100));
        };

        self.geolocatorLink = function()
        {
            return GeospatialJS.format("http://tools.freeside.sk/geolocator/geolocator.html?q={0},{1}",
                self.lat(), self.lng()
            );  
        };

        self.mapLink = function(lang)
        {
            return GeospatialJS.format("/map/{0},{1}/15/{2}", (""+self.lat()).replace(",", ".") , (""+self.lng()).replace(",", "."), lang ? lang : "en");
        };

        self.NS = function() {
            return self.lat() >= 0 ? "N" : "S";
        };

        self.EW = function() {
            return self.lng() >= 0 ? "E" : "W";
        };

        self.geohackLink = function()
        {
            return GeospatialJS.format("http://toolserver.org/~geohack/geohack.php?params={0}_{1}_{2}_{3}",
                Math.abs(self.lat()), self.NS(), Math.abs(self.lng()), self.EW()
            );  
        };

        self.geocodeLink = ko.computed(function() {
             return GeospatialJS.format("https://geolocation.ws/{0}", mod.GeolocationCode.getCode(self.lat(),self.lng()));
        });
    };
})(GeospatialJS);;/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

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
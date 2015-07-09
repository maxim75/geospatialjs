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

})(GeospatialJS);
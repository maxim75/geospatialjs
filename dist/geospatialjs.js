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

    mod.BoundingBox = function() {
        var self = this;

        self.north = ko.observable();
        self.east = ko.observable();
        self.south = ko.observable();
        self.west = ko.observable();

        self.setFromLocations = function(locations) {

            self.north = ko.observable(-90);
            self.east = ko.observable(-180);
            self.south = ko.observable(90);
            self.west = ko.observable(180);

            locations.forEach(function(x) {
                if(x.lat() < self.south()) self.south(x.lat());
                if(x.lng() < self.west()) self.west(x.lng());
                if(x.lat() > self.north()) self.north(x.lat());
                if(x.lng() > self.east()) self.east(x.lng());
            });
        };
    };

})(GeospatialJS);
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

    mod.GeolocationBrowserApi = {
        setLocationUpdates: function(func) {
            var onUpdate = function(position)
            {
                if(!position)
                    pubsub.publish("location", [null]);
                else
                {
                    var lat = parseFloat((position.coords) ? new String(position.coords.latitude) : position.x);
                    var lng = parseFloat((position.coords) ? new String(position.coords.longitude) : position.y);

                    func({
                        loc: new mod.LatLng([lat, lng]),
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        speed: position.coords.speed,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        date: moment.utc()
                    });
                }
            };

            if(navigator.geolocation)
                navigator.geolocation.watchPosition( 
                    onUpdate,
                    function(error) { },
                    {
                    maximumAge: 10000,
                    timeout: 5000,
                    enableHighAccuracy: true
            });
        }
    };

})(GeospatialJS);
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
/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function (mod) {
    "use strict";

    mod.GpxTrack = function(trackXml) {
        var self = this;

        self.getClosestPoint = function(timestamp) {

            var segment = self.findSegmentByTimestamp(timestamp);
            if(!segment) return null;

            return self.getClosestPointResursive(timestamp, segment, 0, segment.points.length-1, 0);
        };

        self.getClosestPointResursive = function(timestamp, segment, startIdx, endIdx, rec) {
            
            if(rec > 10) return null; 
            var idx = startIdx + Math.floor((endIdx - startIdx)/2);
            var point = segment.points[idx];
        
            if(endIdx-startIdx < 4 || point.time == timestamp) 
            {
                var maxDelta = 1000000000;
                for(var i = startIdx; i <= endIdx; i++)
                {
                    var delta = Math.abs(timestamp - segment.points[i].time);
                    if(delta < maxDelta)
                    {
                        point = segment.points[i];
                        maxDelta = delta;
                    }
                }
                return point;
            }
            
            if(point.time > timestamp)
            {
                return self.getClosestPointResursive(timestamp, segment, startIdx, idx, rec+1);
            }
            else
            {
                return self.getClosestPointResursive(timestamp, segment, idx, endIdx, rec+1);
            }
        };

        self.findSegmentByTimestamp = function(timestamp) {
            if(!timestamp) return null;
            return _(self.segments).find(function(segment) {
                return timestamp.unix() >= segment.startTime.unix() && timestamp.unix() <= segment.endTime.unix();
            });
        };

        self.startTime = function() { 
            var self = this;

            return self.segments.length > 0 ? 
                self.segments[0].startTime
                : null;
        }; 

        self.endTime = function() { 
            var self = this;

            return self.segments.length > 0 ? 
                self.segments[self.segments.length-1].endTime
                : null;
        }; 

        //-- init

        var idx = 0;
        self.segments = _(trackXml.getElementsByTagName("trkseg")).map(function(x) { 
            return new mod.TrackSegment(x, idx++, self); 
        });


    };
}(GeospatialJS));


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

        self.NS = function() {
            return self.lat() >= 0 ? "N" : "S";
        };

        self.EW = function() {
            return self.lng() >= 0 ? "E" : "W";
        };
    };
})(GeospatialJS);
/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function (mod) {
    "use strict";

    mod.TrackPoint = function(xmlNode, index, segment) {
        var self = this;

        self.index = index;
        self.segment = segment;
        self.lat = parseFloat(xmlNode.getAttribute("lat"));
        self.lng = parseFloat(xmlNode.getAttribute("lon"));

        self.getNearbyPoint = function(index) {
            var targetIndex = self.index + index;
            if(targetIndex < 0 || targetIndex > self.segment.points.length-1)
                return null;
            return self.segment.points[targetIndex];
        };

        self.distance = function(point)
        {
            var toRad = function(value) { return value * Math.PI / 180; };
            
            var R = 6371; // km
            var dLat = toRad((point.lat-this.lat));
            var dLon = toRad((point.lng-this.lng));
            var lat1 = toRad(this.lat);
            var lat2 = toRad(point.lat);
            
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            return d;
        };

        self.speed = function() {
            var pointCount = 10;
            var distance = 0;

            var points = [];
            for(var i=-1; i>=-pointCount; i--) {
                var point = self.getNearbyPoint(i);
                if(!point) break;
                points.push(point);                
            }

            if(points.length === 0) return null;
            var time = self.time.unix() - points[points.length-1].time.unix();
            for(var j=0; j<points.length; j++) {
                distance += points[j].distance(j === 0 ? self : points[j-1]);
            }

            return distance/(time/3600); // km/h
            
        };

        self.bearing = function() {
            var point = self.getNearbyPoint(-1);

            var lat1 = self.lat;
            var lon1 = self.lng;
            var lat2 = point.lat;
            var lon2 = point.lng;

            lat1 = lat1.toRad(); lat2 = lat2.toRad();
            var dLon = (lon2-lon1).toRad();

            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1)*Math.sin(lat2) -
                  Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
            
            return Math.atan2(y, x).toBrng();
        };

        var eleNodes = xmlNode.getElementsByTagName("ele");
        if(eleNodes.length > 0)
        {
            self.ele = parseFloat(eleNodes[0].textContent);
        }

        var timeNodes = xmlNode.getElementsByTagName("time");
        if(timeNodes.length > 0)
        {
            self.time = moment(timeNodes[0].textContent);
        }
    };

}(GeospatialJS));

/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function (mod) {
    "use strict";

    mod.TrackSegment = function(xmlNode, index, track) {
        var self = this;

        var trackpoints = xmlNode.getElementsByTagName("trkpt");
        
        var pointIndex = 0;
        
        self.points = _(trackpoints).map(function(x) { 
            return new mod.TrackPoint(x, pointIndex++, self); 
        });

        self.convertToMultiline = function() { 
            var coordinates = _(self.points).map(function(point) {
                return [ point.lng, point.lat ];
            });
            
            return {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            };
        };

        self.index = index; 
        self.startTime = _(self.points).min(function(x) { return x.time.unix(); }).time;
        self.endTime = _(self.points).max(function(x) { return x.time.unix(); }).time;

        
    };   
}(GeospatialJS));


/* 
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
    if(!value)
        return null;
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
/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function (mod) {
    "use strict";

    mod.WebResources = {
        geolocatorLink: function(latLng)
        {
            return mod.format("http://tools.freeside.sk/geolocator/geolocator.html?q={0},{1}",
                latLng.lat(), latLng.lng()
            );  
        },

        mapillary: function(latLng)
        {
            var scaleInDegrees = 0.1;
            var north = latLng.lat()-scaleInDegrees/2;
            var south = latLng.lat()+scaleInDegrees/2;
            var east = latLng.lng()+scaleInDegrees/2;
            var west = latLng.lng()-scaleInDegrees/2;

            return mod.format("http://www.mapillary.com/map/search/{0}/{1}/{2}/{3}",
                south, north, west, east
            );  
        },

        geohack: function(latLng)
        {
            return mod.format("http://toolserver.org/~geohack/geohack.php?params={0}_{1}_{2}_{3}",
                Math.abs(latLng.lat()), latLng.NS(), Math.abs(latLng.lng()), latLng.EW()
            );  
        },

        geocodeLink: function(latLng) {
             return mod.format("https://geolocation.ws/{0}", 
                mod.GeolocationCode.getCode(latLng.lat(),latLng.lng()));
        },

        geolocationWsMapLink: function(latLng, options) {
            var lang = (options && options.lang) || "en";
            var zoom = (options && options.zoom) || 15;

            return mod.format("https://geolocation.ws/map/{0},{1}/{2}/{3}", 
                (""+latLng.lat()).replace(",", ".") , 
                (""+latLng.lng()).replace(",", "."), 
                zoom,
                lang);
        }
    };   
}(GeospatialJS));


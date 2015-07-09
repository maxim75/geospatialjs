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
})(GeospatialJS);
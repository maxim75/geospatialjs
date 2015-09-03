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


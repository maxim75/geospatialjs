/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function (mod) {
    "use strict";

    QUnit.module("WebResources");

    QUnit.test("geolocatorLink", function() {
        var result = mod.WebResources.geolocatorLink(new mod.LatLng([0.123,45.678]));
        equal(result, "http://tools.freeside.sk/geolocator/geolocator.html?q=0.123,45.678");
    });

    QUnit.test("mapillary", function() {
        var result = mod.WebResources.mapillary(new mod.LatLng([50,30]));
        equal(result, "http://www.mapillary.com/map/search/50.05/49.95/29.95/30.05");
    });

    QUnit.test("geohack", function() {
        var result = mod.WebResources.geohack(new mod.LatLng([0.123,45.678]));
        equal(result, "http://toolserver.org/~geohack/geohack.php?params=0.123_N_45.678_E");
    });

    QUnit.test("geocodeLink", function() {
        var result = mod.WebResources.geocodeLink(new mod.LatLng([0.123,45.678]));
        equal(result, "https://geolocation.ws/GEOpAFjsg6t");
    });

    QUnit.test("geolocationWsMapLink", function() {
        var result = mod.WebResources.geolocationWsMapLink(new mod.LatLng([0.123,45.678]));
        equal(result, "https://geolocation.ws/map/0.123,45.678/15/en");
    });

    QUnit.test("geolocationWsMapLink - language option", function() {
        var result = mod.WebResources.geolocationWsMapLink(new mod.LatLng([0.123,45.678]), { lang: "de" });
        equal(result, "https://geolocation.ws/map/0.123,45.678/15/de");
    });

     QUnit.test("geolocationWsMapLink - zoom option", function() {
        var result = mod.WebResources.geolocationWsMapLink(new mod.LatLng([0.123,45.678]), { zoom: 20 });
        equal(result, "https://geolocation.ws/map/0.123,45.678/20/en");
    });

})(GeospatialJS);
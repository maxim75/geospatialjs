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
        var result = mod.WebResources.geolocatorLink(new GeospatialJS.LatLng([0.123,45.678]));
        equal(result, "http://tools.freeside.sk/geolocator/geolocator.html?q=0.123,45.678");
    });

    QUnit.test("mapillary", function() {
        var result = mod.WebResources.mapillary(new GeospatialJS.LatLng([50,30]));
        equal(result, "http://www.mapillary.com/map/search/49.995/50.005/29.995/30.005");
    });

    QUnit.test("geohack", function() {
        var result = mod.WebResources.geohack(new GeospatialJS.LatLng([0.123,45.678]));
        equal(result, "http://toolserver.org/~geohack/geohack.php?params=0.123_N_45.678_E");
    });


})(GeospatialJS);
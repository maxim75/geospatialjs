/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function () {
    "use strict";

    QUnit.module("LatLng");

    QUnit.test("init_default", function() {
        var point = new GeospatialJS.LatLng();

        equal(point.lat(), 0, point.lat());
        equal(point.lng(), 0, point.lng());
        equal(point.display(), "0\u00a0N 0\u00a0E", point.display().replace(" ", " "));
    });

    QUnit.test("init", function() {
        var point = new GeospatialJS.LatLng([50.4122423423, 30.323423434]);

        equal(point.lat(), 50.4122423423, point.lat());
        equal(point.lng(), 30.323423434, point.lng());
        equal(point.display(), "50.4122\u00a0N 30.3234\u00a0E", point.display().replace(" ", " "));
    });

    QUnit.test("init LatLng using json", function() {
        var point = new GeospatialJS.LatLng({ lat: 50.4122423423, lng: 30.323423434 });

        ok(point.lat() === 50.4122423423, point.lat());
        ok(point.lng() === 30.323423434, point.lng());
    });

    QUnit.test("get/set lat & lng using model methods", function() {
        var point = new GeospatialJS.LatLng({ lat: 1.2, lng: 3.4 });
        point.lat(8.1);
        point.lng(9.2);                

        ok(point.lat() === 8.1, point.lat());
        ok(point.lng() === 9.2, point.lng());             
    });

    QUnit.test("throws error on invalid value", function() {
        try {

            var point = new GeospatialJS.LatLng([1,2,3]);
            ok(false, "exception expected");

        } catch(error) {
            ok(error === "Array with two elements expected", error);
        }         
    });

    QUnit.test("throws error on invalid value", function() {
        try {
            var point = new GeospatialJS.LatLng(["1.2a",2]);
            ok(false, "exception expected");

        } catch(error) {
            ok(error === "Float values expected", error);
        }         
    });

    QUnit.test("distance", function() {
        var kiev = new GeospatialJS.LatLng([50.45, 30.523333]);
        var moscow = new GeospatialJS.LatLng([55.75, 37.616667]);
        
        var test_distance = kiev.distance(moscow);
        
        ok(test_distance > 755 && test_distance < 756, kiev.distance(moscow));
    });

    QUnit.test("toDms", function() {
        var result = new GeospatialJS.LatLng().toDms(-50.4369027778);
        equal(result[0], -50);
        equal(result[1], 26);
        equal(result[2].toFixed(), "13");
    });

    QUnit.test("displayDms", function() {
        var dms = new GeospatialJS.LatLng([50.4122423423, 30.323423434]).displayDms();
        ok(dms.indexOf("50°") != -1, dms);
    });

    QUnit.test("toDms", function() {
        equal(JSON.stringify(new GeospatialJS.LatLng([0, 0]).toDms(50.5)), JSON.stringify([50, 30, 0]));
    });


    QUnit.test("str", function() {
        equal(new GeospatialJS.LatLng([50.4122423423, 30.323423434]).str(), "50.4122423423,30.323423434");
    });

    QUnit.test("distanceDisplay", function() {
        equal(new GeospatialJS.LatLng([0,0]).distanceDisplay(new GeospatialJS.LatLng([1,0])), "111.2 km");
        equal(new GeospatialJS.LatLng([0,0]).distanceDisplay(new GeospatialJS.LatLng([0.001,0])), "111 m");
    });

    QUnit.test("gridId", function() {
        equal(new GeospatialJS.LatLng([50.4122423423, 30.323423434]).gridId(), 1404121032);
    });    

    QUnit.test("mapLink", function() {
        equal(new GeospatialJS.LatLng([0.123,45.678]).mapLink(), "/map/0.123,45.678/15/en");
    });

    
    QUnit.test("toJS", function() {
        var result = new GeospatialJS.LatLng([0.123,45.678]).toJS();
        equal(result.lat, 0.123);
        equal(result.lng, 45.678);
    });

    QUnit.test("geocodeLink", function() {
        var result = new GeospatialJS.LatLng([0.123,45.678]).geocodeLink();
        equal(result, "https://geolocation.ws/GEOpAFjsg6t");
    });
})();
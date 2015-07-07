(function () {
    "use strict";

    QUnit.module("LatLng");


    QUnit.test("init", function () {
        var latLng = GeospatialJS.LatLng([1.2, 3,4]);
        equal(latLng.lat(), 1.2);
    });


})();
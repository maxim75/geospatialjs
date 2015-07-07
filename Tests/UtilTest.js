(function () {
    "use strict";

    QUnit.module("Util");

    QUnit.test("format", function () {
        equal(GeospatialJS.format("{0} {1}", "a", 2), "a 2");
    });
})();
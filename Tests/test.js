(function () {
    "use strict";

    QUnit.module("module");


    QUnit.test("test", function () {

        equal(testFunc(), 100);
        ok(window.ko);
        ok(window.ko.observable);
    });


})();
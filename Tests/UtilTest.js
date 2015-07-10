/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function () {
    "use strict";

    QUnit.module("Util");

    QUnit.test("format", function () {
        equal(GeospatialJS.format("{0} {1}", "a", 2), "a 2");
    });

    QUnit.test("formatNum", function () {
        equal(GeospatialJS.formatNum(1.234567, 4), "1.2346");
        equal(GeospatialJS.formatNum(null, 4), null);
    });
})();
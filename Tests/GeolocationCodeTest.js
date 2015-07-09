/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function (mod) {
    "use strict";

    QUnit.module("GeolocationCode");

    QUnit.test("init", function() {
        equal(mod.getCode(1, 1), "GEOpQ6AO8zo");
        equal(JSON.stringify(mod.parseCode("GEOpQ6AO8zo")), "[1,1]");
    });

   
})(GeospatialJS.GeolocationCode);
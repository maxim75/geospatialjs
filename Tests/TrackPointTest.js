/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function (mod) {
    "use strict";

    QUnit.module("TrackPoint");

    QUnit.test("", function() {
        var el = $("<trkpt lat=\"1.23\" lon=\"4.56\"><ele>120.5</ele><time>2015-06-14T04:43:33.063Z</time></trkpt>")[0];

        var tpoint = new mod.TrackPoint(el, 10, {});
        equal(tpoint.lat, 1.23);
        equal(tpoint.lng, 4.56);
        equal(tpoint.lng, 4.56);
        equal(tpoint.ele, 120.5);
        equal(tpoint.time.utc().format(), "2015-06-14T04:43:33+00:00");
    });

})(GeospatialJS);
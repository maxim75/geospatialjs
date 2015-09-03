/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function (mod) {
    "use strict";

    QUnit.module("GpxTrack");

    QUnit.test("init", function() {
        var el = $("<gpx><trkseg><trkpt lat=\"1.23\" lon=\"4.56\"><ele>120.5</ele><time>2015-06-14T04:43:33.063Z</time></trkpt><trkpt lat=\"1.24\" lon=\"4.57\"><ele>121.5</ele><time>2015-06-14T04:43:34.063Z</time></trkpt></trkseg></gpx>")[0];
        
        var track = new mod.GpxTrack(el);
        equal(track.segments.length, 1);
        equal(track.startTime().utc().format("YYYY-MM-DD hh:mm:ss"), "2015-06-14 04:43:33");
        equal(track.endTime().utc().format("YYYY-MM-DD hh:mm:ss"), "2015-06-14 04:43:34");
    });

})(GeospatialJS);
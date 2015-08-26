/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function (mod) {
    "use strict";

    QUnit.module("TrackSegment");

    QUnit.test("init", function() {
        var el = $("<trkseg><trkpt lat=\"1.23\" lon=\"4.56\"><ele>120.5</ele><time>2015-06-14T04:43:33.063Z</time></trkpt><trkpt lat=\"1.24\" lon=\"4.57\"><ele>121.5</ele><time>2015-06-14T04:43:34.063Z</time></trkpt></trkseg>")[0];
        var tsegment = new mod.TrackSegment(el, 10, {});

        equal(tsegment.index, 10);
        equal(tsegment.points.length, 2);
        equal(tsegment.startTime.utc().format(), "2015-06-14T04:43:33+00:00");
        equal(tsegment.endTime.utc().format(), "2015-06-14T04:43:34+00:00");
    });

    QUnit.test("convertToMultiline", function() {
        var el = $("<trkseg><trkpt lat=\"1.23\" lon=\"4.56\"><ele>120.5</ele><time>2015-06-14T04:43:33.063Z</time></trkpt><trkpt lat=\"1.24\" lon=\"4.57\"><ele>121.5</ele><time>2015-06-14T04:43:34.063Z</time></trkpt></trkseg>")[0];
        var tsegment = new mod.TrackSegment(el, 10, {});
        console.log(tsegment);

        var multiline = tsegment.convertToMultiline();
        equal(multiline.type, "Feature");
        equal(multiline.geometry.type, "LineString");
        equal(multiline.geometry.coordinates[0][0], 4.56);
        equal(multiline.geometry.coordinates[0][1], 1.23);
    });



})(GeospatialJS);
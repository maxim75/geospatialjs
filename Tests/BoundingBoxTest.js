/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

(function () {
    "use strict";

    QUnit.module("BoundingBox");

    test("bounding box", function() {
		//{ n: 50.2, s: 50, e: 30.2, w: 30 }
		var bb = new GeospatialJS.BoundingBox();
		
		bb.south(50.1);
		bb.north(50.2);
		bb.east(30.2);
		bb.west(30.1);

		equal(bb.south(), 50.1);
		equal(bb.north(), 50.2);
		equal(bb.east(), 30.2);
		equal(bb.west(), 30.1);
	});

	test("setFromLocations test", function() {

		var bb = new GeospatialJS.BoundingBox();
		
		bb.setFromLocations([ 
			new GeospatialJS.LatLng([1.1,2.2]),
			new GeospatialJS.LatLng([5.5,6.6]),
			new GeospatialJS.LatLng([3.3,4.4])
		]);

		equal(bb.south(), 1.1);
		equal(bb.north(), 5.5);
		equal(bb.east(), 6.6);
		equal(bb.west(), 2.2);
	});
})();
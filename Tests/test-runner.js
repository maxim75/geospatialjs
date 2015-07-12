/*global require: false, QUnit: false */

(function () {
	'use strict';

	require.config({
		waitSeconds: 0
	});

	require([
		'UtilTest.js',
		'LatLngTest.js',
		'GeolocationCodeTest.js',
		'BoundingBoxTest.js',
		'GpxTrackTest.js'
	], QUnit.start);

}());
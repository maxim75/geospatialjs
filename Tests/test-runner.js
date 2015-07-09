/*global require: false, QUnit: false */

(function () {
	'use strict';

	require.config({
		waitSeconds: 0
	});

	require([
		'UtilTest.js',
		'LatLngTest.js',
		'GeolocationCodeTest.js'
	], QUnit.start);

}());
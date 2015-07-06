/*global require: false, QUnit: false */

(function () {
	'use strict';

	require.config({
		waitSeconds: 0
	});

	require([
		'test.js'
	], QUnit.start);

}());
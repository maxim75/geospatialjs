/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function (mod) {
    "use strict";

    mod.TrackSegment = function(xmlNode, index, track) {
        var self = this;

        var trackpoints = xmlNode.getElementsByTagName("trkpt");
        
        var pointIndex = 0;
        
        self.points = _(trackpoints).map(function(x) { 
            return new mod.TrackPoint(x, pointIndex++, self); 
        });

        self.convertToMultiline = function() { 
            var coordinates = _(self.points).map(function(point) {
                return [ point.lng, point.lat ];
            });
            
            return {
                "type": "Feature",
                "properties": {},
                "geometry": {
                    "type": "LineString",
                    "coordinates": coordinates
                }
            };
        };

        self.index = index; 
        self.startTime = _(self.points).min(function(x) { return x.time.unix(); }).time;
        self.endTime = _(self.points).max(function(x) { return x.time.unix(); }).time;

        
    };   
}(GeospatialJS));


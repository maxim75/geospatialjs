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

    mod.GpxTrack = function(trackXml) {
        var self = this;

        self.getClosestPoint = function(timestamp) {

            var segment = self.findSegmentByTimestamp(timestamp);
            if(!segment) return null;

            return self.getClosestPointResursive(timestamp, segment, 0, segment.points.length-1, 0);
        };

        self.getClosestPointResursive = function(timestamp, segment, startIdx, endIdx, rec) {
            
            if(rec > 10) return null; 
            var idx = startIdx + Math.floor((endIdx - startIdx)/2);
            var point = segment.points[idx];
        
            if(endIdx-startIdx < 4 || point.time == timestamp) 
            {
                var maxDelta = 1000000000;
                for(var i = startIdx; i <= endIdx; i++)
                {
                    var delta = Math.abs(timestamp - segment.points[i].time);
                    if(delta < maxDelta)
                    {
                        point = segment.points[i];
                        maxDelta = delta;
                    }
                }
                return point;
            }
            
            if(point.time > timestamp)
            {
                return self.getClosestPointResursive(timestamp, segment, startIdx, idx, rec+1);
            }
            else
            {
                return self.getClosestPointResursive(timestamp, segment, idx, endIdx, rec+1);
            }
        };

        self.findSegmentByTimestamp = function(timestamp) {
            if(!timestamp) return null;
            return _(self.segments).find(function(segment) {
                return timestamp.unix() >= segment.startTime.unix() && timestamp.unix() <= segment.endTime.unix();
            });
        };

        self.startTime = function() { 
            var self = this;

            return self.segments.length > 0 ? 
                self.segments[0].startTime
                : null;
        }; 

        self.endTime = function() { 
            var self = this;

            return self.segments.length > 0 ? 
                self.segments[self.segments.length-1].endTime
                : null;
        }; 

        //-- init

        var idx = 0;
        self.segments = _(trackXml.getElementsByTagName("trkseg")).map(function(x) { 
            return new mod.TrackSegment(x, idx++, self); 
        });


    };
}(GeospatialJS));


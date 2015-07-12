/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GpxTracks;
GpxTracks = GpxTracks || {};

(function (mod) {
    "use strict";

    GpxTracks.TrackPoint = function(xmlNode, index, segment) {
        var self = this;

        self.index = index;
        self.segment = segment;
        self.lat = parseFloat(xmlNode.getAttribute("lat"));
        self.lng = parseFloat(xmlNode.getAttribute("lon"));

        self.getNearbyPoint = function(index) {
            var targetIndex = self.index + index;
            if(targetIndex < 0 || targetIndex > self.segment.points.length-1)
                return null
            return self.segment.points[targetIndex];
        };

        self.distance = function(point)
        {
            var toRad = function(value) { return value * Math.PI / 180; };
            
            var R = 6371; // km
            var dLat = toRad((point.lat-this.lat));
            var dLon = toRad((point.lng-this.lng));
            var lat1 = toRad(this.lat);
            var lat2 = toRad(point.lat);
            
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;
            return d;
        };

        self.speed = function() {
            var pointCount = 10;
            var distance = 0;

            var points = [];
            for(var i=-1; i>=-pointCount; i--) {
                var point = self.getNearbyPoint(i);
                if(!point) break;
                points.push(point);                
            }

            if(points.length == 0) return null;
            var time = self.time.unix() - points[points.length-1].time.unix();
            for(var j=0; j<points.length; j++) {
                distance += points[j].distance(j == 0 ? self : points[j-1]);
            }

            return distance/(time/3600); // km/h
            
        };

        self.bearing = function() {
            var point = self.getNearbyPoint(-1);

            var lat1 = self.lat;
            var lon1 = self.lng;
            var lat2 = point.lat;
            var lon2 = point.lng;

            lat1 = lat1.toRad(); lat2 = lat2.toRad();
            var dLon = (lon2-lon1).toRad();

            var y = Math.sin(dLon) * Math.cos(lat2);
            var x = Math.cos(lat1)*Math.sin(lat2) -
                  Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
            
            return Math.atan2(y, x).toBrng();
        };

        var eleNodes = xmlNode.getElementsByTagName("ele");
        if(eleNodes.length > 0)
        {
            self.ele = parseFloat(eleNodes[0].textContent);
        }

        var timeNodes = xmlNode.getElementsByTagName("time");
        if(timeNodes.length > 0)
        {
            self.time = moment(timeNodes[0].textContent);
        }
    };

    GpxTracks.TrackSegment = function(xmlNode, index, track) {
        var self = this;

        var trackpoints = xmlNode.getElementsByTagName("trkpt");
        
        var pointIndex = 0;
        self.points = _(trackpoints).map(function(x) { 
            return new GpxTracks.TrackPoint(x, pointIndex++, self); 
        });

        self.index = index; 
        self.startTime = _(self.points).min(function(x) { return x.time.unix(); }).time;
        self.endTime = _(self.points).max(function(x) { return x.time.unix(); }).time;
    };

    GpxTracks.GpxTrack = function(trackXml) {
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

        //-- init

        var idx = 0;
        self.segments = _(trackXml.getElementsByTagName("trkseg")).map(function(x) { 
            return new GpxTracks.TrackSegment(x, idx++, self); 
        });
    };
}(GpxTracks));


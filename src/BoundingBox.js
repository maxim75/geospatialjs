/* 
 * Copyright (C) 2015 Maksym Kozlenko <max@kozlenko.info>
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE file for details.
 */

var GeospatialJS;
GeospatialJS = GeospatialJS || {};

(function(mod) {
    "use strict";

    mod.BoundingBox = function() {
        var self = this;

        self.north = ko.observable();
        self.east = ko.observable();
        self.south = ko.observable();
        self.west = ko.observable();

        self.setFromLocations = function(locations) {

            self.north = ko.observable(-90);
            self.east = ko.observable(-180);
            self.south = ko.observable(90);
            self.west = ko.observable(180);

            locations.forEach(function(x) {
                if(x.lat() < self.south()) self.south(x.lat());
                if(x.lng() < self.west()) self.west(x.lng());
                if(x.lat() > self.north()) self.north(x.lat());
                if(x.lng() > self.east()) self.east(x.lng());
            });
        };
    };

})(GeospatialJS);
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

    mod.GeolocationBrowserApi = {
        setLocationUpdates: function(func) {
            var onUpdate = function(position)
            {
                if(!position)
                    pubsub.publish("location", [null]);
                else
                {
                    var lat = parseFloat((position.coords) ? new String(position.coords.latitude) : position.x);
                    var lng = parseFloat((position.coords) ? new String(position.coords.longitude) : position.y);

                    func({
                        loc: new mod.LatLng([lat, lng]),
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude,
                        speed: position.coords.speed,
                        altitudeAccuracy: position.coords.altitudeAccuracy,
                        heading: position.coords.heading,
                        date: moment.utc()
                    });
                }
            };

            if(navigator.geolocation)
                navigator.geolocation.watchPosition( 
                    onUpdate,
                    function(error) { },
                    {
                    maximumAge: 10000,
                    timeout: 5000,
                    enableHighAccuracy: true
            });
        }
    };

})(GeospatialJS);
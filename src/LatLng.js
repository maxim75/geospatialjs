var GeospatialJS = GeospatialJS || {};

GeospatialJS.LatLng = function(data)
{
    var self = this;

    if(data instanceof Array) {
        if(data.length != 2) {
            throw "Array with two elements expected";
        }
        if(typeof data[0] !== "number" || typeof data[1] !== "number") {
            throw "Float values expected";
        }

        self.lat = ko.observable(data[0]);
        self.lng = ko.observable(data[1]);
    }
    else if(data && data.lat && data.lng)
    {
        if(typeof data.lat !== "number" || typeof data.lng !== "number") {
            throw "Float values expected";
        }
        self.lat = ko.observable(data.lat);
        self.lng = ko.observable(data.lng); 
    }
    else
    {
        self.lat = ko.observable(0);
        self.lng = ko.observable(0);    
    }


    self.display = function()
    {
        var ew = self.lng() < 0 ? "W" : "E";
        var ns = self.lat() < 0 ? "S" : "N";
        
        return ns.format(Math.abs(self.lat()).formatNum(4)) + " "
            + ew.format(Math.abs(self.lng()).formatNum(4));
    };

    self.distance = function(point)
    {
        var toRad = function(value) { return value * Math.PI / 180; };
        
        if(!(point instanceof lbank.model.LatLng))
            throw "lbank.model.LatLng object expected";
        
        var R = 6371; // km
        var dLat = toRad((point.lat()-this.lat()));
        var dLon = toRad((point.lng()-this.lng()));
        var lat1 = toRad(this.lat());
        var lat2 = toRad(point.lat());
        
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c;
        return d;
    };

    self.toDms = function(deg) {
        d = parseInt(deg);
        md = Math.abs(deg-d) * 60;
        m = parseInt(md);
        sd = (md - m) * 60;
        return [d, m, sd];
    };

    self.toJS = function() {
        return { lat: self.lat(), lng: self.lng() }
    };

    self.toDmsFormat =  function(deg) {
        var dms = self.toDms(deg);
        return "{0}° {1}′ {2}″".format(Math.abs(dms[0]),dms[1],dms[2].toFixed(2));
    };

    self.displayDms = ko.computed(function(glatlng)
    {
        var ew = self.lng() < 0 ? lbank._["latlng_W"] : lbank._["latlng_E"];
        var ns = self.lat() < 0 ? lbank._["latlng_S"] : lbank._["latlng_N"];
        
        return ns.format(self.toDmsFormat(self.lat())) + " " + ew.format(self.toDmsFormat(self.lng()));
    });

    self.displayDec = ko.computed(function(glatlng)
    {
        return self.display();
    });

    self.latlng = ko.computed(function() {
        return { lat: self.lat(), lng: self.lng() };
    });

    self.str = function(glatlng)
    {
        return "" + self.lat()  + "," + self.lng();
    };

    self.distanceDisplay = function(point)
    {
        var dist = this.distance(point);
        return (dist >= 1)
            ? "{0} {1}".format(dist.formatNum(1), lbank._["km"])
            : "{0} {1}".format((dist*1000).formatNum(), lbank._["m"])
    };

    self.gridId = function() {
        return Math.round((90*100+Math.floor(self.lat()*100))*100000 + 180*100+Math.floor(self.lng()*100))
    };

    self.geolocatorLink = function()
    {
        return "http://tools.freeside.sk/geolocator/geolocator.html?q={0},{1}".format(
            self.lat(), self.lng()
        );  
    };

    self.mapLink = function(lang)
    {
        return "/map/{0},{1}/15/{2}".format((""+self.lat()).replace(",", ".") , (""+self.lng()).replace(",", "."), lang ? lang : "en");
    };

    self.NS = function() {
        return self.lat() >= 0 ? "N" : "S";
    };

    self.EW = function() {
        return self.lng() >= 0 ? "E" : "W";
    };

    self.geohackLink = function()
    {
        return "http://toolserver.org/~geohack/geohack.php?params={0}_{1}_{2}_{3}".format(
            Math.abs(self.lat()), self.NS(), Math.abs(self.lng()), self.EW()
        );  
    };

    self.geocodeLink = ko.computed(function() {
        return "/{0}".format(lbank.GeolocationCode.getCode(self.lat(),self.lng()));
    });
}
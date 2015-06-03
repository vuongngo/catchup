module.exports = {
	
	getNearby:  function  (lat, lng, dev_id, dev_secret) {
		var crypto = require('crypto-js/hmac-sha1');
        var url = '/v2/nearme/latitude/' + lat + '/longitude/' + lng + '?devid=' + dev_id;
	    var signature = crypto(url, dev_secret);      

	    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
	    return requesturl;
    },

    getStops: function (poi, lat, lng, dev_id, dev_secret) {
        var crypto = require('crypto-js/hmac-sha1');
        var location = Location.getBoundaries(lat, lng);
	    var url = '/v2/poi/' + poi + '/lat1/' + location.lat1 + '/long1/' + location.lng1 + '/lat2/' + location.lat2 + '/long2/' + location.lng2 + 
	        '/griddepth/' + 20 + '/limit/' + 4 + '?devid=' + dev_id;
	    var signature = crypto(url, dev_secret);      

	    requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;

   		return requesturl;
    },

    getDepartures: function (mode, stop, limit, dev_id, dev_secret) {
        var crypto = require('crypto-js/hmac-sha1');
        var url = '/v2/mode/' + mode + '/stop/' + stop + '/departures/by-destination/limit/' + limit + '?devid=' + dev_id;
	    var signature = crypto(url, dev_secret);

	    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
	    return requesturl;
    },

    getLine: function (mode, line, dev_id, dev_secret) {
        var crypto = require('crypto-js/hmac-sha1');
    	var url = '/v2/mode/' + mode + '/line/' + line + '/stops-for-line?devid=' + dev_id;
  
	    var signature = crypto(url, dev_secret);
    	var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    	return requesturl;
    }


}
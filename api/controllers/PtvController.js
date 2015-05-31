var crypto = require('crypto-js/hmac-sha1');
var request = require('request');
var devId = sails.config.ptv.devId;
var devSecret = sails.config.ptv.devSecret;
/**
 * PtvController
 *
 */

module.exports = {

  health_check: function (req, res) {
    var date = new Date();
    date = date.toISOString();
    console.log(date);

    var url = '/v2/healthcheck?timestamp=' + date + '&devid=' + devId;
    var signature = crypto(url, devSecret);      
    
    requesturl = 'http://timetableapi.ptv.vic.gov.au/v2/healthcheck?timestamp=' + date + '&devid=' + devId + '&signature=' + signature; 
    request(requesturl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.ok(body); 
      }
    })

  },
  get_nearby: function (req, res) {
    var params = req.params.all();
    console.log(params);
    var url = '/v2/nearme/latitude/' + params.lat + '/longitude/' + params.lng + '?devid=' + devId;
    console.log(url);
    var signature = crypto(url, devSecret);      

    requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      if (error) {
        res.badRequest(error);
      } else {
        res.ok(body);         
      }
    })
  },

  get_stops: function (req, res) {
    var params = req.params.all();
    console.log(params);
    var location = Location.getBoundaries(params.lat, params.lng);
    var url = '/v2/poi/' + params.poi + '/lat1/' + location.lat1 + '/long1/' + location.lng1 + '/lat2/' + location.lat2 + '/long2/' + location.lng2 + 
        '/griddepth/' + 20 + '/limit/' + 4 + '?devid=' + devId;
    console.log(url);
    var signature = crypto(url, devSecret);      

    requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      if (error && response.statusCode == 200) {
        res.badRequest(error);
      } else {
        res.ok(body);
      }
    })

  },
  
  get_departures: function (req, res) {
    var params = req.params.all();
    var url = '/v2/mode/' + params.mode + '/stop/' + params.stop + '/departures/by-destination/limit/' + params.limit + '?devid=' + devId;
    console.log(url);
    var signature = crypto(url, devSecret);

    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    request(requesturl, function (error, response, body) {
      if (error) {
        res.badRequest(error);
      } else {
        res.ok(body);
      }
    })
  },

  get_line: function (req, res) {
    var params = req.params.all();
    var url = '/v2/mode/' + params.mode + '/line/' + params.line + '/stops-for-line?devid=' + devId;
  
    var signature = crypto(url, devSecret);
    var requesturl = 'http://timetableapi.ptv.vic.gov.au' + url + '&signature=' + signature;
    console.log(requesturl);
    request(requesturl, function (error, response, body) {
      if (error) {
        res.badRequest(error);
      } else {
        res.ok(body);
      }
    })
  },
  
};


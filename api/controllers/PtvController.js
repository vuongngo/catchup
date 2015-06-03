var request = require('request');
var devId = sails.config.ptv.devId;
var devSecret = sails.config.ptv.devSecret;
/**
 * PtvController
 *
 */

module.exports = {

  // Health Check 
  health_check: function (req, res) {
    var date = new Date();
    date = date.toISOString();
    console.log(date);

    var url = '/v2/healthcheck?timestamp=' + date + '&devid=' + devId;
    var signature = crypto(url, devSecret);      
    
    requesturl = 'http://timetableapi.ptv.vic.gov.au'+ url + '&signature=' + signature; 
    request(requesturl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        res.ok(body); 
      }
    })

  },

  // Get stops nearby with Nearby API
  get_nearby: function (req, res) {
    var params = req.params.all();
    var requesturl = Fetch.getNearby(params.lat, params.lng, devId);
    request(requesturl, function (error, response, body) {
      if (error) {
        res.badRequest(error);
      } else {
        res.ok(body);         
      }
    })
  },

  // Get stops nearby with POI API
  get_stops: function (req, res) {
    var params = req.params.all();
    var requesturl = Fetch.getStops(params.poi, params.lat, params.lng, devId, devSecret);
    request(requesturl, function (error, response, body) {
      if (error && response.statusCode == 200) {
        res.badRequest(error);
      } else {
        console.log(body);
        res.ok(body);
      }
    })

  },
  
  // Get departures with Broad Departure api
  get_departures: function (req, res) {
    var params = req.params.all();
    var requesturl = Fetch.getDepartures(params.mode, params.stop, params.limit, devId, devSecret);
    request(requesturl, function (error, response, body) {
      if (error) {
        res.badRequest(error);
      } else {
        res.ok(body);
      }
    })
  },

  // Get line with Line api
  get_line: function (req, res) {
    var params = req.params.all();
    var requesturl = Fetch.getLine(params.mode, params.line, devId, devSecret);
    request(requesturl, function (error, response, body) {
      if (error) {
        res.badRequest(error);
      } else {
        res.ok(body);
      }
    })
  },
  
  // Share journey
  share: function (req, res) {
    var params = req.params.all();
    var nodemailer = require('nodemailer');
    var moment = require('moment');
    var email = sails.config.email.email;
    var password = sails.config.password.password;

    params.arrivaltime = moment(params.arrivaltime).add(1, 'hours').calendar();

    // create reusable transporter object using SMTP transport
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: email,
          pass: password
        }
    });

    var mailOptions = {
        from: email, // sender address
        to: params.email, // list of receivers
        subject: 'Catch up', // Subject line
        text: 'Catch ' + params.name + ' at ' + params.arrivalplace + ' ' + params.arrivaltime, // plaintext body
        html: 'Catch ' + params.name + ' at ' + params.arrivalplace + ' ' + params.arrivaltime // html body
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.badRequest(error);
        }else{
            console.log('Message sent: ' + info.response);
            res.ok({mes: 'Thank you. Have a great trip.'});
        }
    });
  }  
};


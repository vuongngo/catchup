'user strict';

angular
.module('services',['ngMaterial', 'ngGeolocation'])
.factory('Services', function($http) {
		var url = 'http://catchnshare.herokuapp.com'
		return {
			healthcheck: function(page) {
				return $http.get(url + '/api/v1/healthcheck');
			},
			get_stops: function(formData) {
				return $http.post(url + '/api/v1/get_stops', formData);
			},
			get_nearby: function(formData) {
				return $http.post(url + '/api/v1/get_nearby', formData);
			},
			get_departures: function(formData) {
				return $http.post(url + '/api/v1/get_departures', formData);
			},
			get_line: function(formData) {
				return $http.post(url + '/api/v1/get_line', formData);
			},
			share: function(formData) {
				return $http.post(url + '/api/v1/share', formData);
			}
		};
})
.controller('ServiceController', ['$scope', '$geolocation', 'Services', function($scope, $geolocation, Services, $moment) {

  $scope.walkClass='yellow';
  $scope.rideClass='yellow';
  $scope.driveClass='yellow';
  $scope.busClass='yellow';
  $scope.tramClass='yellow';
  $scope.trainClass='yellow';
  
  $scope.page = 0;
  $scope.userInput = {};
  $scope.travel = 1.4;

  $scope.changeMode = function(velo, typ) {
    $scope.page = 1;
  	$scope.travel = velo;
    if (typ === 0) {
      $scope.walkClass='blue';
      $scope.rideClass='yellow';
      $scope.driveClass='yellow';
    } else if (typ === 1) {
      $scope.walkClass='yellow';
      $scope.rideClass='blue';
      $scope.driveClass='yellow';
    } else {
      $scope.walkClass='yellow';
      $scope.rideClass='yellow';
      $scope.driveClass='blue';
    };
  };

  $scope.getStops = function(no) {

    if (no === 0) {
      $scope.busClass='blue';
      $scope.tramClass='yellow';
      $scope.trainClass='yellow';
    } else if (no === 1) {
      $scope.busClass='yellow';
      $scope.tramClass='blue';
      $scope.trainClass='yellow';
    } else {
      $scope.busClass='yellow';
      $scope.tramClass='yellow';
      $scope.trainClass='blue';
    };
    
	$geolocation.getCurrentPosition({
        timeout: 60000
     }).then(function(position) {

        $scope.myLocation = JSON.stringify({poi: no, lat: position.coords.latitude, lng: position.coords.longitude});
	    Services.get_stops($scope.myLocation).success(function(res) {
	    	$scope.locations = res.locations;
	    	for (i=0; i < $scope.locations.length; i ++) {
	    		var par = parseFloat($scope.locations[i].distance) * 100000;
	    		$scope.locations[i].distance = Math.round( par * 10 ) / 10;
	    		$scope.locations[i].needTime = 3 + ( Math.round( (par / (60 * $scope.travel)) * 10) / 10);
	    	};
	    }).error(function(err) {
	    	console.log(err);
	    })	
     });
  };

  $scope.getDepartures = function(loc) {
  	var poi;
  	if (loc.transport_type == "train") {
  		poi = 0;
  	};
  	if (loc.transport_type == "tram") {
  		poi = 1;
  	};
  	if (loc.transport_type == "bus") {
  		poi = 3;
  	};
  	$scope.departureInfo = JSON.stringify({mode: poi, stop: loc.stop_id, limit: 3});
  	$scope.page = 2;
  	$scope.needTime = loc.needTime;
  	Services.get_departures($scope.departureInfo).success(function(res) {
  		$scope.departures = res.values;
  	}).error(function(err) {
  		console.log(err);
  	})
  };

  $scope.getLine = function(dep) {
  	var poi;
  	if (dep.platform.stop.transport_type == "train") {
  		poi = 0;
  	};
  	if (dep.platform.stop.transport_type == "tram") {
  		poi = 1;
  	};
  	if (dep.platform.stop.transport_type == "bus") {
  		poi = 3;
  	};
  	$scope.lineInfo = JSON.stringify({mode: poi, line: dep.platform.direction.line.line_id});
  	$scope.startTime = dep.time_realtime_utc;

  	$scope.transport_type = dep.platform.stop.transport_type; 
  	$scope.page = 3;
  	Services.get_line($scope.lineInfo).success(function(res) {
  		$scope.lines = res;
  	}).error(function(err) {
  		console.log(err);
  	})
  };

  $scope.getNotification = function(loc) {
  	$scope.destination = loc;
  	$scope.page = 4;
  };
  $scope.submit = function() {
  	$scope.userInput.arrivaltime = $scope.startTime;
  	$scope.userInput.arrivalplace = $scope.destination;
  	Services.share($scope.userInput).success(function(res) {
  		$scope.thanks = "Thank you!";
  	}).error(function(err) {
  		console.log(err);
  	})

  }
}]);



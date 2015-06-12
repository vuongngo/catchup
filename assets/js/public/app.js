'use strict';

// Declare app level module which depends on views, and components
angular
  .module('myApp', [
    'angular-momentjs',
    'services'
  ])
  .config(function($momentProvider, $mdIconProvider){
    $momentProvider
      .asyncLoading(false)
      .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
  	
  	$mdIconProvider
       .icon('bike', '/images/ic_directions_bike_black_48px.svg', 48)
       .icon('walk', '/images/ic_directions_walk_black_48px.svg', 48)
       .icon('car', '/images/ic_directions_car_black_48px.svg', 48)
       .icon('bus', '/images/ic_directions_bus_black_48px.svg', 48)
       .icon('tram', '/images/ic_directions_railway_black_48px.svg', 48)
       .icon('train', '/images/ic_directions_subway_black_48px.svg', 48)
       .icon('timelapse', '/images/ic_timelapse_black_48px.svg', 48)
       .icon('fromto', '/images/ic_trending_flat_black_48px.svg', 48)
       .icon('time', '/images/ic_access_time_black_48px.svg', 48)
       .icon('stepout', '/images/ic_beenhere_black_48px.svg', 48)
  });
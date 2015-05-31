'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'angular-momentjs',
  'services'
])
  .config(function($momentProvider){
    $momentProvider
      .asyncLoading(false)
      .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
  });
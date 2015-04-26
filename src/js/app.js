angular.module('Rasparmony', [
  'ngRoute',
  'mobile-angular-ui',
  'mobile-angular-ui.gestures',
  'Rasparmony.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
  $routeProvider.when('/remote/:remote', {templateUrl:'remote.html',  reloadOnSearch: false});
  $routeProvider.when('/configuration', {templateUrl:'configuration.html',  reloadOnSearch: false});
});
angular.module('Rasparmony', [
  'ngRoute',
  'mobile-angular-ui',
  'Rasparmony.controllers.Main'
])

.config(function($routeProvider) {
  $routeProvider.when('/', {templateUrl:'home.html',  reloadOnSearch: false});
  $routeProvider.when('/remote/:remote', {templateUrl:'remote.html',  reloadOnSearch: false});
  $routeProvider.when('/configuration', {templateUrl:'configuration.html',  reloadOnSearch: false});
});
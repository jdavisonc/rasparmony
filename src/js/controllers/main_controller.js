angular.module('Rasparmony.controllers.Main', [])

.controller('MainController', function($scope, $http, $routeParams){

	var init = function() {
		$http.get('/macros')
			.success(function(data) {
		    	$scope.macros = data;
			}).error(function(data, status, headers, config) {
		    	console.log("Error getting macros");
			});

		$http.get('/remotes')
			.success(function(data) {
		    	$scope.remotes = data;
			}).error(function(data, status, headers, config) {
		    	console.log("Error getting remotes");
			});
	};

	$scope.send = function (command) {
		$http.post('/remotes/' + $routeParams.remote + '/' + command)
			.success(function(data) {
		    	;
		  	}).error(function(data, status, headers, config) {
		    	console.log("Error sending command");
		    });
	};

	$scope.execute = function (macro) {
		$http.post('/macros/' + macro.name)
			.success(function(data) {
		    	;
		  	}).error(function(data, status, headers, config) {
		    	console.log("Error executing macro");
		    });
	};

	init();
  
});
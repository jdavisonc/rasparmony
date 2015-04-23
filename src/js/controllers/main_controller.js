angular.module('Rasparmony.controllers.Main', [])

.controller('MainController', function($scope, $http, $routeParams){

	var init = function() {
		$http.get('/configurations')
			.success(function(data) {
		    	$scope.config = data;
			}).error(function(data, status, headers, config) {
		    	console.log("Error getting macros");
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

	$scope.saveConfiguration = function () {
		$http.post('/configurations', $scope.config)
			.success(function(data) {
		    	;
		  	}).error(function(data, status, headers, config) {
		    	console.log("Error saving the configuration");
		    });
	};

	init();
  
});
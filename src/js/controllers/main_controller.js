angular.module('Rasparmony.controllers.Main', ['mobile-angular-ui', 'mobile-angular-ui.gestures'])

.controller('MainController', function($rootScope, $scope, $http, $routeParams){

	$scope.config = {};
	$scope.definedRemotes = {};
	$scope.allStates = [];
	$scope.stateTypes = [ "options" ];

	$scope.newRemote;

	$scope.remote = function () {
		return $routeParams.remote;
	}

	var init = function() {
		$http.get('/configurations')
			.success(function(data) {
		    	$scope.config = data;
			}).error(function(data, status, headers, config) {
		    	console.log("Error getting macros");
			});
		$http.get('/remotes', $scope.config)
			.success(function(data) {
		    	$scope.definedRemotes = data;
		  	}).error(function(data, status, headers, config) {
		    	console.log("Error saving the configuration");
		    });

	};

	$scope.commands = function(remoteName) {
		var code;
		angular.forEach($scope.config.remotes, function(remote) {
			if (remoteName == remote.name) {
				code = remote.code;
			}
    	});
    	return $scope.definedRemotes[code];
	};

	$scope.states = function(remoteName) {
		var states;
    	angular.forEach($scope.config.remotes, function(remote) {
    		if (remoteName == remote.name) {
    			states = remote.states;
    		}
    	});
    	return states;
	}

	$scope.send = function (command) {
		$http.post('/remotes/' + $routeParams.remote + '/commands/' + command)
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

	$scope.saveConfigurations = function () {
		$http.post('/configurations', $scope.config)
			.success(function(data) {
		    	;
		  	}).error(function(data, status, headers, config) {
		    	console.log("Error saving the configuration");
		    });
	};

	$scope.removeCommand = function(macro, index) {
		macro.commands.splice(index, 1);
	};

	$scope.addCommandToMacro = function(macro) {
		if (!macro.commands) {
			macro.commands = [];
		}
		macro.commands.push({});
	};

	$scope.addStateToMacro = function(macro) {
		if (!macro.commands) {
			macro.commands = [];
		}
		macro.commands.push({ state: {}});
	};
	
	$scope.removeAlias = function(remote, index) {
		remote.commandAlias.splice(index, 1);
	};

	$scope.newAlias = function(remote) {
		if (!remote.commandAlias) {
			remote.commandAlias = [];
		}
		remote.commandAlias.push({});
	};

	$scope.newState = function(remote) {
		if (!remote.states) {
			remote.states = [];
		}
		remote.states.push({});
	};

	$scope.removeState = function(remote, index) {
		remote.states.splice(index, 1);
	};

	$scope.addRemote = function(newRemote) {
		if (!$scope.config.remotes) {
			$scope.config.remotes = [];
		}
		$scope.config.remotes.push({ "name": "", "code": newRemote });
	};

	$scope.addMacro = function() {
		if (!$scope.config.macros) {
			$scope.config.macros = [];
		}
		$scope.config.macros.push({});
	};

	$scope.removeMacro = function(index) {
		$scope.config.macros.splice(index, 1);
	};

	init();
  
});
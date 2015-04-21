angular.module('Rasparmony.controllers.Main', [])

.controller('MainController', function($scope, $http){

	$scope.config = {
		macros: [
			{ 
				"name": "TV", 
				"icon": "gamepad",
				"commands": [ 
					{ "remote": "TV", "command": "power" }, 
					{ "remote": "HomeTheater", "command": "power" } 
				] 
			},
			{ 
				"name": "Nexus Player", 
				"icon": "youtube-play",
				"commands": [ 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }
				] 
			},
			{ 
				"name": "Cable",
				"icon": "code-fork",
				"commands": [ 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }
				] 
			},
			{ 
				"name": "Radio", 
				"icon": "headphones",
				"commands": [ 
					{ "remote": "HomeTheater", "command": "power" },
					{ "remote": "HomeTheater", "command": "input" },
					{ "remote": "HomeTheater", "command": "input" },
					{ "remote": "HomeTheater", "command": "input" }
				] 
			}
		],
		remotes: [ 
			{ "name": "TV", code: "LHV4420" }, 
			{ "name": "HomeTheater", code: "888888" }
		]
	};

	$scope.send = function (remote, command) {
		$http.get('/someUrl').
		  success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
		    console.log("message");
		  }).
		  error(function(data, status, headers, config) {
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		    console.log("message");
		  });
	};

	$scope.sendMacro = function (macro) {

	};
  
});
angular.module('Rasparmony.controllers.Main', [])

.controller('MainController', function($scope){

	$scope.config = {
		macros: [
			{ 
				"name": "TV", 
				"commands": [ 
					{ "remote": "TV", "command": "power" }, 
					{ "remote": "HomeTheater", "command": "power" } 
				] 
			},
			{ 
				"name": "Nexus", 
				"commands": [ 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }
				] 
			},
			{ 
				"name": "Cable", 
				"commands": [ 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }, 
					{ "remote": "TV", "command": "input" }
				] 
			},
			{ 
				"name": "Radio", 
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
  
});
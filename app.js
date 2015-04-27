// Requirements
var express = require('express'),
    lirc_node = require('lirc_node'),
    fs = require('fs'),
    array = require('array.prototype.find');

// Create app
var app = module.exports = express();

// App configuration
app.configure(function() {
    app.use(express.logger());
    app.use(express.compress());
    app.use(express.json());
    app.use(express.static(__dirname + '/www'));
});


// lirc_web configuration
var config = {};

// Based on node environment, initialize connection to lirc_node or use test data
if (process.env.NODE_ENV == 'test' || process.env.NODE_ENV == 'development') {
    lirc_node.remotes = require(__dirname + '/test/fixtures/remotes.json');
    try {
        config = require(__dirname + '/test/fixtures/config.json');
    } catch(e) {
        console.log("DEBUG:", e);
        console.log("WARNING: Cannot find config.json!");
    }
} else {
    lirc_node.init();

    // Config file is optional
    try {
        config = require(__dirname + '/config.json');
    } catch(e) {
        console.log("DEBUG:", e);
        console.log("WARNING: Cannot find config.json!");
    }
}

// Utility functions
var getRemote = function(name) {
	return config.remotes.find(function(r) {return r.name == name;})
};
var getRemoteByCode = function(code) {
	return config.remotes.find(function(r) {return r.code == code;})
};
var getMacro = function(name) {
	return config.macros.find(function(m) {return m.name == name;})
};
var getAlias = function(remote, alias) {
    return remote.commandAlias && remote.commandAlias.find(function(a) {return a.alias == alias;})
};

// Rasparmony configuration in JSON format
app.get('/configurations', function(req, res) {
    res.json(config);
});

app.post('/configurations', function(req, res) {
	var configToSave = req.body;
	fs.writeFile(__dirname + '/config.json', JSON.stringify(configToSave, null, 2), function(err) {
	    if(err) {
	    	console.log(err);
	    } else {
	    	config = configToSave;
	      	console.log("Config saved to " + __dirname + '/config.json');
	    }
	});
});

// List all remotes in JSON format
app.get('/remotes', function(req, res) {
    res.json(lirc_node.remotes);
});

// List all commands for :remote in JSON format
app.get('/remotes/:remote', function(req, res) {
	var remote = getRemote(req.params.remote);
    if (lirc_node.remotes[remote.code]) {
        res.json(lirc_node.remotes[remote.code]);
    } else {
        res.send(404);
    }
});

// List all macros in JSON format
app.get('/macros', function(req, res) {
    res.json(config.macros);
});

// List all commands for :macro in JSON format
app.get('/macros/:macro', function(req, res) {
	var macro = getMacro(req.params.macro);
    if (macro) {
        res.json(macro);
    } else {
        res.send(404);
    }
});

var sendCommand = function (remote, command, callback) {
    var alias = getAlias(remote, command);
	if (alias) {
		command = alias.command;
	} else if (command.lastIndexOf('KEY', 0) !== 0) {
		command = 'KEY_' + command;
	}

	console.log("COMMAND: " + command + " REMOTE: " + remote.code);
    lirc_node.irsend.send_once(remote.code, command, callback);
};

// Send :remote/:command one time
app.post('/remotes/:remote/:command', function(req, res) {
	var remote = getRemote(req.params.remote);
	var command = req.params.command;

	sendCommand(remote, command, function() {});
    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

// Execute a macro (a collection of commands to one or more remotes)
app.post('/macros/:macro', function(req, res) {
	var macro = getMacro(req.params.macro);
    if (macro) {
        var i = 0;
        var commands = macro.commands;

        var nextCommand = function() {
            var command = commands[i];
    	    if (!command) { 
    	    	return true; 
    	    }

            i = i + 1;
            if (command.remote == "delay") {
                setTimeout(nextCommand, command.command);
                console.log("MACRO: " + req.params.macro + " COMMAND: delay " + command.command);
            } else {
            	var remote = getRemoteByCode(command.remote);
            	console.log("MACRO: " + req.params.macro + " COMMAND: " + command.command + " REMOTE: " + remote.code);

                // By default, wait 100msec before calling next command
                sendCommand(remote, command.command, function() { setTimeout(nextCommand, 100); });
            }
        };

        nextCommand();
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

app.listen(3000);
console.log("Rasparmony has started on port 3000.");

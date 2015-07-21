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
var child = null;

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
        // check lircrc existent include files and reconfigure
        // 
        // Update lirc configuration
        var lircrc = __dirname + '/lircrc';
        fs.writeFileSync(lircrc, '');
        
        fs.appendFileSync(lircrc, 'lircrc_class rasparmony\n')
        for (var i in config.remotes) {
          var remote = config.remotes[i];
          var line = 'include "' + __dirname + '/remotes/' + remote.brand + '/' + remote.definition + '.lircd.conf"\n';
          fs.appendFileSync(lircrc, line)
        }
        
        // Start lircd as child process
        if (child != null) {
            child.kill();
        }
        child = require('child_process').spawn('lircd', ['--uinput', lircrc]);
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
var getStateByName = function(remote, name) {
    return remote.states && remote.states.find(function(a) {return a.name == name;})
};
var getStateByTrigger = function(remote, trigger) {
    return remote.states && remote.states.find(function(a) {return a.trigger == trigger;})
};
var updateState = function(remote, trigger) {
    var state = getStateByTrigger(remote, trigger);

    if (state && state.type == "options") {
        
        if (state.menuTrigger && (!state.lastChange || ((new Date() - state.lastChange) / 1000) > state.menuTimeout)) {
            state.lastChange = new Date();
            console.log("Menu triggered by command: " + trigger);
            return ;
        }

        if (!state.value) {
            state.value = state.defaultValue;
        }
        var oldValue = state.value;
        var index = state.options.indexOf(state.value);
        state.value = state.options[(index + 1) % state.options.length];
        state.lastChange = new Date();
        console.log("State '" + state.name + "' of "+remote.name+" change '" + oldValue + "'->'" + state.value +"'");
    }
};

var getDelay = function() {
    return (config.general && config.general.defaultDelay) ? config.general.defaultDelay : 100;
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

// List remote properties
app.get('/remotes/:remote', function(req, res) {
	var remote = getRemote(req.params.remote);
    res.json(remote);
});

// List all commands for :remote in JSON format
app.get('/remotes/:remote/commands', function(req, res) {
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
    var commandToSend = command;
	if (alias) {
		commandToSend = alias.command;
	} else if (command.lastIndexOf('KEY', 0) !== 0) {
		commandToSend = 'KEY_' + command;
	}

    updateState(remote, (alias) ? alias.alias : command);
	console.log("COMMAND: " + commandToSend + ", REMOTE: " + remote.code);
    lirc_node.irsend.send_once(remote.code, commandToSend, callback);
};

var changeState = function (remote, expectedState, callback) {
    var state = getStateByName(remote, expectedState.name);

    if (!state.value) {
        state.value = state.defaultValue;
    }

    if (state.value != expectedState.value) {
        sendCommand(remote, state.trigger, function() { 
            setTimeout( function() { changeState(remote, expectedState, callback); }, getDelay()); 
        });
    } else {
        callback();
    }
};

// Send :remote/:command one time
app.post('/remotes/:remote/commands/:command', function(req, res) {
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
                console.log("--> MACRO: " + req.params.macro + ", COMMAND: delay " + command.command);
            } else if (command.state) {

                var remote = getRemote(command.remote);
                console.log("--> MACRO: " + req.params.macro + ", STATE: " + command.state.name + "='" + command.state.value + "', REMOTE: " + remote.name);

                changeState(remote, command.state, function() { setTimeout(nextCommand, getDelay()); });
            } else {
            	var remote = getRemote(command.remote);
            	console.log("--> MACRO: " + req.params.macro + ", COMMAND: " + command.command + ", REMOTE: " + remote.name);

                // By default, wait 100msec before calling next command
                sendCommand(remote, command.command, function() { setTimeout(nextCommand, getDelay()); });
            }
        };

        nextCommand();
    }

    res.setHeader('Cache-Control', 'no-cache');
    res.send(200);
});

app.listen(3000);
console.log("Rasparmony has started on port 3000.");

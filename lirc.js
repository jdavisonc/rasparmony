var child_process = require('child_process');

var lircProcess = null;
var irexecProcess = null;

function start(lircrc, irexecrc) {
    stop();
    lircProcess = child_process.spawn('lircd', ['--uinput', lircrc, '--device', '/dev/lirc0', '-n']);
    lircProcess.stdout.on('data', function (data) { console.log(data); });
    lircProcess.stderr.on('data', function (data) { console.log(data); });

    irexecProcess = child_process.spawn('irexec', [irexecrc]);
    irexecProcess.stdout.on('data', function (data) { console.log(data); });
    irexecProcess.stderr.on('data', function (data) { console.log(data); });
}

function stop() {
  if (lircProcess != null || irexecProcess != null) {
    lircProcess.kill();
    irexecProcess.kill();
  }
}

module.exports.stop = stop;
module.exports.start = start;
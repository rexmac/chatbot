/**
 * Gratuitously borrowed from https://github.com/wadey/geebus/blob/master/commands/helpers.js
 */
var childProcess = require('child_process');

var helpers = exports;

/**
 * Limit `func` so that each user can only use it every `seconds` seconds
 */
helpers.rateLimit = function(seconds, func) {
    var userLimits = {};
    return function(room, msg) {
        var userLimit = userLimits[msg.userId];
        if(userLimit && Date.now() < userLimit) {
            return room.speak('Slow down! You can only use this command once every ' + seconds + ' seconds. Please wait ' + ((userLimit - Date.now())/1000).toFixed(0) + ' seconds. :cop:');
        }

        userLimits[msg.userId] = Date.now() + (seconds * 1000);
        func(room, msg);
    };
};

/**
 * Helper function for child_process.spawn
 */
helpers.execSystem = function(cmd, args, callback) {
    if(arguments.length === 2) {
        callback = args;
        args = [];
    }

    var proc = childProcess.spawn(cmd, args),
        output = '';

    proc.stdout.on('data', function(data) { output += data; });
    proc.stderr.on('data', function(data) { output += data; });

    proc.on('exit', function(code) {
        if(code) {
            callback(new Error(code + ': ' + output), output);
        } else {
            // TODO also provide seperate stdout and stderr?
            callback(null, output);
        }
    });
};

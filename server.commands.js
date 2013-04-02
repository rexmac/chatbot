var request = require('request'),
    helpers = require('./server.helpers'),
    inspect = require('util').inspect;

module.exports = {
    'flip': {
        'help': 'Command: /flip\nDescription: Flips a coin and returns the result.',
        'func': function(room) {
            room.speak(Math.random() > 0.5 ? 'Heads!' : 'Tails!');
        }
    },
    'fortune': {
        'help': 'Command: /fortune\nDescription: Receive a fortune.',
        'func': helpers.rateLimit(1, function(room) {
            helpers.execSystem('/usr/games/fortune', function(err, output) {
                if(err) {
                    console.error(err);
                    return room.speak('Error: ' + err.message);
                }
                room.paste(output);
            });
        })
    },
    'help': {
        'help': 'All commands are preceeded by a /.\nCommands: flip, fortune, help, image, roll.\nType /help <em>command</em> to see help for a specific command.',
        'func': function(room, msg) {
            console.log(inspect(msg));
            var args = msg.args && msg.args.split(' ') || [],
                cmd;
            if(args[0]) {
                cmd = args[0];
                console.log('cmd', cmd);
                if(module.exports[cmd] && module.exports[cmd].help) {
                    return room.paste(module.exports[cmd].help);
                }
            }
            room.paste(module.exports.help.help);
        }
    },
    'image': {
        'help': 'Command: /image <em>query</em>\nDescription: Return first result from a Google Images search for <em>query</em>.\nExample: /image cat',
        'func': helpers.rateLimit(3, function(room, msg) {
            var uri = 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + encodeURIComponent(msg.args);
            request({uri: uri}, function(err, res, body) {
                if(err || res.statusCode >= 400) {
                    console.error(err, res, body);
                    return room.speak('Error :(');
                }

                body = JSON.parse(body);
                if(body.responseData.results.length > 0) {
                    room.image(body.responseData.results[0].unescapedUrl);
                } else {
                    room.speak('No image found :(');
                }
            });
        })
    },
    'roll': {
        'help': 'Command: /roll [<em>size</em>]\nDescription: Rolls a die and returns the result. Default <em>size</em> is 6.',
        'func': function(room, msg) {
            console.log('roll: ' + inspect(msg));
            var args = msg.args && msg.args.split(' ') || [],
                size = 6;
            if(args[0]) {
                size = parseInt(args[0], 10);
                if(!size) { return room.speak('That\'s not a valid number!'); }
            }

            room.speak('Rolled a ' + size + ' sided die: ' + (Math.floor(Math.random() * size) + 1));
        }
    }
};

var fs = require('fs'),
    path = require('path'),
    configFile = process.env.CHATBOT_CONFIG;

if(!configFile) { configFile = 'server.config.json'; }

function absPath(file) {
    if(file[0] !== '/') { return path.join(process.cwd(), file); }
    return file;
}

var config  = JSON.parse(fs.readFileSync(absPath(configFile))),
    _       = require('underscore'),
    connect = require('connect'),
    inspect = require('util').inspect,
    sio     = require('socket.io'),
    sios    = require('socket.io-sessions'),
    Room    = require('./server.room').Room,
    commands = {};

config.commands.forEach(function(file) {
    _.extend(commands, require(absPath(file)));
});
//console.log('COMMANDS');
//console.log(inspect(commands));

connect.session.ignore.push('/robots.txt');

var sessionStore = new connect.session.MemoryStore();

var routes = function(app) {
    // Keep this route last
    app.get('*', function(req, res, next) {
        var url = req.url,
            ua  = req.headers['user-agent'];

        // Request latest IE engine or ChromeFrame
        if(ua && ua.indexOf('MSIE') && url.match(/\.html?$/)) {
            res.setHeader('X-UA-Compatible', 'IE=Edge,chrome=1');
        }

        // Protect .files
        if(url.match(/(^|\/)\./)) { res.end('Not allowed'); }

        // Control cross domain using CORS (http://enable-cors.org/)
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With');

        // Let the static server do the rest
        next();
    });
};

var cache  = 1000 * 60 * 60 * 24 * 30,
    ip     = config.ip,
    port   = config.port,
    htdocs = __dirname + '/dist',
    server = connect.createServer(
        connect.logger(':date | :remote-addr | :method :url :status | :user-agent'),
        connect.router(routes),
        connect.cookieParser(),
        connect.session({key: '', secret:'no biggie', store: sessionStore}),
        connect.static(htdocs, {maxAge: cache})
    );//.listen(port, ip);

var socket = sios.enable({
    socket: sio.listen(server),
    store: sessionStore,
    parser: connect.cookieParser()
});

if(ip) {
  server.listen(port, ip);
} else {
  server.listen(port);
}
console.log('Node up @ '+ip+':'+port+htdocs);

/*
ioListener.sockets.on('connection', function(socket){
    console.log('Connection');
    socket.on('browserChatMessage', function(msg){
        console.log('Received chat message: '+msg);
    });
});
*/

//socket.on('sconnection', function(client, session) {
socket.on('sconnection', function(client) {
    console.log('sconnection');
    //console.log(inspect(client));
    var room = new Room(client);
    client.on('browserChatMessage', function(data) {
        console.log('Received chat message: '+inspect(data.message));
        //var match = data.message.exec(/^(![a-z0-9_-])\s+(\S*)$/i);
        //var match = /^(![a-z0-9_-])+(\s+\S+)*$/i.exec(data.message);
        var match = /^\/([a-z0-9_-]+)(?:\s+(.+))?$/.exec(data.message);
        if(match) { console.log('MATCH!: ' + inspect(match)); }

        if(match && match[1] && commands[match[1]]) {
            console.log('Executing command: \'' + match[1] + '\'');
            commands[match[1]].func(room, {userId: client.id, args: match[2]});
        } else {
            console.log('Executing default');
            client.emit('browserChatResponse', {speak:'I know nothing :('});// + client.id});
        }
    });
});

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
});

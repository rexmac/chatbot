var crypto = require('crypto');

exports.Room = function(client, attrs) {
    if(!attrs) {
        attrs = {};
    }
    this.id = attrs.id || crypto.createHash('sha256');
    this.name = attrs.name || this.id;
    this.topic = attrs.topic || 'No Topic';
    this.userLimit = attrs.userLimit || 1;
    this.locked = attrs.locked || false;
    this.openToGuests = attrs.openToGuests || false;
    this.createdAt = new Date(attrs.createdAt);
    this.updatedAt = new Date(attrs.updatedAt);

    var sendMessage = this.sendMessage = function(msg) {
        client.emit('browserChatResponse', msg);
    };

    this.image = function(msg) {
        sendMessage({'image': msg});
    };

    this.paste = function(msg) {
        sendMessage({'paste': msg});
    };

    this.play = function(msg) {
        sendMessage({'audio': msg});
    };

    this.speak = function(msg) {
        sendMessage({'speak': msg});
    };
};

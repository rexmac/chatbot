/*global io jQuery */
(function($) {
    'use strict';

    var $chatForm = $('#chat-form'),
        $chatInput = $('#chat-input'),
        $chatMessages = $('#chat-messages'),
        chatInputHistory = [],
        chatInputHistoryIndex = 0,
        chatInputHistoryMaxLength = 50,
        socket = false,
        socketReady = false;

    function emotify(str) {
        return str.replace(/:cop:/, '<span class="emoticon"><img src="/img/cop.png" alt=":cop:" /></span>');
    }

    function linkify(str) {
        return str;
    }

    function prepareSocketIO() {
        socket.on('browserChatResponse', function(message) {
            var name = 'Chatbot',
                $li, $span, img;

            if(message.bot) {
                name = message.bot.name;
                message = message.message;
            }

            $span = $('<span class="message"></span>');
            $li = $('<li><span class="user">' + name + '</span></li>').append($span);

            if(message.speak) {
                $span.html(emotify(linkify(message.speak)));
            } else if(message.paste) {
                $span.append($('<pre>').html(message.paste));
            } else if(message.image) {
                console.log('image', $chatMessages.prop('scrollHeight'));
                img = new Image();
                img.onload = function() {
                    console.log('image.load', $chatMessages.prop('scrollHeight'));
                    // A small delay seems necessary when working on localhost
                    //$chatMessages.prop({scrollTop: $chatMessages.prop('scrollHeight')});
                    setTimeout(function() { $chatMessages.prop({scrollTop: $chatMessages.prop('scrollHeight')}); }, 100);
                };
                /*$(img).each(function() {
                    if(this.complete || (jQuery.browser.msie && parseInt(jQuery.browser.version) == 6)) $(this).trigger("load");
                });*/
                $span.append(img);
                img.src = message.image;
            }

            $chatMessages.append($li).prop({scrollTop: $chatMessages.prop('scrollHeight')});
            $li.emoticonize({});
        });
    }

    socket = io.connectWithSession();
    prepareSocketIO();
    socket.on('connect', function() {
        console.log('socket connected');
        socketReady = true;
    });

    $chatForm.submit(function(e) {
        var input = $chatInput.val(),
            $li, $span;

        e.preventDefault();
        // Don't both if input is empty or nothing but whitespace
        if(input.replace(/\s/g, '') === '') { return false; }

        //console.log(chatInputHistory[chatInputHistory.length-1], input);
        if(chatInputHistory[chatInputHistory.length-1] !== input) {
            if(chatInputHistory.length === chatInputHistoryMaxLength) {
                chatInputHistory.shift();
            }
            chatInputHistory.push(input);
        }
        chatInputHistoryIndex = chatInputHistory.length;

        $span = $('<span class="message"></span>').text(emotify(input));
        $li = $('<li class="me"><span class="user">You</span></li>').append($span);
        $chatMessages.append($li).prop({scrollTop: $chatMessages.prop('scrollHeight')});

        // https://github.com/JangoSteve/jQuery-CSSEmoticons
        $span.emoticonize({});

        // Replace img emoticons with their alt text on hover
        $('span.emoticon', $span).hover(function() {
            $(this).text($('img', this).attr('alt'));
        }, function() {
            $(this).html('<img src="/img/' + $(this).text().replace(/:/g, '') + '.gif" alt="' + $(this).text() + '" />');
        });

        if(!socketReady) {
            socket.on('connect', function() {
                socket.emit('browserChatMessage', {message: input});
            });
        } else {
            socket.emit('browserChatMessage', {message: input});
        }

        $chatInput.val('');
    });

    $chatInput.keydown(function(e) {
         if(e.keyCode === 38) { // Up
             console.log('up');
             console.log(chatInputHistoryIndex, chatInputHistory.length);
             e.preventDefault();
             if(chatInputHistoryIndex === 0) { return; }
             $chatInput.val(chatInputHistory[--chatInputHistoryIndex]);
             console.log(chatInputHistoryIndex, chatInputHistory.length);
         } else if(e.keyCode === 40) { // Down
             console.log('down');
             console.log(chatInputHistoryIndex, chatInputHistory.length);
             e.preventDefault();
             if(chatInputHistoryIndex === chatInputHistory.length) { return; }
             $chatInput.val(chatInputHistory[++chatInputHistoryIndex]);
             console.log(chatInputHistoryIndex, chatInputHistory.length);
         }
    }).focus();

})(jQuery);

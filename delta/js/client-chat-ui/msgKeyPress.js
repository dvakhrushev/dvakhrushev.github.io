define(function (require, exports, module) {
    var chatMessageTyping = require('client-chat-ui/chatMessageTyping');
    var sendMessage = require('client-chat-ui/sendMessage');

    return function (event, session) {

        if (event.which == 13) {
            if (!event.shiftKey) {
                event.preventDefault();
                event.stopImmediatePropagation();
                sendMessage(session);
                $('.emoji-wysiwyg-editor').html('');
            } else {
                var chatLog = $('#chatLog');
                var msg = $('#input-field,.emoji-wysiwyg-editor');
                var scroll1 = msg.scrollTop();
                setTimeout(function () {
                    var scroll2 = msg.scrollTop();
                    if (scroll2 > scroll1) {
                        var logHeight = chatLog.height();
                        var minHeight = 64;
                        var heightIncrement = 16;
                        if (logHeight > minHeight) {
                            var h = msg.height();
                            msg.height(h + heightIncrement);
                            if (scroll1 === 0) {
                                msg.scrollTop(0);
                            }
                        }
                    }
                }, 10);
                chatMessageTyping(session);
            }
        } else {
            chatMessageTyping(session);
        }
    };
});

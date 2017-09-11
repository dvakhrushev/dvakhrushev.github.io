define(function (require, exports, module) {
    var variables = require('client-chat-ui/variables');
    var notTyping = require('client-chat-ui/notTyping');

    return function (session, msg) {
        if (variables.typingTimer) {
            window.clearTimeout(variables.typingTimer);
        } else {
            session.sendTyping(msg);
            variables.msgTypingInterval = window.setInterval(function () {
                session.sendTyping($('#input-field').val());
            }, variables.msgTypingTimeout * 1000);
        }

        variables.typingTimer = window.setTimeout(function () {
            notTyping(session);
        }, variables.notTypingTimeout * 1000);
    };
});

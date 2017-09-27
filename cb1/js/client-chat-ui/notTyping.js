define(function (require, exports, module) {
    var variables = require('client-chat-ui/variables');

    return function (session) {
        if (variables.typingTimer) {
            window.clearInterval(variables.msgTypingInterval);
            variables.msgTypingInterval = null;
            session.sendNotTyping();
            variables.typingTimer = null;
        }
    };
});

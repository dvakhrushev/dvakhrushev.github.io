define(function (require, exports, module) {
    var appendLog = require('client-chat-ui/appendLog');
    var sendMessage = require('client-chat-ui/sendMessage');
    var sendLocation = require('client-chat-ui/sendLocation');
    var sendNavigation = require('client-chat-ui/sendNavigation');
    var msgKeyPress = require('client-chat-ui/msgKeyPress');
    var notTyping = require('client-chat-ui/notTyping');

    return function(){
        $.chatUI = {
            appendLog: appendLog,
            sendMessage: sendMessage,
            sendLocation: sendLocation,
            sendNavigation: sendNavigation,
            msgKeyPress: msgKeyPress,
            notTyping: notTyping
        };
    };
});

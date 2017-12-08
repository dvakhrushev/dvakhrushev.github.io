define(function (require, exports, module) {
    var onReady         = require('client-chat-page/onReady');
    var onMessage       = require('client-chat-page/onMessage');
    var clientChatUI    = require('client-chat-ui');

    clientChatUI();

    $(window).on("message", function (event) {
        onMessage(event);
    });

    $(document).ready(function () {
        onReady();
    });
});

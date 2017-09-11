define(function (require, exports, module) {
    var sendXhr = require('chat-api-session/sendXhr');

    return function (cp) {
        var getActiveChatsEndpoint = 'chats/active?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

        return sendXhr(cp, getActiveChatsEndpoint, 'GET');
    };
});

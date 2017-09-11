define(function (require, exports, module) {
    var sendXhr = require('chat-api-session/sendXhr');

    return function (cp, sessionId) {
        var historyEndpoint = 'chats/' + sessionId + '/history?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, historyEndpoint, "GET");
    };
});

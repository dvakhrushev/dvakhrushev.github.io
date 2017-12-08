define(function (require, exports, module) {
    var sendXhr = require('chat-api-session/sendXhr');

    return function (cp) {
        var endpoint = 'availability?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

        return sendXhr(cp, endpoint, 'GET');
    };
});

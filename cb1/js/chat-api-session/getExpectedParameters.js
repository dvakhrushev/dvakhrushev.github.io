define(function (require, exports, module) {
    var sendXhr = require('chat-api-session/sendXhr');

    return function (cp) {
        var getParametersEndpoint = 'parameters?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

        return sendXhr(cp, getParametersEndpoint, 'GET');
    };
});

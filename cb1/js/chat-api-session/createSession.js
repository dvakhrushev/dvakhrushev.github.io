define(function (require, exports, module) {
    var variables = require('chat-api-session/variables');
    var sendXhr = require('chat-api-session/sendXhr');
    var createSessionHandler = require('chat-api-session/createSessionHandler');

    return function (cp) {
        
        variables.logging = cp.parameters.logging;

        var endpoint = 'chats?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

        return sendXhr(cp, endpoint, 'POST', {
            phone_number: cp.phone_number,
            from: cp.from,
            parameters: cp.parameters
        }).pipe(function (r) {
            r.session = createSessionHandler(cp, r);
            return r;
        });

    };
});

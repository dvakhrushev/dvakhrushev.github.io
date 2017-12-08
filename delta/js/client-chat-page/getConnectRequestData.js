define(function (require, exports, module) {
    var variables = require('client-chat-page/variables');

    return function () {
        return {
            crossDomain: true,
            clientId: 'WebChat',
            url: variables.cp.webServer,
            appId: variables.cp.appId,
            tenantUrl: variables.cp.tenantUrl,
            from: variables.cp.from,
            phone_number: variables.cp.phone_number,
            parameters: variables.cp.parameters || {}
        };
    };
});

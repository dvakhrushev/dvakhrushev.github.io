define(function (require, exports, module) {
    return function (cp, endpoint, method) {
        var url = cp.url + '/' + endpoint + "&timestamp=" + (new Date().getTime());
        var xhrOptions = {
            type: method,
            url: url,
            headers: {
                Authorization: 'MOBILE-API-140-327-PLAIN appId="' + cp.appId + '", clientId="' + cp.clientId + '"'
            }
        };

        if (cp.crossDomain) {
            xhrOptions.crossDomain = true;
            xhrOptions.xhrFields = {withCredentials: true};
        }

        return xhrOptions;
    };
});

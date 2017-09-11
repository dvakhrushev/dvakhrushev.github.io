define(function (require, exports, module) {
    var config = require('snippet/variables');

    return function () {

        var location = '';

        if (config.SP.location) {
            location += "&latitude=" + encodeURIComponent(config.SP.location.latitude + '');
            location += "&longitude=" + encodeURIComponent(config.SP.location.longitude + '');
        }

        return config.SP.chatPath + "client-chat-page.html?"
            + "tenantUrl=" + encodeURIComponent(config.SP.tenantUrl)
            + "&appId=" + config.SP.appId
            + "&referrer=" + encodeURIComponent(window.location.href)
            + "&referrerTitle=" + encodeURIComponent(window.document.title)
            + "&webServer=" + encodeURIComponent(config.SP.apiUrl)
            + "&logging=" + encodeURIComponent(config.SP.logging || '')
            + location
            + "&phone_number=" + encodeURIComponent(config.SP.phone_number || '')
            + "&from=" + encodeURIComponent(config.SP.from || '')
            + "&email=" + encodeURIComponent(config.SP.email || '')
            + "&account_number=" + encodeURIComponent(config.SP.account_number || '')
            + "&last_name=" + encodeURIComponent(config.SP.last_name || '')
            + "&first_name=" + encodeURIComponent(config.SP.first_name || '')
            + "&togetherJS_enabled=" + encodeURIComponent(config.SP.togetherJS_enabled || '');
    };
});

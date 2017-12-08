define(function (require, exports, module) {
    var config = require('snippet/variables');

    return function (n, p) {
        
        var name = n ? n : encodeURIComponent(config.SP.first_name || '')
        var phone = p ? p : encodeURIComponent(config.SP.phone_number || '')
        var location = '';
        
        if (config.SP.location) {
            location += "&latitude=" + encodeURIComponent(config.SP.location.latitude + '');
            location += "&longitude=" + encodeURIComponent(config.SP.location.longitude + '');
        }
        var chatPath = config.SP.chatPath;
        chatPath = (chatPath.substr(chatPath.length - 1) =="/") ? chatPath : chatPath + "/";
        return chatPath + "client-chat-page.html?"
            + "tenantUrl=" + encodeURIComponent(config.SP.tenantUrl)
            + "&appId=" + config.SP.appId
            + "&referrer=" + encodeURIComponent(window.location.href)
            + "&referrerTitle=" + encodeURIComponent(window.document.title)
            + "&webServer=" + encodeURIComponent(config.SP.apiUrl)
            + "&logging=" + encodeURIComponent(config.SP.logging || '')
            + location
            + "&phone_number=" + p
            + "&from=" + encodeURIComponent(config.SP.from || '')
            + "&email=" + encodeURIComponent(config.SP.email || '')
            + "&account_number=" + encodeURIComponent(config.SP.account_number || '')
            + "&last_name=" + encodeURIComponent(config.SP.last_name || '')
            + "&first_name=" + n
            + "&togetherJS_enabled=" + encodeURIComponent(config.SP.togetherJS_enabled || '');
    };
});

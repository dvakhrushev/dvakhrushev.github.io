define(function (require, exports, module) {
    var configuration = require('snippet/configurationSnippet');
    var getConfObject = require('snippet/getConfObject');
    var openChat = require('snippet/openChat');

    return function (available) {

        var cw = $('#sp-chat-widget');

        if (SERVICE_PATTERN_CHAT_CONFIG.hidden && !window.sessionStorage.getItem("sp-chat-snippet")) {
            return;
        }

        var config = getConfObject();

        configuration();

        cw.css("display", "block");

        var text = config.definition.contactTab.agentsAvailableMsg || '';
        var icon = config.definition.contactTab.iconUrl || '';
        $('#sp-chat-label-text').text(text || '');
        $('#sp-chat-label-icon').attr('style', 'background:url("'+icon+'") center center no-repeat/contain');

        $('#sp-offline-label').css("display", available ? "none" : "block");
        $('#sp-online-label').css("display", available ? "block" : "none");

        cw.css("cursor", "pointer");
        cw.bind('click', function () {
            openChat(true);
        });
        if (window.sessionStorage.getItem("sp-chat-snippet")) {
            openChat(true);
        }
    };
});

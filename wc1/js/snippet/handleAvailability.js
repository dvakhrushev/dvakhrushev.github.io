define(function (require, exports, module) {
    var configuration = require('snippet/configurationSnippet');
    var getConfObject = require('snippet/getConfObject');
    var openChat = require('snippet/openChat');
    var createSession = require('chat-api-session/createSession');
    var platform = require('libraries/platform/platform.min');
    var previewMode = require('constructor/previewMode');

    return function (available) {

        if(!previewMode) {

            var cw = $('#sp-chat-widget');

            if (SERVICE_PATTERN_CHAT_CONFIG.hidden && !window.sessionStorage.getItem("sp-chat-snippet")) {
                return;
            }

            var config = getConfObject();

            configuration();

            //cw.css("display", "block");
            cw.css("cursor", "pointer");

            $('#sp-callback-form').css("display", "block");
            $('#sp-callback-submit').click(function() {
                $('#sp-callback-form').css("display", "none");
                var cp = {};
                cp.clientId = SERVICE_PATTERN_CHAT_CONFIG.clientId;
                cp.apiUrl = SERVICE_PATTERN_CHAT_CONFIG.apiUrl;
                cp.chatPath = SERVICE_PATTERN_CHAT_CONFIG.chatPath;
                cp.url = SERVICE_PATTERN_CHAT_CONFIG.apiUrl;
                cp.appId = SERVICE_PATTERN_CHAT_CONFIG.appId;
                cp.tenantUrl = SERVICE_PATTERN_CHAT_CONFIG.tenantUrl;
                cp.phone_number = $('#sp-callback-phone').val();
                // cp.from = $('#sp-callback-name').val();
                cp.parameters = {
                    email: $('#sp-callback-email').val(),
                    last_name: $('#sp-callback-last-name').val(),
                    first_name: $('#sp-callback-first-name').val(),
                    account_number: $('#sp-callback-first-account').val(),
                    logging: SERVICE_PATTERN_CHAT_CONFIG.logging,
                    user_platform: {
                        browser: platform.name + ' ' + platform.version,
                        os: platform.os.toString(),
                        description: platform.description
                    }
                };
                createSession(cp);
            });

            var text = config.definition.contactTab.agentsAvailableMsg || '';
            var icon = config.definition.contactTab.iconUrl || '';
            $('#sp-chat-label-text').text(text || '');
            $('#sp-chat-label-icon').attr('style', 'background:url("'+icon+'") center center no-repeat/contain');

            $('#sp-offline-label').css("display", available ? "none" : "block");
            $('#sp-online-label').css("display", available ? "block" : "none");


            cw.bind('click', function () {
                openChat(true);
            });
            $('body').on('click', '.proactive-offer__button', function () {
                openChat(true);
                $('.proactive-offer').remove();
            });

            if (window.sessionStorage.getItem("sp-chat-snippet")) {
                openChat(true);
            }

        }
    };
});

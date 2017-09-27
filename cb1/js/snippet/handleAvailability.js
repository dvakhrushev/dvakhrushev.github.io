define(function (require, exports, module) {
    var configuration = require('snippet/configurationSnippet');
    var getConfObject = require('snippet/getConfObject');
    var openChat = require('snippet/openChat');
    var createSession = require('chat-api-session/createSession');
    var platform = require('libraries/platform/platform.min');
    var previewMode = require('constructor/previewMode');
    var proactiveChatStarter = require('snippet/proactiveChatStarter');
    
    return function (available) {
        if(!previewMode) {


            var def = getConfObject().definition;

            if (def.proactiveOffer.enabled) {

                $("head").append("<link href='" + SERVICE_PATTERN_CHAT_CONFIG.chatPath + "css/proactive-offer.css' type='text/css' rel='stylesheet' />");

                var proactiveConf = {};
                    proactiveConf.proactiveOfferCondition = def.proactiveOfferCondition;
                    proactiveConf.proactiveOfferStyling = def.proactiveOfferStyling;

                var paChatButtonText = def.proactiveOffer.chatButtonText,
                    paCallButtonText = def.proactiveOffer.callButtonText,
                    paCancelButtonText = def.proactiveOffer.cancelButtonText,
                    paHeight = def.proactiveOfferStyling.height,
                    paWidth = def.proactiveOfferStyling.width,
                    paCallButton = def.proactiveOffer.callButtonEnabled ? '<button data-tab="call" class="button-primary proactive-offer__button proactive-offer__button_type_call main-background-color second-color">' + paCallButtonText + '</button>' : '',
                    paChatButton = def.proactiveOffer.chatButtonEnabled ? '<button data-tab="chat" class="button-primary proactive-offer__button proactive-offer__button_type_chat main-background-color second-color">' + paChatButtonText + '</button>' : '',
                    paCloseButton = '<button class="button-primary proactive-offer__button proactive-offer__close main-background-color second-color">' + paCancelButtonText + '</button>',
                    paCloseIcon = def.proactiveOffer.closeButtonEnabled ? '<div class="proactive-offer__close close-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path clip-rule="evenodd" d="M14.318 15l-6.818-6.818-6.818 6.818-.682-.682 6.819-6.818-6.819-6.818.682-.682 6.818 6.818 6.818-6.818.682.682-6.818 6.818 6.818 6.818-.682.682z" /></svg></div>' : '',
                    paHtmlContent = def.proactiveOffer.htmlContent;

                proactiveChatStarter(proactiveConf, proactiveChat);

                function proactiveChat()
                { 
                    if($('#sp-chat-iframe').length == 0)
                    var paCode =    '<div class="proactive-offer base-font">'+
                                        '<div class="widget-border widget-border-radius">'+
                                            '<div style="width:' + paWidth + 'px;height:' + paHeight + 'px;" class="proactive-offer__body content-margin widget-background">'+
                                                paCloseIcon +
                                                '<div class="proactive-offer__content">' + paHtmlContent + '</div>'+
                                                '<div class="proactive-offer__button-wrapper">'+
                                                    paCloseButton +
                                                    paChatButton +
                                                    paCallButton +
                                                '</div>'+
                                            '</div>'+
                                        '</div>';
                                    '</div>';
                    $('body').append(paCode);
                }

            }



            var cw = $('#sp-chat-widget');

            if (SERVICE_PATTERN_CHAT_CONFIG.hidden && !window.sessionStorage.getItem("sp-chat-snippet")) {
                return;
            }


            configuration();

            cw.css("display", "block");
            cw.css("cursor", "pointer");

            $('#sp-callback-form').css("display", "inline-block");
            $('#sp-callback-submit').click(function() {
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
                    last_name: $('#sp-callback-name').val(),
                    first_name: $('#sp-callback-name').val(),
                    account_number: $('#sp-callback-first-account').val(),
                    logging: SERVICE_PATTERN_CHAT_CONFIG.logging,
                    user_platform: {
                        browser: platform.name + ' ' + platform.version,
                        os: platform.os.toString(),
                        description: platform.description
                    }
                };

                
                createSession(cp).done(function(e){
                    openChat(true, false, e);
                });
                //$('#sp-callback-form').html('<div class="callback_message">We will call you soon</div>');
                $('#sp-callback-form').addClass('sended');
            });

            var text = def.contactTab.agentsAvailableMsg || '';
            var icon = def.contactTab.iconUrl || '';
            $('#sp-chat-label-text').text(text || '');
            $('#sp-chat-label-icon').attr('style', 'background:url("'+icon+'") center center no-repeat/contain');

            $('#sp-offline-label').css("display", available ? "none" : "block");
            $('#sp-online-label').css("display", available ? "block" : "none");


            cw.on('click', function () {
                openChat(true);
            });
            $('body').on('click', '.proactive-offer__button:not(.proactive-offer__close)', function () {
                window.sessionStorage.setItem("tab", $(this).attr('data-tab'));
                openChat(true);

                $('.proactive-offer').remove();
            });

            $('body').on('click', '.proactive-offer__close', function () {
                $('.proactive-offer').remove();
            });

            if (window.sessionStorage.getItem("sp-chat-snippet")) {
                openChat(true);
            }

        }
    };
});

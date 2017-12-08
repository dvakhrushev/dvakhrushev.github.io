define(function (require, exports, module) {
    var configurationSnippet = require('snippet/configurationSnippet');
    var getConfObject = require('snippet/getConfObject');
    var openChat = require('snippet/openChat');
    var createSession = require('chat-api-session/createSession');
    var platform = require('libraries/platform/platform.min');
    var previewMode = require('constructor/previewMode');
    var proactiveChatStarter = require('snippet/proactiveChatStarter');
    var getConf = require('getConf');
    var generateInputs = require('client-chat-page/generateInputs');
    
    return function (available) {


        if(!previewMode) {

            var conf = sessionStorage.getItem("confParams"),
                confObj = JSON.parse(conf),
                target = getConf(conf),
                poConfig = confObj.definition.proactiveOffers[target.proactiveOffer.widgetIndex],
                snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];
                var conf = sessionStorage.getItem("confParams"),
                confObj = JSON.parse(conf),
                target = getConf(conf);

                //Warnings
                if ($('#sp-callback-form.sp-callback-form').length==0){
                    if (confObj.definition.chatInitiations.length == 0){
                        console.warn('No contact tab configuration'); 
                    } else if (typeof target.chatInitiation.widgetIndex === 'undefined'){
                        console.warn('No contact tab configuration assigned for the current URL'); 
                    } 
                    if (confObj.definition.proactiveOffers.length == 0){
                        console.warn('No proactive offer configuration'); 
                    } else if (typeof target.proactiveOffer.widgetIndex === 'undefined'){
                        console.warn('No contact tab configuration assigned for the current URL'); 
                    } 
                }
                

            if (target.chatInitiation && typeof target.chatInitiation.widgetIndex !== 'undefined'){
                
                var contactTabHidden = (!snippetConfig.contactTab.enabled || (snippetConfig.contactTab.doNotShowAfterHours && window.sessionStorage.getItem('serviceAvailable') !='true'))? true : false;
                if (!contactTabHidden){
                    $('#sp-chat-widget').removeAttr('data-hidden');
                }

                if(confObj && confObj.definition && confObj.definition.chatWidgetStyling.webNotificationsEnabled == false){
                    window.localStorage.setItem('doNotShowNotifications', 'true');
                } else {
                    window.localStorage.removeItem('doNotShowNotifications');
                }
                
                if (poConfig && poConfig.properties.enabled) {
                    var chatPath = SERVICE_PATTERN_CHAT_CONFIG.chatPath;
                    chatPath = (chatPath.substr(chatPath.length - 1) =="/") ? chatPath : chatPath + "/";
                    $("head").append("<link href='" + chatPath + "css/proactive-offer.css' type='text/css' rel='stylesheet' />");
                    

                    


                    var proactiveConf = {};
                        proactiveConf.proactiveOfferCondition = poConfig.conditions;
                        proactiveConf.proactiveOfferStyling = poConfig.styling;

                    var paChatButtonText = poConfig.properties.chatButtonText,
                        paCallButtonText = poConfig.properties.callButtonText,
                        paCancelButtonText = poConfig.properties.cancelButtonText,
                        paHeight = poConfig.styling.height,
                        paWidth = poConfig.styling.width,
                        paCallButton = poConfig.properties.callButtonEnabled ? '<button data-tab="call" class="button-primary proactive-offer__button proactive-offer__button_type_call main-background-color second-color">' + paCallButtonText + '</button>' : '',
                        paChatButton = poConfig.properties.chatButtonEnabled ? '<button data-tab="chat" class="button-primary proactive-offer__button proactive-offer__button_type_chat main-background-color second-color">' + paChatButtonText + '</button>' : '',
                        paLeaveMessage = '<button class="button-primary proactive-offer__button proactive-offer__button_type_email main-background-color second-color">Leave message</button>',
                        paCloseButton = '<button class="button-primary proactive-offer__button proactive-offer__close main-background-color second-color">' + paCancelButtonText + '</button>',
                        paCloseIcon = poConfig.properties.closeButtonEnabled ? '<div class="proactive-offer__close close-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path clip-rule="evenodd" d="M14.318 15l-6.818-6.818-6.818 6.818-.682-.682 6.819-6.818-6.819-6.818.682-.682 6.818 6.818 6.818-6.818.682.682-6.818 6.818 6.818 6.818-.682.682z" /></svg></div>' : '',
                        paHtmlContent = poConfig.properties.htmlContent,
                        paButtons = window.sessionStorage.getItem('serviceAvailable') =='true' ? paCloseButton + paChatButton + paCallButton : paCloseButton + paLeaveMessage;
                        paAnimationIn = poConfig.styling.animationIn;
                        paAnimationOut = poConfig.styling.animationOut;

                    if(sessionStorage.getItem('serviceAvailable') != 'false'){
                        proactiveChatStarter(proactiveConf, proactiveChat);
                    }
                    

                    function proactiveChat()
                    { 
                        if($('#sp-chat-iframe').length == 0)
                        var paCode =    '<div class="proactive-offer base-font" data-animationIn="' + paAnimationIn + '"  data-animationOut="' + paAnimationOut + '">'+
                                            '<div class="widget-border widget-border-radius">'+
                                                '<div style="width:' + paWidth + 'px;height:' + paHeight + 'px;" class="proactive-offer__body content-margin widget-background">'+
                                                    paCloseIcon +
                                                    '<div class="proactive-offer__content-wrapper">'+
                                                        '<div class="proactive-offer__content">' + paHtmlContent + '</div>'+
                                                        '<div class="proactive-offer__button-wrapper">'+
                                                            paButtons +
                                                        '</div>'+
                                                    '</div>'+
                                                '</div>'+
                                            '</div>';
                                        '</div>';
                        $('body').append(paCode);
        
                        setTimeout(function(){

                            var contentHeight = $('.proactive-offer__content').outerHeight(),
                                contentWidth = $('.proactive-offer__content').outerWidth(),
                                buttonsHeight = $('.proactive-offer__button-wrapper').outerHeight(),
                                buttonsWidth = 30,
                                screenWidth = $('.proactive-offer').width()-80;
                                screenHeight = $('.proactive-offer').height()-80;
                            $('.proactive-offer__button-wrapper > *').each(function(){
                                buttonsWidth += $(this).width()-30;
                            });
                            var POheight = contentHeight + buttonsHeight,
                                POwidth = Math.max.apply(Math,[contentWidth, buttonsWidth]);
                            
                            if(POwidth > screenWidth) {
                                var coefX = screenWidth/POwidth;
                            }
                            if (POheight > screenHeight) {
                                var coefY = screenHeight/POheight;
                            }
                            if (coefX || coefY) {
                                var coef = Math.max.apply(Math,[coefX, coefY]),
                                        scale = 100/coef;
                                $('.proactive-offer__content-wrapper>div').attr('style','transform:scale(' + coef + ');')
                                $('.proactive-offer__content').css('width',scale + '%')
                            }
                        },100)
                    }
                }

                var cw = $('#sp-chat-widget');

                if (SERVICE_PATTERN_CHAT_CONFIG.hidden && !window.sessionStorage.getItem("sp-chat-snippet")) {
                    return;
                }
                
                configurationSnippet(snippetConfig, confObj.styles);

                if(snippetConfig){
                    cw.css("display", "block");
                    cw.css("cursor", "pointer");
                }

                cw.on('click', function () {
                    sessionStorage.setItem('source','widget');
                    openChat(true);
                });

                $('body').on('click', '.proactive-offer__button:not(.proactive-offer__close)', function () {
                    var conf = sessionStorage.getItem("confParams"),
                        confObj = JSON.parse(conf),
                        target = getConf(conf),
                        poConfig = confObj.definition.proactiveOffers[target.proactiveOffer.widgetIndex];
                    window.sessionStorage.setItem("tab", $(this).attr('data-tab'));
                    openChat(true);
                    window.sessionStorage.setItem("source", 'proactive');

                    $('.proactive-offer').remove();
                });
            }

            $('#sp-callback-form').css("display", "inline-block");
   
            $('#sp-callback-submit, #sp-chat-submit, #sp-callback-form button:contains("Chat"), #sp-callback-form button:contains("Call"), #sp-callback-form button:contains("Request Call")').click(function() {
                
                var cp = {};

                var first_name = "";
                if ($('#sp-callback-name').val()) {
                    first_name = $('#sp-callback-name').val();
                } else if (SERVICE_PATTERN_CHAT_CONFIG.first_name) {
                    first_name = SERVICE_PATTERN_CHAT_CONFIG.first_name;
                }

                var last_name = "";
                if ($('#sp-callback-lastname').val()) {
                    last_name = $('#sp-callback-lastname').val();
                } else if (SERVICE_PATTERN_CHAT_CONFIG.last_name) {
                    last_name = SERVICE_PATTERN_CHAT_CONFIG.last_name;
                }

                var email = "";
                if ($('#sp-callback-lastname').val()) {
                    email = $('#sp-callback-email').val();
                } else if (SERVICE_PATTERN_CHAT_CONFIG.email) {
                    email = SERVICE_PATTERN_CHAT_CONFIG.email;
                }

                var phone_number = "";
                if ($('#sp-callback-phone_number').val()) {
                    phone_number = $('#sp-callback-phone_number').val();
                } else if (SERVICE_PATTERN_CHAT_CONFIG.phone_number) {
                    phone_number = SERVICE_PATTERN_CHAT_CONFIG.phone_number;
                }


                cp.clientId = (typeof SERVICE_PATTERN_CHAT_CONFIG.clientId !== 'undefined') ? SERVICE_PATTERN_CHAT_CONFIG.clientId : 'Webchat';
                cp.apiUrl = SERVICE_PATTERN_CHAT_CONFIG.apiUrl;
                cp.chatPath = SERVICE_PATTERN_CHAT_CONFIG.chatPath;
                cp.url = SERVICE_PATTERN_CHAT_CONFIG.apiUrl;
                cp.appId = SERVICE_PATTERN_CHAT_CONFIG.appId;
                cp.tenantUrl = SERVICE_PATTERN_CHAT_CONFIG.tenantUrl;
                cp.phone_number = phone_number;

                
                // cp.from = $('#sp-callback-name').val();
                cp.parameters = {
                    email: email,
                    last_name: last_name,
                    first_name: first_name,
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


                if ($(this).attr('id') == 'sp-chat-submit'){
                    var suffix = "Chat";
                } else {
                    var suffix = $(this).text();
                }
                
                window.sessionStorage.removeItem('source', 'callbackFormChat');
                window.sessionStorage.removeItem('source', 'callbackFormCall');
                window.sessionStorage.setItem('source', 'callbackForm'+suffix);

                if(window.sessionStorage.getItem('source') == 'callbackFormCall' || window.sessionStorage.getItem('source') == 'callbackFormRequest Call'){
                    $('#sp-callback-form').addClass('sended');
                }

            });

            $('#sp-offline-label').css("display", available ? "none" : "block");
            $('#sp-online-label').css("display", available ? "block" : "none");


            $('body').on('click', '.proactive-offer__close', function () {
                $('.proactive-offer').addClass('removing');
                setTimeout(function(){
                    $('.proactive-offer').remove();
                }, 500)
            });

            if (window.sessionStorage.getItem("sp-chat-snippet")) {
                openChat(true);
            }
        }
    };
});

define(function (require, exports, module) {
    var variables = require('snippet/variables');
    var checkAvailability = require('snippet/checkAvailability');
    var getConfObject = require('snippet/getConfObject');
    var openChat = require('snippet/openChat');
    var togetherJsStop = require('snippet/togetherJsStop');
    var togetherJsStart = require('snippet/togetherJsStart');
    var showNotification = require('snippet/showNotification');
    var previewMode = require('constructor/previewMode');
    var proactiveChatStarter = require('snippet/proactiveChatStarter');

    if (previewMode) {

        var code = require('constructor/previewCode');

    } else {

        var def = getConfObject().definition;

        if (def.proactiveOffer.enabled) {

            $("head").append("<link href='" + variables.SP.chatPath + "css/proactive-offer.css' type='text/css' rel='stylesheet' />");

            var proactiveConf = {};
                proactiveConf.proactiveOfferCondition = def.proactiveOfferCondition;
                proactiveConf.proactiveOfferStyling = def.proactiveOfferStyling;

            var paChatButtonText = def.proactiveOffer.chatButtonText,
                paCallButtonText = def.proactiveOffer.callButtonText,
                paCancelButtonText = def.proactiveOffer.cancelButtonText,
                paHeight = def.proactiveOfferStyling.height,
                paWidth = def.proactiveOfferStyling.width,
                paCallButton = def.proactiveOffer.callButtonEnabled ? '<button class="button-primary proactive-offer__button proactive-offer__button_type_call main-background-color second-color">' + paCallButtonText + '</button>' : '',
                paChatButton = def.proactiveOffer.chatButtonEnabled ? '<button class="button-primary proactive-offer__button proactive-offer__button_type_chat main-background-color second-color">' + paChatButtonText + '</button>' : '',
                paCloseButton = def.proactiveOffer.closeButtonEnabled ? '<div class="proactive-offer__close close-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path clip-rule="evenodd" d="M14.318 15l-6.818-6.818-6.818 6.818-.682-.682 6.819-6.818-6.819-6.818.682-.682 6.818 6.818 6.818-6.818.682.682-6.818 6.818 6.818 6.818-.682.682z" /></svg><span>' + paCancelButtonText + '</span></div>' : '',
                paHtmlContent = def.proactiveOffer.htmlContent;

            proactiveChatStarter(proactiveConf, proactiveChat);

            function proactiveChat()
            {
                console.log($('#sp-chat-iframe').length);
                if($('#sp-chat-iframe').length == 0)
                var paCode =    '<div class="proactive-offer base-font widget-border-radius">'+
                                    '<div style="width:' + paWidth + 'px;height:' + paHeight + 'px;" class="proactive-offer__body content-margin widget-background">'+
                                        paCloseButton +
                                        '<div class="proactive-offer__content">' + paHtmlContent + '</div>'+
                                        '<div class="proactive-offer__button-wrapper">'+
                                            paChatButton +
                                            paCallButton +
                                        '</div>'+
                                    '</div>'+
                                '</div>';
                $('body').append(paCode);
            }

        }


        var code = "<div id='sp-root-container'>" +
                    "<div id='sp-chat-widget'> " +
                        '<div class="sp-chat-widget__content main-background-color contact-tab-border">' +
                            "<div id='sp-chat-label-icon'>" +
                                //"<svg  id=\"tab_icon\" xmlns=\"http://www.w3.org/2000/svg\" width=\"26\" height=\"23.001\"><path fill-rule=\"evenodd\" clip-rule=\"evenodd\" fill=\"#fff\" d=\"M21.175 19.909c.272.658.971 1.665 2.825 3.091-3.34.039-5.64-1.155-6.889-2.049-.365.03-.735.049-1.111.049-2.761 0-5.26-.839-7.069-2.195.833.125 1.69.195 2.569.195 6.797 0 12.403-3.91 13.346-8.993.734 1.044 1.154 2.23 1.154 3.493 0 2.72-1.937 5.094-4.825 6.409zm-9.675-2.909c-.436 0-.865-.021-1.289-.057-1.151 1.197-3.562 3.1-7.211 3.057 2.113-1.626 2.739-3.136 2.924-4.068-3.531-1.452-5.924-4.234-5.924-7.432 0-4.694 5.148-8.5 11.5-8.5s11.5 3.806 11.5 8.5-5.148 8.5-11.5 8.5z\"/></svg>" +
                            "</div>" +
                            '<div id="sp-chat-label-text" class="base-font contact-tab-font second-color"></div>' +
                        '</div>' +
                    "</div>" +
                    "<div id='sp-chat-fake'></div>" +
                    "<div id='sp-chat-frame'>" +
                        "<div id='sp-drag-handle'></div>" +
                        "<div id='sp-side-bar'>" +
                            "<div id='sp-close-frame' class='close-icon'><svg xmlns='http://www.w3.org/2000/svg' width='15' height='15'><path clip-rule='evenodd' d='M14.318 15l-6.818-6.818-6.818 6.818-.682-.682 6.819-6.818-6.819-6.818.682-.682 6.818 6.818 6.818-6.818.682.682-6.818 6.818 6.818 6.818-.682.682z' /></svg></div>" +
                        "</div>" +
                        "<div id='sp-iframe-container'></div>" +
                    "</div>" +
                "</div>";
    }

    return function () {

        if (previewMode){
            $("head").append("<link href='" + variables.SP.chatPath + "css/wrong.css' type='text/css' rel='stylesheet' />");
            $("head").append("<link href='" + variables.SP.chatPath + "css/override.css' type='text/css' rel='stylesheet' />");
            $("head").append("<link href='" + variables.SP.chatPath + "css/preview.css' type='text/css' rel='stylesheet' />");
            $("head").append("<link href='" + variables.SP.chatPath + "css/proactive-offer.css' type='text/css' rel='stylesheet' />");
            $("#sp-chat-widget").attr('style','');
        }

        $("head").append("<link href='" + variables.SP.chatPath + "css/snippet.css' type='text/css' rel='stylesheet' />");

        $("body").append(code);

        $('#sp-close-frame').bind('click', function () {
            document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-disconnect", "*");
        });

        (function () {
            var hidden = "hidden";

            var safeWrap = function (func) {
                if (func) {
                    if (typeof console !== 'undefined') {
                        console.log('Snippet will wrap the site function %o', func);
                    }
                    func();
                }
                onchange();
            };

            // Standards:
            if (hidden in document)
                document.addEventListener("visibilitychange", onchange);
            else if ((hidden = "mozHidden") in document)
                document.addEventListener("mozvisibilitychange", onchange);
            else if ((hidden = "webkitHidden") in document)
                document.addEventListener("webkitvisibilitychange", onchange);
            else if ((hidden = "msHidden") in document)
                document.addEventListener("msvisibilitychange", onchange);
            // IE 9 and lower:
            else if ("onfocusin" in document) {
                document.onfocusin = safeWrap(document.onfocusin);
                document.onfocusout = safeWrap(document.onfocusout);
            }
            // All others:
            else {
                window.onpageshow = safeWrap(window.onpageshow);
                window.onpagehide = safeWrap(window.onpagehide);
                window.onfocus = safeWrap(window.onfocus);
                window.onblur = safeWrap(window.onblur);
            }

            function onchange(evt) {
                var h = "sp-hidden";
                var evtMap = {
                    blur: h,
                    focusout: h,
                    pagehide: h
                };

                evt = evt || window.event;
                var $sp = $("#sp-root-container");
                $sp.removeClass(h);
                if (evt.type in evtMap)
                    $sp.addClass(evtMap[evt.type]);
                else if (this[hidden]) {
                    $sp.addClass(h);
                }

                if (!$sp.hasClass(h)) {
                    var arrayLength = variables.notifications.length;
                    for (var i = 0; i < arrayLength; i++) {
                        variables.notifications[i].close();
                    }
                }
            }

            // set the initial state (but only if browser supports the Page Visibility API)
            if (document[hidden] !== undefined)
                onchange({type: document[hidden] ? "blur" : "focus"});
        })();

        $(window).on("message", function (event) {
            var data = event.originalEvent.data;
            var config = getConfObject();
            var width = config.definition.chatWidgetStyling.width;
            var height = parseInt(config.definition.chatWidgetStyling.height) - 10;

            if (data === 'sp-session-end') {
                if (!variables.init) {
                    window.setTimeout(function () {
                        openChat(false, true);
                        togetherJsStop();
                    }, 500);
                } else {
                    openChat(false, true);
                    togetherJsStop();
                }
            } else if (data == 'sp-chat-init') {
                $("#sp-drag-handle").height("0px");
                $("#sp-chat-frame").height(height);
                $('#sp-chat-frame').width(width);
                $("#sp-chat-frame").css("top", "");
            } else if (data == 'sp-chat-drag') {
                var location = config.definition.contactTab.location;
                if (location.indexOf('_top') === -1
                    && location.indexOf('left_middle') === -1
                    && location.indexOf('left_bottom') === -1
                    && location.indexOf('right_') === -1
                    && location.indexOf('top_right') === -1) {
                    $("#sp-chat-frame").css("top", Math.max(0, $(window).height() - height) + "px");
                }
            } else if (data == 'sp-session-start') {
                if (window.Notification && window.Notification.permission !== 'denied') {
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-req-notification", "*");
                    window.Notification.requestPermission(function (permission) {
                        document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-req-notification-end", "*");
                    });
                }
            } else if (data.indexOf('sp-notification') > 0) {
                var parse = JSON.parse(data);
                showNotification(parse.name, parse.msg, parse.photo);
            } else if (data.indexOf('sp-storage') > 0) {
                var store = JSON.parse(data);
                window.localStorage.setItem(store.key, store.value);
            } else if (data === 'sp-start-together') {
                togetherJsStart();
            } else if (data === 'sp-stop-together') {
                togetherJsStop();
            } else if (data === 'sp-get-status-together') {
                if (TogetherJS.running) {
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-started-together", "*");
                } else {
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-stopped-together", "*");
                }
            }
        });

        SERVICE_PATTERN_CHAT_CONFIG.hidden = SERVICE_PATTERN_CHAT_CONFIG.hidden || window.localStorage.getItem("bp-bc") != null;

        checkAvailability(true);
    };
});

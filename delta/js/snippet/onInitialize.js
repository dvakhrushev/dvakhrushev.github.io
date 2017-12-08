define(function (require, exports, module) {
    var variables = require('snippet/variables');
    var checkAvailability = require('snippet/checkAvailability');
    var getConfObject = require('snippet/getConfObject');
    var openChat = require('snippet/openChat');
    var togetherJsStop = require('snippet/togetherJsStop');
    var togetherJsStart = require('snippet/togetherJsStart');
    var showNotification = require('snippet/showNotification');
    var previewMode = require('constructor/previewMode');
    var mobileCheck = require('snippet/mobileCheck');
    var getConf = require('getConf');
    

    return function () {

        var isMobile = (mobileCheck()) ? 'mobile-version' : '';
        var chatPath = variables.SP.chatPath;
        chatPath = (chatPath.substr(chatPath.length - 1) =="/") ? chatPath : chatPath + "/";
        
        if (previewMode) {

            window.parent.postMessage("initialization", "*");

            var code = require('constructor/previewCode');

            $("head").append("<link href='" + chatPath + "css/wrong.css' type='text/css' rel='stylesheet' />");
            $("head").append("<link href='" + chatPath + "css/override.css' type='text/css' rel='stylesheet' />");
            $("head").append("<link href='" + chatPath + "css/preview.css' type='text/css' rel='stylesheet' />");
            $("head").append("<link href='" + chatPath + "css/proactive-offer.css' type='text/css' rel='stylesheet' />");
            $("#sp-chat-widget").attr('style','');

        } else {
            
            var code = "<div style='display:none' id='sp-root-container' class='" + isMobile + "'>" +
                        "<div id='sp-chat-widget' data-hidden='hidden'> " +
                            '<div class="sp-chat-widget__content main-background-color contact-tab-border">' +
                                "<div id='sp-chat-label-icon'>" +
                                "</div>" +
                                '<div id="sp-chat-label-text" class="base-font contact-tab-font second-color"></div>' +
                            '</div>' +
                        "</div>" +
                        "<div id='sp-chat-fake'></div>" +
                        "<div id='sp-chat-frame'>" +
                            "<div id='sp-drag-handle'></div>" +
                            "<div id='sp-side-bar'>" +
                                "<div id='sp-close-frame' class='close-icon'><svg class='main-path-color' xmlns='http://www.w3.org/2000/svg' width='15' height='15'><path clip-rule='evenodd' d='M14.318 15l-6.818-6.818-6.818 6.818-.682-.682 6.819-6.818-6.819-6.818.682-.682 6.818 6.818 6.818-6.818.682.682-6.818 6.818 6.818 6.818-.682.682z' /></svg></div>" +
                            "</div>" +
                            "<div id='sp-iframe-container'></div>" +
                        "</div>" +
                    "</div>";

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
                var conf = sessionStorage.getItem("confParams"),
                    confObj = JSON.parse(conf),
                    target = getConf(conf),
                    snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];
                var width = confObj.definition.chatWidgetStyling.width;
                var height = Math.min.apply(Math,[parseInt(confObj.definition.chatWidgetStyling.height) - 10, window.parent.innerHeight - 20]);
                if(event.originalEvent.data == 'ready'){
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("[parentPath]="+window.location.pathname, "*");
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("[parentHost]="+window.location.host, "*");
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("[serviceAvailable]="+sessionStorage.getItem("serviceAvailable"), "*");
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage(conf, "*");
                }

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
                    if(!mobileCheck()){
                        $("#sp-chat-frame").height(height);
                        $('#sp-chat-frame').width(width);
                    }
                    // $("#sp-chat-frame").css("top", "");
                } else if (data == 'sp-chat-drag' && snippetConfig) {
                    var location = snippetConfig.contactTab.location;
                    if (location.indexOf('_top') === -1
                        && location.indexOf('left_middle') === -1
                        && location.indexOf('left_bottom') === -1
                        && location.indexOf('right_') === -1
                        && location.indexOf('top_right') === -1) {
                        // $("#sp-chat-frame").css("top", Math.max(0, $(window).height() - height) + "px");
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


        }
        
        $("head").append("<link href='" + chatPath + "css/snippet.css' type='text/css' rel='stylesheet' />");

        $("body").append(code);

        $('#sp-close-frame').on('click', function () {
            document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-disconnect", "*");
        });
        

        
    };
});

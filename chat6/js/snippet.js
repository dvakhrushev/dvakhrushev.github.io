(function() {


    var $;
    var SP = SERVICE_PATTERN_CHAT_CONFIG || {};

    var init = false;

    var notifications = [];

    var chatUrl = function() {
        var location = '';
        if(SP.location) {
            location += "&latitude=" + encodeURIComponent(SP.location.latitude + '');
            location += "&longitude=" + encodeURIComponent(SP.location.longitude + '');
        }
        return SP.chatPath + "client-chat-page.html?"
            + "tenantUrl=" + encodeURIComponent(SP.tenantUrl)
            + "&appId="     + SP.appId
            + "&referrer="  + encodeURIComponent(window.location.href)
            + "&referrerTitle="  + encodeURIComponent(window.document.title)            
            + "&webServer=" + encodeURIComponent(SP.apiUrl)
            + "&callback=" + encodeURIComponent(SP.callback || '')
            + "&subject=" + encodeURIComponent(SP.subject || '')
            + "&logging=" + encodeURIComponent(SP.logging || '')
            + location
			+ "&from=" + encodeURIComponent(SP.from || '')
            + "&email=" + encodeURIComponent(SP.email || '')
            + "&first_name=" + encodeURIComponent(SP.first_name || '')
            + "&returnURL=" + encodeURIComponent(window.location.href)
			+ "&phone=" + encodeURIComponent(SP.phone || '')
			+ "&phone_ext=" + encodeURIComponent(SP.phone_ext || '')
			+ "&bedrooms=" + encodeURIComponent(SP.bedrooms || '')
			+ "&bedrooms2=" + encodeURIComponent(SP.bedrooms2 || '')
			+ "&bathrooms=" + encodeURIComponent(SP.bathrooms || '')
			+ "&date=" + encodeURIComponent(SP.date || '')
			+ "&days=" + encodeURIComponent(SP.days || '')
			+ "&pets=" + encodeURIComponent(SP.pets || '')
			+ "&action=" + encodeURIComponent(SP.action || '');
			
			
			
			
			
			
    };

    var openChat = function(open, deleteIframe) {

        //if(mobileCheck()) {
            //window.location.replace(chatUrl());
            //return;
        //}

        keepOpenedState(open);

        var fr = $('#sp-chat-frame');
        var wi = $('#sp-chat-widget');

        var fakeTo = open ? fr : wi;
        var fakeFrom = open ? wi : fr;        
        
        if (fakeTo.is(':visible')) {
        	if (deleteIframe) {
                $('#sp-chat-iframe').remove();
        	}
        	return;
        }

        if(window.localStorage.getItem("bp-bc") != null) {
            fr.remove();
            return;
        }

        checkAddFrame();

        //hot fix for safari
        if(navigator.userAgent.indexOf("Safari") != -1 && navigator.userAgent.indexOf('Chrome') == -1) {
            fakeFrom.hide();
            fakeTo.toggle();
        } else {
            fakeTo.toggle();
            var offset = fakeTo.offset();
            var w = fakeTo.width();
            var h = fakeTo.height();
            fakeTo.toggle();

            var fake = $('#sp-chat-fake');
            fake.height(fakeFrom.height()).width(fakeFrom.width()).css(fakeFrom.offset());
            fakeFrom.hide();
            fake.toggle();
            fake.animate({
                width: w,
                height: h,
                right: offset.right,
                top: offset.top,
                left: offset.left
            }, 400, function() {
                fakeTo.toggle();
                fake.toggle();
                init = true;
                if(deleteIframe) {
                    $('#sp-chat-iframe').remove();
                } else {
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-dragged", "*");
                }
            });
        }
    };

    var keepOpenedState = function(opened) {
        if(opened) {
            window.sessionStorage.setItem("sp-chat-snippet", "true");
        } else {
            window.sessionStorage.removeItem("sp-chat-snippet");
        }
    };

    var isChatRendered = function() {
        return $('#sp-chat-iframe').length > 0;
    };

    var checkAddFrame = function() {
        if(!isChatRendered()) {

            if(SP.sound_notification) {
                audioElement.setAttribute('src', SP.sound_notification_file);
                audioElement.load();
            }

            //$("#sp-chat-frame").css("height", "420px");

            var html = "<iframe id=\"sp-chat-iframe\" frameborder=\"0\" scrolling=\"no\" src=" + chatUrl() + "></iframe>";
            $('#sp-iframe-container').append(html);

            $("#sp-chat-frame").draggable({
                handle: "#sp-drag-handle",
                start: function( event, ui ) {
                    $("#sp-drag-handle").height("100%");
                },
                drag: function(event, ui) {
                    var maxTop = Math.min($(window).height() - 400, ui.position.top);
                    var maxLeft = Math.min($(window).width() - SERVICE_PATTERN_CHAT_CONFIG.width - 70, ui.position.left);

                    ui.position.top = Math.max(20, maxTop);
                    ui.position.left = Math.max(20, maxLeft);

                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-dragged", "*");
                },
                stop: function( event, ui ) {
                    $("#sp-drag-handle").css("height", "");
                }
            });
        }
    };


    var mobileCheck = function() {
        var check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    var onInitialize = function() {
        $("head").append("<link href='" + SP.chatPath + "css/snippet.css" + "' type='text/css' rel='stylesheet' />");
        
        $("body").append(
                "<div id='sp-root-container'>" +
                "<div id='sp-chat-widget'> " +
				"<div id='sp-chat-label-before'></div>" +
                "<div id='sp-chat-label-icon'></div>" +
                "<div id='sp-chat-label-text'></div>" +
                "</div>" +
                "<div id='sp-chat-fake'></div>" +
                "<div id='sp-chat-frame'>" +
                "<div id='sp-iframe-container'></div>" +
                "</div>" +
                "</div>");

        $('#sp-close-frame').bind('click', function() {
            //openChat(false);
            //document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-disconnect", "*");
        });
		

        (function() {
            var hidden = "hidden";

            var safeWrap = function(func) {
                if(func) {
                    if(typeof console !== 'undefined') {
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

            function onchange (evt) {
                var h = "sp-hidden",
                    evtMap = {
                        blur:h, focusout:h, pagehide:h
                    };

                evt = evt || window.event;
                var $sp = $("#sp-root-container");
                $sp.removeClass(h);
                if (evt.type in evtMap)
                    $sp.addClass(evtMap[evt.type]);
                else if(this[hidden]) {
                    $sp.addClass(h);
                }

                if(!$sp.hasClass(h)) {
                    var arrayLength = notifications.length;
                    for (var i = 0; i < arrayLength; i++) {
                        notifications[i].close();
                        //Do something
                    }
                }
            }

            // set the initial state (but only if browser supports the Page Visibility API)
            if( document[hidden] !== undefined )
                onchange({type: document[hidden] ? "blur" : "focus"});
        })();

        $(window).on("message", function(event) {
            var data = event.originalEvent.data;
            if(data == 'sp-session-end') {
                if(!init) {
                    window.setTimeout(function () {
                        openChat(false, true);
                    }, 500);
                } else {
                    openChat(false, true);
                }
            } else if(data == 'sp-chat-init') {
                //$("#sp-drag-handle").height("0px");
                //$("#sp-chat-frame").height("420px");
                //$("#sp-chat-frame").css("top","");
            } else if(data == 'sp-chat-drag') {
                //$("#sp-drag-handle").css("height", "");
                //$("#sp-chat-frame").css("height", "");
                //$("#sp-chat-frame").css("top", Math.max(0,$(window).height() - 420) + "px");
            } else if(data == 'sp-start-screen-sharing') {
//            streamScreen();
//            streamTimer = setInterval(streamScreen, 1000);
            } else if(data == 'sp-stop-screen-sharing') {
//            clearInterval(streamTimer);
            } else if(data == 'sp-session-start') {
                if(window.Notification && window.Notification.permission !== 'denied') {
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-req-notification", "*");
                    window.Notification.requestPermission(function (permission) {
                        document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-req-notification-end", "*");
                    });
                }
            } else if(data.indexOf('sp-notification') > 0) {
                var parse = JSON.parse(data);
                showNotification(parse.name, parse.msg, parse.photo);
            } else if(data.indexOf('sp-storage') > 0) {
                var store = JSON.parse(data);
                window.localStorage.setItem(store.key, store.value);
            }
        });

        SERVICE_PATTERN_CHAT_CONFIG.hidden = SERVICE_PATTERN_CHAT_CONFIG.hidden || window.localStorage.getItem("bp-bc") != null;

        checkAvailability();
    };

    var audioElement = document.createElement('audio');

    var showNotification = function(title, body, icon) {
        if(window.Notification
            && window.Notification.permission === 'granted'
            && $("#sp-root-container").hasClass('sp-hidden')) {
            var options = {
                body: body,
                icon: icon
            };

            var n = new window.Notification(title, options);
            notifications.push(n);

            if(SP.sound_notification) {
                audioElement.pause();
                audioElement.currentTime = 0;
                audioElement.play();
            }

            n.onclose = function() {
                var index = notifications.indexOf(n);
                if (index > -1) {
                    notifications.splice(index, 1);
                }
            };

            n.onclick = function(e) {
                window.focus();
            };
        }
    };


    var checkAvailability = function() {
        var url = SERVICE_PATTERN_CHAT_CONFIG.apiUrl + '/availability?tenantUrl=' + encodeURIComponent(SERVICE_PATTERN_CHAT_CONFIG.tenantUrl);

        var config = {
            headers: {Authorization: 'MOBILE-API-140-327-PLAIN appId="' + SERVICE_PATTERN_CHAT_CONFIG.appId + '", clientId="' + SERVICE_PATTERN_CHAT_CONFIG.clientId + '"' },
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            type: 'GET',
            url: url,
            crossDomain: true,
            withCredentials: true
        };

        $.ajax(config).done(function(e) {
            handleAvailability(e);
        });
    };

    var handleAvailability = function (r) {

        var a = r.chat == 'available';

        if(SERVICE_PATTERN_CHAT_CONFIG.hidden && !window.sessionStorage.getItem("sp-chat-snippet")) {
            return;
        }

        var cw = $('#sp-chat-widget');
        cw.css("display", "block");
        $('#sp-chat-label-text').text(a ? "Contact Us" : "Contact Us");
        $('#sp-offline-label').css("display", a ? "none" : "block");
        $('#sp-online-label').css("display", a ? "block" : "none");

        if(a) {
            cw.css("cursor", "pointer");
            cw.bind('click', function() {
                openChat(true);
            });
            if(window.sessionStorage.getItem("sp-chat-snippet")) {
                openChat(true);
            }
        } else {
            cw.css("cursor", "default");
            cw.unbind('click');
            window.sessionStorage.removeItem("sp-chat-snippet");
            setTimeout(checkAvailability, 5000);
        }
    };

//    var streamScreen = function() {
//        console.log("make screen");
//        html2canvas(document.body, {
//            background : '#ffffff',
//            onrendered: function(canvas) {
//                console.log("send canvas");
//                if($('#sp-chat-iframe').length > 0) {
//                    document.getElementById('sp-chat-iframe').contentWindow.postMessage({action: 'share-screen', data: canvas.toDataURL()}, "*");
//                }
//            }
//        });
//    };
//
//    var streamTimer;

    var loadScripts = function(scripts, onSuccess) {
        var loaded = false;
        var count = scripts.length;
        var loadedCount = 0;
        var firstScript = document.getElementsByTagName('script')[0];

        var addElement = function(e) {
            e.onload = e.onreadystatechange = function () {
                if (e.readyState && e.readyState !== 'complete' && e.readyState !== 'loaded') {
                    return false;
                }
                e.onload = e.onreadystatechange = null;
                ++loadedCount;
                if (count === loadedCount) {
                    onSuccess();
                }
            };
            firstScript.parentNode.insertBefore(e, firstScript);
        };

        var makeScript = function(url) {
            var s = document.createElement('script');
            s.async = true;
            s.src = SP.chatPath + url;
            addElement(s);
        };

        var i, n;
        for (i = 0, n = scripts.length; i < n; ++i) makeScript(scripts[i]);
    };

    if (SP.tenantUrl && SP.appId) {
        loadScripts(['js/json2.min.js', 'js/jquery-1.11.0.min.js'], function() {

            loadScripts(['js/jQuery.XDomainRequest.min.js', 'js/jquery-ui-1.11.1.min.js'], function() {

                $ = jQuery.noConflict(true);
                SP.$ = $;
                $.support.cors = true;

                loadScripts(['js/chat-api-session.js'], function() {
                    SP.cp = {
                        url: SP.apiUrl,
                        crossDomain: true,
                        tenantUrl: SP.tenantUrl,
                        appId: SP.appId,
                        clientId: 'WebChat',
                        phoneNumber: SP.phoneNumber,
                        parameters: SP.parameters,
                        onFormShow: SP.onFormShow,
                        onAddStream: SP.onAddStream,
                        onAddLocalStream: SP.onAddLocalStream
                    };

                    onInitialize();
                });
            });
        });
    }
})();

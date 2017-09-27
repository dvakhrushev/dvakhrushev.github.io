define(function (require, exports, module) {
    var getConnectRequestData = require('client-chat-page/getConnectRequestData');
    var showForm = require('client-chat-page/showForm');
    var initDragAndDrop = require('client-chat-page/initDragAndDrop');
    var updateScrollbar = require('client-chat-page/updateScrollbar');
    var getUrlVars = require('client-chat-page/getUrlVars');
    var mobileCheck = require('snippet/mobileCheck');
    var getConfObject = require('snippet/getConfObject');
    var createSession = require('chat-api-session/createSession');

    var connect = function () {
        createSession(getConnectRequestData())
            .fail(function (e) {
                $('#error').text(e.text + ". Retrying...");
                window.setTimeout(connect, 4000);
            })

            .done(function (session) {
                onConnected(session);
            });
    };

    var onConnected = function (o) {
        $('#error').css('display', 'none');
        window.sessionStorage.setItem("sp-chat-session", o.session.sessionId);
        showForm('start_form', '');
        initDragAndDrop();

        o.session.assignUICallbacks({

            onFormShow: function (f) {
                showForm(f.form_name, f.form_request_id);
            },
            onChatConnected: function () {
                showForm('connect_chat_form', '');
            },
            onChatQueued: function () {
                showForm('find_agent_form', '');
            },
            onFormSent: function () {
                if (o.session.sessionStatus) {
                    switch (o.session.sessionStatus) {
                        case 'queued':
                            showForm('find_agent_form', '');
                            break;
                        case 'connected':
                            showForm('connect_chat_form', '');
                            break;
                    }
                } else {
                    showForm('start_form', '');
                }
            },
            onLogEvent: function (event) {
                $.chatUI.appendLog(event);
                updateScrollbar();
            },
            onSessionEnded: function () {
                if (!o.is_new_chat && !o.session.historyReceived) {
                    /*history has not been received, we should connect again*/
                    connect();
                } else {
                    if (o.session.sessionStatus) {
                        o.session.sessionStatus = undefined;
                        //the session is ended, but there is no party
                        //it occurs when no agent available, no need to close chat
                        //there is some messages, chat closed bu customer
                        $('#callme').css("display", "none");
                        $('#chat-body').addClass("sp-readonly");
                        $('#agent-name').text("Session completed");

                        var chatWidgetConfig = getConfObject().definition.chatWidgetStyling;
                        var src = chatWidgetConfig.logoUrl ? chatWidgetConfig.logoUrl : 'images/logo-big.png';

                        $('.avatar-image').attr("src", src);
                        $('#agent-title').text("");
                        updateScrollbar();
                        return;
                    }
                    // if (mobileCheck()) {
                    //     window.location.replace(getUrlVars(window.location.href)['referrer']);
                    // } else { 
                        window.setTimeout(function () {
                            window.parent.postMessage("sp-session-end", "*");
                        }, 50);
                    //}
                }
            }
        });

        if (!o.is_new_chat) {
            o.session.getHistory();
        }

        window.chatSession = o.session;
        var urlVars = getUrlVars(window.location.href);
        $.chatUI.sendNavigation(o.session, urlVars['referrer'], urlVars['referrerTitle']);
    };

    // two exports because connect need onConnected and back
    exports.connect = connect;
    exports.onConnected = onConnected;
});

(function($) {

var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;'
};

var escapeHtml = function(string) {
    var escaped =  String(string).replace(/[&<>"']/g, function (s) {
        return entityMap[s];
    });

    var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    escaped = escaped.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with www. (without // before it, or it'd re-link the ones done above)
    var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    escaped = escaped.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    var replacePattern3 = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;
    escaped = escaped.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return escaped
};

    var prepareEvent = function(event) {
        switch(event.event) {
            case 'chat_session_party_joined':
                event.msg = event.fromName + ' has joined the chat';
                event.originalMsg = event.msg;
                break;
            case 'chat_session_party_left':
                event.msg = event.fromName + ' has left the chat';
                event.originalMsg = event.msg;
                break;
            case 'chat_session_ended':
                event.msg = 'Chat session has ended';
                event.originalMsg = event.msg;
                break;

            case 'chat_session_timeout_warning':
                event.fromClass = 'agent';
                event.msg = event.msg ? escapeHtml(event.msg) : 'We have not heard from you for some time. Please respond within the next few minutes to prevent your chat session from being expired.';
                event.originalMsg = event.msg;
                break;

            case 'chat_session_inactivity_timeout':
                event.fromClass = 'agent';
                event.msg = event.msg ? escapeHtml(event.msg) : 'Your session has expired due to inactivity.';
                event.originalMsg = event.msg;
                break;

            case 'chat_session_file':
                var link = '<a target="_blank" href="__href__">__text__</a>';
                var text = '';
                if (event.file_type == 'image') {
                    event.originalMsg = event.fromName + ' has sent you an image.';
                    text = '<img class="thumb" style="vertical-align: top;" src="' + event.fileUrl + '" />';
                } else {
                    event.originalMsg = event.fromName + ' has sent you an attachment "' + event.file_name +'"';
                    text = "Download \"" + event.file_name + "\"";
                }
                event.msg = link.replace("__href__", event.fileUrl).replace("__text__", text);

                break;
            default :
                event.originalMsg = event.msg;
                event.msg = event.msg ? escapeHtml(event.msg) : undefined;
        }
        return event;
    };
    
var appendLog = function(event) {

    var e = prepareEvent(event);

    var time = e.timestamp ? new Date(parseInt(e.timestamp) * 1000).format("HH:MM") : new Date().format("HH:MM");
    //alert(event);
    agent='';
    if(event.event=="chat_session_party_joined"){
        agent='<div class="agent_joined_msg"><div class="avatar-image" id="manager-pic"></div><div class=agent-name-prefix></div><strong class=agent-name></strong></div>'
    };
    if (e.msg) {
        var fromClass = e.fromClass;
        var dir = fromClass == 'me' ? 'clientMessage' : fromClass == 'sys' ? 'systemMessage' : 'blue agentMessage';

        var tmpl = '<div id="' + (event.msgId ? event.msgId : '') + '" class="new-msg-container ' + dir  +  ' new-msg-animate">'+agent+'<div class=bubble><div class="pip"></div><div class="new-msg-body ' + dir +'">' +
            '<div class="new-msg-body-inner"><div class="new-msg-text " style="height: auto;"><div class="new-msg-text-inner">' + e. msg + '</div>' +
            '</div></div></div><div class="new-time">' + (fromClass !== 'sys' ? time : '') + '</div></div></div>';

        $(tmpl).insertBefore($('#messages-div-inner-clear'));
    }

    return e;
};

var typingTimer;
var notTypingTimeout = 30;
    
var sendMessage = function(session) {    
    if ($('#input-field').val()) {
        session.send($('#input-field').val());
        $('#input-field').val('');
        autosize.update($('#input-field'));

        if (typingTimer) {
            window.clearTimeout(typingTimer);
            session.sendNotTyping();
            typingTimer = null;
        }
    }
};

var sendLocation = function(session) {  
    navigator.geolocation.getCurrentPosition(function(position) {
        session.sendLocation(position.coords.latitude, position.coords.longitude);
    },
    function(failure) {
        alert(failure.message);
    });    
};

var sendNavigation = function(session, href, title) {  
    session.sendNavigation(href, title);    
};


    var notTyping = function(session) {
        session.sendNotTyping();
        typingTimer = null;
    };
    
var chatMessageTyping = function(session) {
    if (typingTimer) {
        window.clearTimeout(typingTimer);
    } else {
        session.sendTyping();
    }
    typingTimer = window.setTimeout(function() {
        session.sendNotTyping();
        typingTimer = null;
    }, notTypingTimeout * 1000000);
};


var msgKeyPress = function(event, session) {

    if (event.which == 13) {
        if (!event.shiftKey) {
            event.preventDefault();
            event.stopImmediatePropagation();
            sendMessage(session);
        } else {
            var chatLog = $('#chatLog'); 
            var msg = $('#input-field');
            var scroll1 = msg.scrollTop();
            setTimeout(function() {
                var scroll2 = msg.scrollTop();
                if (scroll2 > scroll1) {
                    var logHeight = chatLog.height();
                    var minHeight = 64;
                    var heightIncrement = 16;
                    if (logHeight > minHeight) {
                        var h = msg.height();
                        msg.height(h + heightIncrement);
                        if (scroll1 == 0) {
                            msg.scrollTop(0);
                        }
                    }
                }
            }, 10);
            chatMessageTyping(session);
        }
    } else {
        chatMessageTyping(session);
    }
};

$.chatUI = {
    appendLog: appendLog,
    sendMessage: sendMessage,
    sendLocation: sendLocation,
    sendNavigation: sendNavigation,
    msgKeyPress: msgKeyPress,
    notTyping: notTyping
}

})(jQuery);

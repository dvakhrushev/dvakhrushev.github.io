define(function (require, exports, module) {

    var escapeHtml = require('client-chat-ui/escapeHtml');
    var i18n = require('client-chat-ui/i18n');

    return function (event) {

        switch (event.event) {
            case 'chat_session_party_joined':
                event.msg = i18n.joinedTheChat;
                event.originalMsg = event.msg;
                break;
            case 'chat_session_party_left':
                event.msg = i18n.leftTheChat;
                event.originalMsg = event.msg;
                break;
            case 'chat_session_ended':
                event.msg = i18n.sessionEndedMessage;
                event.originalMsg = event.msg;
                break;
            case 'chat_session_timeout_warning':
                event.fromClass = 'agent';
                event.msg = event.msg ? escapeHtml(event.msg) : i18n.inactivityWarningMessage;
                event.originalMsg = event.msg;
                break;

            case 'chat_session_inactivity_timeout':
                event.fromClass = 'agent';
                event.msg = event.msg ? escapeHtml(event.msg) : i18n.inactivityTimeoutMessage;
                event.originalMsg = event.msg;
                break;

            case 'chat_session_file':
                var link = '<a target="_blank" href="__href__">__text__</a>';
                var text = '';
                if (event.file_type == 'image') {
                    event.originalMsg = event.fromName + ' ' + i18n.imageWasSent;
                    text = '<img class="thumb" style="vertical-align: top;" src="' + event.fileUrl + '" />';
                } else {
                    event.originalMsg = event.fromName + ' ' + i18n.fileWasSent + ' "' + event.file_name + '"';
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
});

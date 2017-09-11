define(function (require, exports, module) {
    var prepareEvent = require('client-chat-ui/prepareEvent');

    return function (event) {
        var e = prepareEvent(event);
        var time = e.timestamp ? new Date(parseInt(e.timestamp) * 1000).format("HH:MM") : new Date().format("HH:MM");

        if (e.msg) {
            var fromClass = e.fromClass;
            var messageType;
            var messagePipClass;
            var textColor;
            var backgroundColor;

            if (fromClass === 'me') {
                messageType = 'clientMessage';
                backgroundColor = 'main-background-color';
                textColor = 'second-color';
                messagePipClass = 'main-fill-color';
            } else if (fromClass === 'sys') {
                messageType = 'systemMessage';
                backgroundColor = 'system-message';
                textColor = 'base-font main-color';
                messagePipClass = 'system-message';
            } else {
                messageType = 'agentMessage';
                backgroundColor = 'agent-message';
                textColor = 'base-font';
                messagePipClass = 'agent-message';
            }

            var tmpl = '' +
                '<div id="' + (event.msgId ? event.msgId : '') +
                '" class="new-msg-container new-msg-animate ' +
                messageType + ' ' + backgroundColor + '">' +
                // '<div class="pip ' + messageBodyClass + '"></div>' +
                '<div class="new-msg-body ' + messageType + '">' +
                '<div class="new-msg-body-inner">' +
                '<div class="new-msg-text " style="height: auto;">' +
                '<div class="new-msg-text-inner ' +
                textColor + '">' + e.msg + '</div>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="new-time">' + (fromClass !== 'sys' ? time : '') + '</div>' +
                '</div>';

            var $tmpl = $(tmpl);

            $tmpl.insertBefore($('#messages-div-inner-clear'));
        }

        return e;
    };
});

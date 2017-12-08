define(function (require, exports, module) {
    var prepareEvent = require('client-chat-ui/prepareEvent');


    return function (event) {
        var e = prepareEvent(event);
        var time = e.timestamp ? new Date(parseInt(e.timestamp) * 1000).format("HH:MM") : new Date().format("HH:MM");

        if (e.msg) {
            var fromClass = e.fromClass;
            var messageType;
            var textColor;
            var backgroundColor;
            var icon = '';
            var collapsedIconClass = '';
            var msg = e.msg;
            logoUrl = window.sessionStorage.getItem('logoUrl') == 'none' ? '' : window.sessionStorage.getItem('logoUrl');

            var logo = (logoUrl && logoUrl!='none' && (fromClass == 'agent' || fromClass == 'sys')) ? logoUrl : e.profilePhotoUrl;
            if (logoUrl =='none'){
                $('#messages-div').addClass('noAgentImage');
            }

            if (e.profilePhotoUrl =='none'){
                collapsedIconClass = ' collapsed';
            }
 
            if (fromClass === 'me') {
                messageType = 'clientMessage';
                backgroundColor = 'main-background-color';
                textColor = 'second-color';
            } else if (fromClass === 'sys') {
                messageType = 'systemMessage';
                backgroundColor = 'system-message';
                textColor = 'main-color';
                icon = '<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path d="M9.811 2.327l-4.023 4.056-.045.069c-.073.074-.159.126-.249.16l-.03.008-.159.031-.121-.002-.123-.024-.063-.02c-.085-.032-.165-.083-.233-.153l-1.265-1.273c-.27-.272-.27-.713 0-.985.271-.272.708-.272.978 0l.848.854 3.59-3.621c.247-.249.646-.249.895 0 .246.248.246.651 0 .9zm-4.848-.994c-2.01 0-3.64 1.642-3.64 3.667 0 2.026 1.63 3.667 3.64 3.667 1.828 0 3.337-1.358 3.596-3.127l1.303-1.312c.038.252.064.509.064.772 0 2.762-2.222 5-4.963 5s-4.963-2.238-4.963-5c0-2.761 2.222-5 4.963-5 .991 0 1.911.296 2.686.799l-.963.971c-.513-.278-1.1-.437-1.723-.437z"/></svg>';
                if(e.msg.indexOf('$(name)')!=-1){
                    var msg = e.msg.replace('$(name)', e.fromName);
                }

            } 
            else {
                messageType = 'agentMessage';
                backgroundColor = 'agent-message';
                textColor = 'base-font';
            }

            var background = (logo == 'none' || typeof logo === 'undefined') ? '' : ' style="background:url(' + logo + ') center center no-repeat;background-size:cover!important"';

            var tmpl = '' +
                '<div id="' + (event.msgId ? event.msgId : '') +
                '" class="new-msg-container new-msg-animate ' +
                messageType + collapsedIconClass + '">' +
                '<div class="pip ' + backgroundColor + '"></div>' +
                '<div class="new-msg-body ' + messageType + ' ' + backgroundColor + '">' +
                '<div class="new-msg-body-inner">' +
                '<div class="new-msg-text " style="height: auto;">' +
                '<div class="agentImage"' + background + '></div>' +
                '<div class="new-msg-text-inner ' +
                textColor + '">' + icon + '<span>' + msg + '</span></div>' +
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

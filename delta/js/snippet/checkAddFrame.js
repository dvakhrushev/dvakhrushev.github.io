define(function (require, exports, module) {
    var getConfObject = require('snippet/getConfObject');
    var isChatRendered = require('snippet/isChatRendered');
    var config = require('snippet/variables');
    var chatUrl = require('snippet/chatUrl');
    var mobileCheck = require('snippet/mobileCheck');

    return function (startSession) {

        if (!isChatRendered()) {
            if (config.SP.sound_notification) {
                config.audioElement.setAttribute('src', config.SP.sound_notification_file);
                config.audioElement.load();
            }

            var chatWidgetConfig = getConfObject().definition.chatWidgetStyling;
            
            if(!mobileCheck()){
                var frameHeight = Math.min.apply(Math,[chatWidgetConfig.height, window.innerHeight - 20]);
                $('#sp-chat-frame').css('height', frameHeight);
                $('#sp-chat-frame').css('width', chatWidgetConfig.width);

                $( window.parent ).resize(function() {
                    var frameHeight = Math.min.apply(Math,[chatWidgetConfig.height, window.innerHeight - 20]);
                    $('#sp-chat-frame').css('height', frameHeight);
                })



            } else {
                $('#sp-chat-frame').css('height', '100%');
                $('#sp-chat-frame').css('width', '100%');
            }
            var url = startSession ? chatUrl(startSession.session.cp.parameters.first_name, startSession.session.cp.phone_number) : chatUrl();
            
            var start = startSession ? '&start='+startSession.session.sessionId : '';
            var html = "<iframe id='sp-chat-iframe' class='widget-border-radius dialog-shadow' frameborder='0' scrolling='no' src=" + url + start + "></iframe>";
            $('#sp-iframe-container').append(html);
        }
    };
});

define(function (require, exports, module) {
    var getConfObject = require('snippet/getConfObject');
    var isChatRendered = require('snippet/isChatRendered');
    var config = require('snippet/variables');
    var chatUrl = require('snippet/chatUrl');

    return function () {

        if (!isChatRendered()) {
            if (config.SP.sound_notification) {
                config.audioElement.setAttribute('src', config.SP.sound_notification_file);
                config.audioElement.load();
            }

            var chatWidgetConfig = getConfObject().definition.chatWidgetStyling;

            $('#sp-chat-frame').css('height', chatWidgetConfig.height);
            $('#sp-chat-frame').css('width', chatWidgetConfig.width);

            var html = "<iframe id='sp-chat-iframe' class='widget-border widget-border-radius dialog-shadow' frameborder='0' scrolling='no' src=" + chatUrl() + "></iframe>";
            $('#sp-iframe-container').append(html);
        }
    };
});

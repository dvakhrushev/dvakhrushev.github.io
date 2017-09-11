define(function (require, exports, module) {
    var updateStyles = require('updateStyles');
    var getConfObject = require('snippet/getConfObject');

    return function () {

        var config = getConfObject();

        updateStyles(config, config.styles, config.definition.highlights);
        $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').removeAttr('class');
        $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass('position_' + config.definition.contactTab.location);
        if (config.definition.contactTab.location.indexOf('right_') !== -1 || config.definition.contactTab.location.indexOf('left_') !== -1) {
            $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass('vertical');
        } else {
            $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass('horizontal');
        }
        config.definition.contactTab.location.split('_').forEach(function (item, i) {
            $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass(item + "_" + i);
        });
        // $('#sp-chat-fake').css(contactTabStyle.background);

        // $('#chat-body').css(chatWidgetStyle.background);

        // $('#sp-chat-widget').css(contactTabStyle.textColor);
        // $('#tab_icon path').css(contactTabStyle.iconColor);

        // $('#sp-chat-label-text').css(contactTabStyle.labelText);

        // $('#sp-chat-frame').css(contactTabStyle.frameBorder);

        // $('.agentMessage').css(chatWidgetStyle.agentMessage);
        // $('.clientMessage').css(chatWidgetStyle.clientMessage);
        // $('.systemMessage').css(chatWidgetStyle.systemMessage);

        //$('.systemMessage .new-msg-text-inner').html(config.definition.chatWidgetStyling.agentJoinedMessage || '&nbsp;');

        // $('.new-msg-container').css(chatWidgetStyle.messageFont);
    };
});

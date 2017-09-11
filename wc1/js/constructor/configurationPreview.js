define(function (require, exports, module) {

    var getConfObject = require('snippet/getConfObject');

    return function () {

        var def = getConfObject().definition;

        var icon = def.contactTab.iconUrl || '';

        $('#sp-chat-label-icon').attr('style', 'background:url("'+icon+'") center center no-repeat/contain');
        $('#sp-chat-label-text').text(def.contactTab.agentsAvailableMsg || '');

        if (def.chatWidgetStyling.fileUploadEnabled === false) {
            $('#attachFile').hide();
            $('#input-div').addClass('without_file');
        } else {
            $('#attachFile').show();
            $('#input-div').removeClass('without_file');
        }

        if (def.chatWidgetStyling.logoUrl) {
            $('.avatar-image').attr('src', def.chatWidgetStyling.logoUrl);
        }

        if (def.chatWidgetStyling.agentJoinedMessage) {
            $('.agentJoinedMessage').text(def.chatWidgetStyling.agentJoinedMessage);
        }

        if (def.chatWidgetStyling.inactivityWarningMessage) {
            $('.inactivityWarningText').text(def.chatWidgetStyling.inactivityWarningMessage);
        }

        if (def.chatWidgetStyling.inactivityTimeoutMessage) {
            $('.inactivityTimeoutText').text(def.chatWidgetStyling.inactivityTimeoutMessage);
        }

        if (def.chatWidgetStyling.sessionEndedMessage) {
            $('.sessionEndedText').text(def.chatWidgetStyling.sessionEndedMessage);
        }

        if (def.chatWidgetStyling.agentLeftMessage) {
            $('.agentLeftText').text(def.chatWidgetStyling.agentLeftMessage);
        }

        console.log(def.chatWidgetStyling);

        $('.pre_chat_form #agent-name').text(def.preChat.title);
        $('.chat_widget #agent-name').text(def.chatWidgetStyling.title);

        $('.questionFormInner').perfectScrollbar({useBothWheelAxes: false});
        $('#offline-form-fields').perfectScrollbar({useBothWheelAxes: false});
    };
});

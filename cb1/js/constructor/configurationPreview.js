define(function (require, exports, module) {

    var getConfObject = require('snippet/getConfObject');
    // var perfectScrollbar = require('libraries/perfect-scrollbar/perfect-scrollbar.min.js');

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

        if (def.contactTab.enabled == false){
            $('#sp-chat-widget').hide();
        } else{
            $('#sp-chat-widget').show();
        }

        if (def.preChat.enabled == false){
            $('.pre_chat_form #preChatForm').hide();
            $('#sp-chat-frame').css("display","");
            $('.pre_chat_form #sp-chat-frame').hide();
        } else{
            $('.pre_chat_form #preChatForm').css("display","");
            $('.pre_chat_form #sp-chat-frame').css("display","");
        }
        

        if (def.chatWidgetStyling.logoUrl) {
            $('.avatar-image').attr('src', def.chatWidgetStyling.logoUrl);
        }

        if (def.leaveMessage.title) {
            $('#screen-title').text(def.leaveMessage.title);
        }

        if (def.chatWidgetStyling.agentJoinedMessage) {
            $('.agentJoinedMessage span').text(def.chatWidgetStyling.agentJoinedMessage);
        }

        if (def.chatWidgetStyling.inactivityWarningMessage) {
            $('.inactivityWarningText span').text(def.chatWidgetStyling.inactivityWarningMessage);
        }

        if (def.chatWidgetStyling.inactivityTimeoutMessage) {
            $('.inactivityTimeoutText span').text(def.chatWidgetStyling.inactivityTimeoutMessage);
        }

        if (def.chatWidgetStyling.sessionEndedMessage) {
            $('.sessionEndedText span').text(def.chatWidgetStyling.sessionEndedMessage);
        }

        if (def.chatWidgetStyling.agentLeftMessage) {
            $('.agentLeftText span').text(def.chatWidgetStyling.agentLeftMessage);
        }

        $('.pre_chat_form #agent-name').text(def.preChat.title);
        $('.chat_widget #agent-name').text(def.chatWidgetStyling.title);


        if ($.fn.perfectScrollbar) {
            $('.questionFormInner').perfectScrollbar({useBothWheelAxes: false});
            $('#offline-form-fields').perfectScrollbar({useBothWheelAxes: false});
            $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});
        }
    };
});

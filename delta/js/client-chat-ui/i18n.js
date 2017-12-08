define(function (require, exports, module) {
    
    return function(){

        var conf = sessionStorage.getItem("confParams");
        if(conf){
            var confObj = JSON.parse(conf)
            if (confObj && confObj.definition){
                chatWidgetStyling = confObj.definition.chatWidgetStyling;
            }
        }

        var inactivityTimeout = "Your session has expired due to inactivity.";
        var inactivityWarning = "We have not heard from you for some time. Please respond within the next few minutes to prevent your chat session from being expired.";
        var sessionEnded = "Chat session has ended";
        var agentJoined = "has joined the chat";
        var agentLeft = "has left the chat"; 
        var imageWasSent = "has sent you an image";
        var fileWasSent = "has sent you an attachment";

        return {
            inactivityTimeoutMessage: (typeof chatWidgetStyling !== 'undefined') ? chatWidgetStyling.inactivityTimeoutMessage : inactivityTimeout,
            inactivityWarningMessage: (typeof chatWidgetStyling !== 'undefined') ? chatWidgetStyling.inactivityWarningMessage : inactivityWarning,
            sessionEndedMessage: (typeof chatWidgetStyling !== 'undefined') ? chatWidgetStyling.sessionEndedMessage : sessionEnded,
            joinedTheChat: (typeof chatWidgetStyling !== 'undefined') ? chatWidgetStyling.agentJoinedMessage : agentJoined,
            leftTheChat: (typeof chatWidgetStyling !== 'undefined') ? chatWidgetStyling.agentLeftMessage : agentLeft,
            imageWasSent: imageWasSent,
            fileWasSent: fileWasSent
        }

    }

});
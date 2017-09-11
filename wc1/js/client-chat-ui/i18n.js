define(function (require, exports, module) {

    var getConfObject = require('snippet/getConfObject');

    var conf = getConfObject().definition.chatWidgetStyling;

    var inactivityTimeout = "Your session has expired due to inactivity.";
    var inactivityWarning = "We have not heard from you for some time. Please respond within the next few minutes to prevent your chat session from being expired.";
    var sessionEnded = "Chat session has ended";
    var agentJoined = "has joined the chat";
    var agentLeft = "has left the chat";
    var imageWasSent = "has sent you an image";
    var fileWasSent = "has sent you an attachment";

    return {
        inactivityTimeoutMessage: conf.inactivityTimeoutMessage ? conf.inactivityTimeoutMessage : inactivityTimeout,
        inactivityWarningMessage: conf.inactivityWarningMessage ? conf.inactivityWarningMessage : inactivityWarning,
        sessionEndedMessage: conf.sessionEndedMessage ? conf.sessionEndedMessage : sessionEnded,
        joinedTheChat: conf.agentJoinedMessage ? conf.agentJoinedMessage : agentJoined,
        leftTheChat: conf.agentLeftMessage ? conf.agentLeftMessage : agentLeft,
        imageWasSent: imageWasSent,
        fileWasSent: fileWasSent
    }
});
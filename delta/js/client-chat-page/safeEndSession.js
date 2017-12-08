define(function (require, exports, module) {
    return function () {
        if(window.chatSession) {
            if (window.chatSession.sessionStatus === 'connected') {
                //session queued or connected, need disconnect
                var confirm = window.confirm("Do you want to end the chat session?");
                if (confirm) {
                    window.chatSession.sessionStatus = undefined;
                    window.chatSession.disconnectSession();
                }
            } else if (!window.chatSession.sessionEnded) {
                window.chatSession.endSession();
            } else {
                window.chatSession.uiCallbacks.onSessionEnded();
            }
        } else {
            window.setTimeout(function () {
                window.parent.postMessage("sp-session-end", "*");
            }, 50);
        }
    };
});

define(function (require, exports, module) {
    var updateScrollbar = require('client-chat-page/updateScrollbar');
    var safeEndSession = require('client-chat-page/safeEndSession');

    return function (e) {
        var data = '' + e.originalEvent.data;

        if (data.indexOf("sp-") === 0) {

            if (data === 'sp-dragged') {
                updateScrollbar();
            } else if (data === 'sp-disconnect') {
                safeEndSession();
            } else if (data === 'sp-req-notification') {
                $('#notification-prompt').css("display", "block");
            } else if (data === 'sp-req-notification-end') {
                $('#notification-prompt').css("display", "none");
            } else if (data.indexOf("sp-together-url") === 0) {
                window.chatSession.send("Click to start co-browsing session:" + data.replace("sp-together-url", ""));
            } else if (data === "sp-started-together") {
                $('#shareScreen').addClass('stop-sharing');
            } else if (data === "sp-stopped-together") {
                $('#shareScreen').removeClass('stop-sharing');
            }
        }
    };
});

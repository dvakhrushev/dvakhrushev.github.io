define(function (require, exports, module) {
    var sendXhr = require('chat-api-session/sendXhr');
    var handleEvents = require('chat-api-session/handleEvents');

    return function (cp, session) {

        var lastPollRequest = null;

        poll();

        function poll() {
            var timeout = window.setTimeout(function () {
                if (lastPollRequest && !session.sessionEnded) {
                    lastPollRequest.abort();
                    lastPollRequest = null;
                }

                timeout = null;
                poll();
            }, 13000);

            var endpoint = 'chats/' + session.sessionId + '/events?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

            lastPollRequest = sendXhr(cp, endpoint, 'GET');

            return lastPollRequest.done(function (r) {

                handleEvents(r, session);

                if (timeout) {

                    window.clearTimeout(timeout);
                    if (!session.sessionEnded) {
                        poll();
                    }

                }

            });
        }
    };
});

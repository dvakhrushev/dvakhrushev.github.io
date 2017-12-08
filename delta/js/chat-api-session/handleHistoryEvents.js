define(function (require, exports, module) {
    return function (r, session) {
        var offerRtc = null;

        session.historyReceived = true;

        if (r.events) {
            for (var i = 0, n = r.events.length; i < n; ++i) {
                var event = r.events[i];
                if (event.event === 'chat_session_signaling') {
                    var type = event.data.type;
                    if (type === 'OFFER_CALL') {
                        offerRtc = event;
                    } else if (type === 'END_CALL') {
                        offerRtc = null;
                    }
                } else {
                    session.handleEvent(event);
                }
            }
        }

        session.historyRendered = true;

        return offerRtc;

    };
});

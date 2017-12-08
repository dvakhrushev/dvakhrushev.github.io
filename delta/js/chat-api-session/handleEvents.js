define(function (require, exports, module) {
    return function (r, session) {
        if (r.events) {
            for (var i = 0, n = r.events.length; i < n; ++i) {
                session.handleEvent(r.events[i]);
            }
        }
    };
});

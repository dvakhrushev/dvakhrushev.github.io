define(function (require, exports, module) {
    var createSessionHandler = require('chat-api-session/createSessionHandler');

    return function (cp, id, state) {
        var r = {
            chat_id: id,
            state: state
        };

        r.session = createSessionHandler(cp, r);
        return r;
    };
});

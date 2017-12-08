define(function (require, exports, module) {
    var variables = require('chat-api-session/variables');

    return function (a, b) {
        if (variables.logging) {
            if (typeof console !== 'undefined') {
                if (b !== 'undefined') {
                    console.log(a + " %o", b);
                } else {
                    console.log(a);
                }
            }
        }

    };
});

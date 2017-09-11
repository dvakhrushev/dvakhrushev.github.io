define(function (require, exports, module) {
    var variables = require('client-chat-page/variables');

    return function (e) {
        e.preventDefault();

        if (variables.currentForm && typeof variables.currentForm.onSubmit === 'function') {
            variables.currentForm.onSubmit();
        }
    };
});

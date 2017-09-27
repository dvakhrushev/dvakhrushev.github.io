define(function (require, exports, module) {
    var uploadFile = require('client-chat-page/uploadFile');

    return function (files) {
        for (var i = 0, item; item = files[i]; i++) {
            uploadFile(item);
        }
    };
});

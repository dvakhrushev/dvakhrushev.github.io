define(function (require, exports, module) {
    var helpers = require('constructor/helpers');
    var checkAvailability = require('snippet/checkAvailability');

    if (window.addEventListener) {
        window.addEventListener("message", helpers.listener);
    } else {
        window.attachEvent("onmessage", helpers.listener);
    }
/*
    $(function() {
        checkAvailability().then(function () {
            helpers.showChat();
            helpers.applyConfiguration();
            if (typeof EmojiPicker === 'function'){
                window.emojiPicker = new EmojiPicker({
                    emojiable_selector: '[data-emojiable=true]',
                    assetsPath: '../js/libraries/emoji/img',
                    popupButtonClasses: 'fa fa-smile-o'
                });
                window.emojiPicker.discover();
            }
        });
    });
*/
});


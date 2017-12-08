define(function (require, exports, module) {
    $ = jQuery;
    if (typeof SERVICE_PATTERN_CHAT_CONFIG !== 'undefined')  {
        if (typeof SERVICE_PATTERN_CHAT_CONFIG.$ !== 'undefined') {
            $ = SERVICE_PATTERN_CHAT_CONFIG.$;
        }
    }

    return {
        logging: false,
        textFormId: undefined
    };
});


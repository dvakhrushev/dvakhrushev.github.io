define(function (require, exports, module) {
    return {
        SP: SERVICE_PATTERN_CHAT_CONFIG || {},
        init: false,
        notifications: [],
        TogetherJSUrlWasSent: false,
        audioElement: document.createElement('audio')
    };
});

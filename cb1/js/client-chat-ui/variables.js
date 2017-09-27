define(function (require, exports, module) {
    return {
        typingTimer: null,
        msgTypingInterval: null,
        notTypingTimeout: 30,
        msgTypingTimeout: 3,
        entityMap: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }
    };
});

define(function (require, exports, module) {
    return function (opened) {
        if (opened) {
            window.sessionStorage.setItem("sp-chat-snippet", "true");
        } else {
            window.sessionStorage.removeItem("sp-chat-snippet");
        }
    };
});

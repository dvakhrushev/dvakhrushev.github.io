define(function (require, exports, module) {
    return function (session, href, title) {
        session.sendNavigation(href, title);
    };
});

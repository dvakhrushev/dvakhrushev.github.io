define(function (require, exports, module) {
    return function () {
        if (TogetherJS.running) {
            TogetherJS
                .require("peers")
                .getAllPeers()
                .forEach(function (p) {
                    if (!p.following) {
                        p.follow();
                    }
                });
        }
    };
});

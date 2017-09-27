define(function (require, exports, module) {
    var variables = require('snippet/variables');

    return function () {

        if (!TogetherJS.running) {

            TogetherJS();

            if (!variables.TogetherJSUrlWasSent) {
                var url = null;
                try {
                    url = TogetherJS.shareUrl();
                } catch (e) {
                }
                if (url === null) {
                    TogetherJS.on("ready", function () {
                        var url = TogetherJS.shareUrl();
                        document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-together-url" + url, "*");
                        variables.TogetherJSUrlWasSent = true;
                    });
                } else {
                    document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-together-url" + url, "*");
                    variables.TogetherJSUrlWasSent = true;
                }
            }
            document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-started-together", "*");
        }
    };
});

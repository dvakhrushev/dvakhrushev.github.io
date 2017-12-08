define(function (require, exports, module) {
    var variables = require('snippet/variables');

    return function () {
        if (TogetherJS.running) {
            TogetherJS();
            document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-stopped-together", "*");
            variables.TogetherJSUrlWasSent = false;
        }
    };
});

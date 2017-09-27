define(function (require, exports, module) {
    var config = require('snippet/variables');

    return function (scripts, onSuccess) {

        var loaded = false;
        var count = scripts.length;
        var loadedCount = 0;
        var firstScript = document.getElementsByTagName('script')[0];

        var addElement = function (e) {
            e.onload = e.onreadystatechange = function () {
                if (e.readyState && e.readyState !== 'complete' && e.readyState !== 'loaded') {
                    return false;
                }
                e.onload = e.onreadystatechange = null;
                ++loadedCount;
                if (count === loadedCount && onSuccess != undefined) {
                    onSuccess();
                }
            };
            firstScript.parentNode.insertBefore(e, firstScript);
        };

        var makeScript = function (url) {
            var s = document.createElement('script');
            s.async = true;
            s.src = config.SP.chatPath + url;
            addElement(s);
        };

        var i, n;
        for (i = 0, n = scripts.length; i < n; ++i) makeScript(scripts[i]);
    };
});

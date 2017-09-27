define(function (require, exports, module) {
    return function (url) {
        var vars = {};
        var hash;
        var hashes = url.slice(url.indexOf('?') + 1).split('&');

        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            vars[hash[0]] = decodeURIComponent(hash[1]);
        }

        return vars;
    };
});

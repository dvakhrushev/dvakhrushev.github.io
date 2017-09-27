define(function (require, exports, module) {
    var variables = require('client-chat-ui/variables');

    return function (string) {
        var escaped = String(string).replace(/[&<>"']/g, function (s) {
            return variables.entityMap[s];
        });

        var replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        escaped = escaped.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

        //URLs starting with www. (without // before it, or it'd re-link the ones done above)
        var replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
        escaped = escaped.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

        var replacePattern3 = /([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)/gim;
        escaped = escaped.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

        return escaped;
    };
});

define(function (require, exports, module) {

    var getUrlVars = require('client-chat-page/getUrlVars');

    return function () {

        //TODO sessionStorage may not accessible due to Cross Origin Policy
        var conf = JSON.parse(sessionStorage.getItem("confParams"));

        var urlVars = getUrlVars(window.location.href);

        var url = window.location.href.split('#')[0];

        if(urlVars.hasOwnProperty("referrer")) {
            url = urlVars["referrer"].split('#')[0];
        }

        var index = 0;

        conf.widgets.forEach(function (item, i) {
            item.urls.forEach(function (urlItem) {
                if (url === urlItem) {
                    index = i;
                }
            });
        });

        return conf.widgets[index];
    };
});

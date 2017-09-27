define(function (require, exports, module) {
    var helpers = require('constructor/helpers');
    var jquery = require('../js/libraries/jquery/jquery-3.2.1.min.js');
    var ps = require('../js/libraries/perfect-scrollbar/perfect-scrollbar.min.js');

    if (window.addEventListener) {
        window.addEventListener("message", helpers.listener);
    } else {
        window.attachEvent("onmessage", helpers.listener);
    }

    $(function() {

            if(!sessionStorage.getItem('confParams')){

                var confUrl = SERVICE_PATTERN_CHAT_CONFIG.apiUrl + '/configuration?tenantUrl=' + encodeURIComponent(SERVICE_PATTERN_CHAT_CONFIG.tenantUrl);

                var confParams = {
                    headers: {Authorization: 'MOBILE-API-140-327-PLAIN appId="' + SERVICE_PATTERN_CHAT_CONFIG.appId + '", clientId="' + SERVICE_PATTERN_CHAT_CONFIG.clientId + '"'},
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    type: 'GET',
                    url: confUrl,
                    crossDomain: true,
                    withCredentials: true
                };

                return $.ajax(confParams).then(function (conf) {

                    if(!conf.widgets) {
                        conf = {widgets : [{definition: conf}]};
                    }

                    sessionStorage.setItem('confParams', JSON.stringify(conf));
                    helpers.showChat();
                    helpers.applyConfiguration();

                });

            } else {

                helpers.showChat();
                helpers.applyConfiguration();

            }

    });
});


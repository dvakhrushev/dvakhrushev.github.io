define(function (require, exports, module) {
    var onInitialize = require('snippet/onInitialize');
    var previewMode = require('constructor/previewMode');

    return function () {

        if(previewMode){

            onInitialize();

        } else {

            var config = require('snippet/variables'); 
            var setFollowPeersTogetherJS = require('snippet/togetherJsSetFollowPeers');
            var loadScripts = require('snippet/loadScripts');

            if (config.SP.tenantUrl && config.SP.appId) {

                TogetherJSConfig_suppressJoinConfirmation = true;
                TogetherJSConfig_suppressInvite = true;
                TogetherJSConfig_disableWebRTC = true;
                sessionStorage.setItem('togetherjs.settings.seenIntroDialog', true);

                TogetherJSConfig_getUserName = function () {
                    return 'Viewer';
                };

                TogetherJSConfig_on_ready = function () {
                    if (TogetherJS.running && !TogetherJS.require('peers').Self.isCreator) {
                        setInterval(setFollowPeersTogetherJS, 5 * 1000);
                    }
                };

                loadScripts(['js/libraries/togetherjs/togetherjs-min.js'], function () {
                    $ = jQuery.noConflict(true);
                    config.SP.$ = $;
                    $.support.cors = true;

                    config.SP.cp = {
                        url: config.SP.apiUrl,
                        crossDomain: true,
                        tenantUrl: config.SP.tenantUrl,
                        appId: config.SP.appId,
                        clientId: 'WebChat',
                        phoneNumber: config.SP.phoneNumber,
                        parameters: config.SP.parameters,
                        onFormShow: config.SP.onFormShow,
                        onAddStream: config.SP.onAddStream,
                        onAddLocalStream: config.SP.onAddLocalStream
                    };

                    onInitialize();
                });
            } 
        }

        
    };
});

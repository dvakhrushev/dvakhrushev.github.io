define(function (require, exports, module) {
    var configurationSnippet = require('snippet/configurationSnippet');
    var configurationPreview = require('constructor/configurationPreview');
    var configurationChat = require('client-chat-page/configurationChat');
    //var configurationProactiveOffer = require('client-chat-page/configurationProactiveOffer'); 
    var getConf = require('getConf');    
    var ps = require('perfect-scrollbar');

    var helpers = {
        listener: function (event) {
//            if (~event.origin.indexOf('brightpattern.com')) {
        
                if (helpers.isJsonString(event.data)) {

                    sessionStorage.setItem('fullConf', event.data);
                    var config = JSON.parse(event.data);
                    var target = getConf(event.data);
                    
                    if (config.screen) {
                        $('#preview').attr('class', "").addClass(config.screen);
                        sessionStorage.setItem('confParams', JSON.stringify(target.data));
                        sessionStorage.setItem('styles', JSON.stringify(config.styles));
                        helpers.applyConfiguration(target.data, target.styles);
                    }
//                }
            }
        },

        isJsonString: function (str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        },

        applyConfiguration: function (data, styles) {
            configurationSnippet(data, styles);
            configurationPreview(data, styles);
            configurationChat(data, styles);
        },

        showChat: function () {
            $('.chat-preview-content').show();
        }
    };

    return helpers;
});

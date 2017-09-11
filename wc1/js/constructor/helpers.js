define(function (require, exports, module) {
    var configuration = require('snippet/configurationSnippet');
    var configurationPreview = require('constructor/configurationPreview');
    var configurationChat = require('client-chat-page/configurationChat');
    var demoConf;
    var helpers = {
        listener: function (event) {
            console.log('GET MESSAGE3', event.data);

            if (helpers.isJsonString(event.data)) {
                demoConf = JSON.parse(event.data);

                if (demoConf.screen) {
                    var conf = {
                        widgets: [{
                            definition: demoConf.widget,
                            styles: demoConf.styles
                        }],
                    };

                    $('#preview').attr('class', "").addClass(demoConf.screen);

                    helpers.applyConfiguration(conf, 0);
                }
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

        applyConfiguration: function () {
            configuration();
            configurationPreview();
            configurationChat();
        },

        showChat: function () {
            $('.chat-preview-content').show();
        }
    };

    return helpers;
});

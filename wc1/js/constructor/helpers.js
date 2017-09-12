define(function (require, exports, module) {
    var configuration = require('snippet/configurationSnippet');
    var configurationPreview = require('constructor/configurationPreview');
    var configurationChat = require('client-chat-page/configurationChat');

    var helpers = {
        listener: function (event) {
            console.log('GET MESSAGE3', event.data);

            if (helpers.isJsonString(event.data)) {
                var config = JSON.parse(event.data);

                if (config.screen) {
                    $('#preview').attr('class', "").addClass(config.screen);

                    sessionStorage.setItem('confParams', JSON.stringify({widgets : [{ urls: [], definition: config.widget, styles: config.styles}]}));
                    helpers.applyConfiguration();
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

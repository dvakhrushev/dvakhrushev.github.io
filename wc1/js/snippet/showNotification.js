define(function (require, exports, module) {

    var config = require('snippet/variables');

    return function(title, body, icon) {

        if(window.Notification
            && window.Notification.permission === 'granted'
            && $("#sp-root-container").hasClass('sp-hidden')) {
            var options = {
                body: body,
                icon: icon
            };

            var n = new window.Notification(title, options);
            config.notifications.push(n);

            if(config.SP.sound_notification) {
                config.audioElement.pause();
                config.audioElement.currentTime = 0;
                config.audioElement.play();
            }

            n.onclose = function() {
                var index = config.notifications.indexOf(n);
                if (index > -1) {
                    config.notifications.splice(index, 1);
                }
            };

            n.onclick = function(e) {
                window.focus();
            };
        }
    }
});

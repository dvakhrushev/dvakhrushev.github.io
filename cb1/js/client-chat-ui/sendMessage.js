define(function (require, exports, module) {
    var notTyping = require('client-chat-ui/notTyping');

    return function (session) {
        if ($('#input-field').val() || $('.emoji-wysiwyg-editor').html()) {
            session.send($('#input-field').val());
            $('#input-field').val('');
            $('.emoji-wysiwyg-editor').html('');
            notTyping(session);
        }
    };
});

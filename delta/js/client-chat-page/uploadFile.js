define(function (require, exports, module) {
    var makeid = require('client-chat-page/makeid');
    var updateScrollbar = require('client-chat-page/updateScrollbar');
    var sendXhr = require('chat-api-session/sendXhr');
    
    var uploadFiles = function(cp, formData) {
        var uploadFilesEndpoint = 'files?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, uploadFilesEndpoint, 'POST', formData);
    };

    return function (file) {

        var formData = new FormData();
        formData.append("file-upload-input", file);

        var id = makeid();

        $.chatUI.appendLog({fromClass: "me", msg: "Uploading \"" + file.name + "\"", msgId: id});

        uploadFiles(window.chatSession.cp, formData)
            .fail(function (fail) {
                $('#' + id).detach();
                $.chatUI.appendLog({fromClass: "sys", msg: "Error: " + fail.responseJSON.error_message});
            })
            .done(function (done) {
                $('#' + id).detach();
                if (done && done.file_id) {
                    if (window.chatSession) {
                        var type = 'attachment';
                        if (file.type.match('image.*')) {
                            type = 'image';
                        } else {
                            updateScrollbar();
                        }

                        window.chatSession.fileUploaded(done.file_id, type, done.file_name);
                    }
                }
            });

    };
});

define(function (require, exports, module) {
    var uploadFiles = require('client-chat-page/uploadFiles');

    return function () {

        var obj = $("#chat-body");
        var timeoutID;

        obj.on('dragenter dragleave dragover drop', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });

        obj.on('dragenter', function (e) {
            if ($('#attachFile').is(':visible')) {
                obj.attr("dnd", "1");

                if (timeoutID) {
                    window.clearTimeout(timeoutID);
                    timeoutID = null;
                }
            }
        });

        obj.on('dragleave', function (e) {
            if (timeoutID) {
                window.clearTimeout(timeoutID);
                timeoutID = null;
            } else {
                timeoutID = window.setTimeout(function () {
                    obj.attr("dnd", null);
                }, 200);
            }
        });

        obj.on('dragover', function (e) {
            obj.attr("dnd", "1");
            if (timeoutID) {
                window.clearTimeout(timeoutID);
                timeoutID = null;
            }
        });

        obj.on('drop', function (e) {
            uploadFiles(e.originalEvent.dataTransfer.files);
            obj.attr("dnd", null);
            if (timeoutID) {
                window.clearTimeout(timeoutID);
                timeoutID = null;
            }
        });
    };
});

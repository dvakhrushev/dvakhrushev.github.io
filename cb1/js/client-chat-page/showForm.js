define(function (require, exports, module) {
    var variables = require('client-chat-page/variables');

    return function (fn, frId) {
        var nf = variables.forms[fn];

        if (nf) {
            var frm = document.getElementById('content-form');

            if (frm) {
                if (variables.currentForm && typeof variables.currentForm.onHide === 'function') {
                    variables.currentForm.onHide();
                }

                frm.innerHTML = nf.html;
                variables.currentForm = nf;

                if (frId) {
                    variables.currentFormName = fn;
                    variables.currentFormRequestId = frId;
                }

                if (typeof variables.currentForm.onShow === 'function') {
                    variables.currentForm.onShow();
                }
            }
        }
    };
});

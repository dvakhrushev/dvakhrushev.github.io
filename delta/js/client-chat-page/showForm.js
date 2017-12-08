define(function (require, exports, module) {
    var variables = require('client-chat-page/variables');

    return function (fn, frId) {
        var nf = variables.forms[fn]

        if(!variables.forms[fn]){
            nf = variables.forms.custom_form;
            var form_name = fn;
        }

        if (nf) {
            var frm = document.getElementById('content-form');

            if (frm) {
                if (variables.currentForm && typeof variables.currentForm.onHide === 'function') {
                    variables.currentForm.onHide(form_name);
                }

                frm.innerHTML = nf.html;
                variables.currentForm = nf;

                if (frId) {
                    variables.currentFormName = fn;
                    variables.currentFormRequestId = frId;
                }

                if (typeof variables.currentForm.onShow === 'function') {
                    variables.currentForm.onShow(form_name);
                }
            }
        }
    };
});

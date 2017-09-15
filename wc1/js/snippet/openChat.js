define(function (require, exports, module) {
    var mobileCheck = require('snippet/mobileCheck');
    var keepOpenedState = require('snippet/keepOpenedState');
    var checkAddFrame = require('snippet/checkAddFrame');
    var getConfObject = require('snippet/getConfObject');
    var variables = require('snippet/variables');
    var chatUrl = require('snippet/chatUrl');

    return function (open, deleteIframe) {

        if (mobileCheck()) {
            window.location.replace(chatUrl());
            return;
        }

        var fr = $('#sp-chat-frame'),
            wi = $('#sp-chat-widget'),
            fakeTo = open ? fr : wi,
            fakeFrom = open ? wi : fr,
            def = getConfObject().definition;

        keepOpenedState(open);

        if (fakeTo.is(':visible')) {
            if (deleteIframe) {
                $('#sp-chat-iframe').remove();
            }
            return;
        }

        if (window.localStorage.getItem("bp-bc") !== null) {
            fr.remove();
            return;
        }

        checkAddFrame();
        

        //hot fix for safari
        if (navigator.userAgent.indexOf("Safari") !== -1 && navigator.userAgent.indexOf('Chrome') === -1) {
            fakeFrom.hide();
            fakeTo.toggle();
        } else {

            var config = getConfObject();
            var location = 'bottom_left';
            var direction = 'horizontal';

            if (config.definition.contactTab.location) {
                location = config.definition.contactTab.location;
                direction = (location.indexOf('right_') !== -1 || location.indexOf('left_') !== -1) ? "vertical" : "horizontal";
            }
            fakeTo.toggle();
            fakeTo.toggle();

            var fake = $('#sp-chat-fake');

            if (direction == "vertical") {
                if (open) {
                    var w = fakeTo.width(),
                        h = fakeTo.height();
                    fake.height(fakeFrom.width()).width(fakeFrom.height());
                } else {
                    var w = fakeTo.height(),
                        h = fakeTo.width();
                    fake.height(fakeFrom.height()).width(fakeFrom.width());
                }
            } else {
                var w = fakeTo.width(),
                    h = fakeTo.height();
                fake.height(fakeFrom.height()).width(fakeFrom.width());
            }

            fakeFrom.hide();
            fake.toggle();

            fake.animate({
                width: w,
                height: h
            }, 400, function () {
                if(fakeTo == wi && def.preChat.enabled == false) {} else {
                    fakeTo.toggle();
                }
                fake.toggle();
                variables.init = true;
                if (deleteIframe) {
                    $('#sp-chat-iframe').remove();
                } else {
                    //document.getElementById('sp-chat-iframe').contentWindow.postMessage("sp-dragged", "*"); 
                }
            });
        }
    };
});

define(function (require, exports, module) {
    var mobileCheck = require('snippet/mobileCheck');
    var keepOpenedState = require('snippet/keepOpenedState');
    var checkAddFrame = require('snippet/checkAddFrame');
    var getConfObject = require('snippet/getConfObject');
    var variables = require('snippet/variables');
    var chatUrl = require('snippet/chatUrl');

    return function (open, deleteIframe, startSession) {

        // if (mobileCheck()) {
        //     window.location.replace(chatUrl());
        //     return;
        // }
        if (mobileCheck()) {
            var viewport = $('head meta[name="viewport"]');

            if(viewport.length>0 && !deleteIframe){
                var currentViewport = viewport.attr('content');
            }

            if(!deleteIframe) {
                $('head meta[name="viewport"]').remove();
                $("head").append('<meta name="viewport" content="width=320, initial-scale=1" />');
            } else {
                $('head meta[name="viewport"]').remove();
                if(currentViewport){
                    $("head").append('<meta name="viewport" content="' + currentViewport + ', initial-scale=1" />');
                } else {
                    $("head").append('<meta name="viewport" content="width=device-width" />');
                }
            }
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
        checkAddFrame(startSession);

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
            //console.log(wi, def.contactTab.enabled);
            if((fakeTo == wi && def.contactTab.enabled == false) || (fakeTo == wi && window.sessionStorage.getItem("confFromOtherPage"))) {} else {
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
    };
});

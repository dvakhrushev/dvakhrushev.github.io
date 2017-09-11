define(function (require, exports, module) {

    var getConfObject = require('snippet/getConfObject');

    return function () {

        var config = getConfObject();

        var $offer = $('.proactive-offer');
        var proActiveConfig = config.definition.proactiveOffer;
        var proActiveStyling = config.definition.proactiveOfferStyling;

        var $body = $offer.find('.proactive-offer__body');
        var $callButton = $offer.find('.proactive-offer__button_type_call');
        var $chatButton = $offer.find('.proactive-offer__button_type_chat');
        var $close = $offer.find('.proactive-offer__close');
        var $content = $offer.find('.proactive-offer__content');

        $body
            .width(proActiveStyling.width)
            .height(proActiveStyling.height);

        $callButton.toggleClass('proactive-offer__button_hide_yes', !proActiveConfig.callButtonEnabled);
        $chatButton.toggleClass('proactive-offer__button_hide_yes', !proActiveConfig.chatButtonEnabled);

        $callButton.text(proActiveConfig.callButtonText);
        $chatButton.text(proActiveConfig.chatButtonText);

        $close.toggleClass('proactive-offer__close_hide_yes', !proActiveConfig.closeButtonEnabled);

        $content.html(proActiveConfig.htmlContent);
    };
});

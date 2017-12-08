define(function (require, exports, module) {

    var previewMode = require('constructor/previewMode');

    return function (data, styles) { 

        var config = JSON.parse(sessionStorage.getItem("confParams"));
        
        if (config.widgetType == 'proactive_offer'){
            
            var $offer = $('.proactive-offer'),
                $body = $offer.find('.proactive-offer__body'),
                $callButton = $offer.find('.proactive-offer__button_type_call'),
                $chatButton = $offer.find('.proactive-offer__button_type_chat'),
                $closeButton = $offer.find('.proactive-offer__close.proactive-offer__button'),
                $close = $offer.find('.proactive-offer__close.close-icon'),
                $content = $offer.find('.proactive-offer__content');

            $callButton.toggleClass('proactive-offer__button_hide_yes', !config.properties.callButtonEnabled);
            $chatButton.toggleClass('proactive-offer__button_hide_yes', !config.properties.chatButtonEnabled);

            $callButton.text(config.properties.callButtonText);
            $chatButton.text(config.properties.chatButtonText);
            $closeButton.text(config.properties.cancelButtonText);

            $close.toggleClass('proactive-offer__close_hide_yes', !config.properties.closeButtonEnabled);

            $content.html(config.properties.htmlContent);

            $body
                .width(config.styling.width)
                .height(config.styling.height);
            }
            
            if(previewMode){
                if($offer){
                    $offer.removeAttr('data-animationIn');
                    $offer.attr('data-animationIn', config.styling.animationIn); 
                
                
                    if (config.styling && sessionStorage.getItem('data-animationOut') != config.styling.animationOut){
                        sessionStorage.setItem('runOutAnimation', true);
                        setTimeout(function(){
                            sessionStorage.removeItem('runOutAnimation');
                        },1000)
                    }
                }
                
                if(sessionStorage.getItem('runOutAnimation')){
                    $offer.removeAttr('data-animationIn').removeAttr('data-animationOut').removeClass('removing');
                    $offer.attr('data-animationOut', config.styling.animationOut);
                    $offer.addClass('removing');
                    setTimeout(function(){
                        $offer.removeAttr('data-animationOut').removeClass('removing');
                        sessionStorage.removeItem('runOutAnimation');
                    },700)
                }
                
                if(config.styling){
                    sessionStorage.setItem('data-animationOut', config.styling.animationOut);
                }
            }

                if (typeof scaled === 'undefined' || scaled ==0){
                    
                    var contentHeight = $('.proactive-offer__content').outerHeight(),
                        contentWidth = $('.proactive-offer__content').outerWidth(),
                        buttonsHeight = $('.proactive-offer__button-wrapper').outerHeight(),
                        buttonsWidth = 0,
                        screenWidth = $('.proactive-offer').width()-80;
                        screenHeight = $('.proactive-offer').height()-80,
                        scaled=1;
                    $('.proactive-offer__button-wrapper > *').each(function(){
                        buttonsWidth += $(this).width()+10;
                    });
                    var POheight = contentHeight + buttonsHeight,
                        POwidth = Math.max.apply(Math,[contentWidth, buttonsWidth]);
                    
                    if(POwidth > screenWidth) {
                        var coefX = screenWidth/POwidth;
                    }
                    if (POheight > screenHeight) {
                        var coefY = screenHeight/POheight;
                    }
                    if (coefX || coefY) {
                        var coef = Math.max.apply(Math,[coefX, coefY]),
                                scale = 100/coef;
                        
                        $('.proactive-offer__content-wrapper>div').attr('style','transform:scale(' + coef + ');')
                        $('.proactive-offer__content').css('width',scale + '%')

                        setTimeout(function(){
                            scaled = 0;
                        },3000);
                    }
                }
            
    };
});
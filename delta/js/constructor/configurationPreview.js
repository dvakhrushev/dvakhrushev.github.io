define(function (require, exports, module) {

    return function (data, styles) {

        var conf = JSON.parse(sessionStorage.getItem("confParams"));
        var fullConf = JSON.parse(sessionStorage.getItem("fullConf"));
        var frameHeight = Math.min.apply(Math,[fullConf.widget.chatWidgetStyling.height, window.innerHeight - 20]);
        $('#sp-chat-frame').height(frameHeight);
        $('#sp-chat-frame').width(fullConf.widget.chatWidgetStyling.width);
        $('body').addClass('preview_body');

        if (conf.contactTab) {

            var icon = conf.contactTab.iconUrl || '';
            if (icon.length == 0){
                $('#sp-chat-label-icon').addClass('collapse');
            } else{
                $('#sp-chat-label-icon').removeClass('collapse');
            }
            $('#sp-chat-label-icon').attr('style', 'background:url("'+icon+'") center center no-repeat/contain');
            $('#sp-chat-label-text').text(conf.contactTab.agentsAvailableMsg || '');

            if (conf.contactTab.enabled == false){
                $('#sp-chat-widget').hide();
            } else{
                $('#sp-chat-widget').show();
            }

        }
        
        if(fullConf && fullConf.widget.chatInitiations[0]){
            var src = fullConf.widget.chatInitiations[0].contactTab.iconUrl ? fullConf.widget.chatInitiations[0].contactTab.iconUrl : '';
            if (src.length == 0){
                $('.avatar-image-wrapper').addClass('collapse');
                $('#messages-div').addClass('noAgentImage');
            } else{
                $('.avatar-image-wrapper').removeClass('collapse');
                $('#messages-div').removeClass('noAgentImage');
            }
            $('.avatar-image').attr('style', "background-image:url('" + src + "')");
            $('.previewAgentImage').attr('style','background:url(' + src + ') center center no-repeat;background-size:contain!important;');
            window.sessionStorage.setItem('logoUrl', src) 
        }
        
        if (conf.preChat) {

            var pcConfig = conf.preChat;

            if (pcConfig.enabled == false){
                $('.pre_chat_form #preChatForm').hide();
                $('#sp-chat-frame').css("display","");
                $('.pre_chat_form #sp-chat-frame').hide();
            } else{
                $('.pre_chat_form #preChatForm').css("display","");
                $('.pre_chat_form #sp-chat-frame').css("display","");
            }

            $('.pre_chat_form #agent-name').text(pcConfig.title);

        }

        if (conf.leaveMessage) {
            
            var lmConfig = conf.leaveMessage;

            $('#screen-title').text(lmConfig.title);

        }

        if ($.fn.perfectScrollbar) {
            $('.questionFormInner').perfectScrollbar({useBothWheelAxes: false});
            $('.offlineFields').perfectScrollbar({useBothWheelAxes: false});
            $('.custom-form-fields').perfectScrollbar({useBothWheelAxes: false});
            $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});
        }

    };
});

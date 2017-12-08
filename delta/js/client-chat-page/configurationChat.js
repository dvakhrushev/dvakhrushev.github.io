define(function (require, exports, module) {
    var proactiveOfferConfig = require('client-chat-page/configurationProactiveOffer');
    var updateStyles = require('updateStyles');
    var safeEndSession = require('client-chat-page/safeEndSession');
    var variables = require('client-chat-page/variables');
    var connection = require('client-chat-page/connection');
    var mobileCheck = require('snippet/mobileCheck');
    var previewMode = require('constructor/previewMode');
    var getConf = require('getConf');
    var generateInputs = require('client-chat-page/generateInputs'); 

    return function (data, styles) {
            
        var conf = sessionStorage.getItem("confParams");

        var confObj = JSON.parse(conf),
            target = getConf(conf, false,'confchat'),
            styles = (previewMode) ? JSON.parse(sessionStorage.getItem("styles")) : confObj.styles,
            comparsion = (previewMode) ? (confObj.widgetType == 'chat_styling') : (true),
            cwConfig = (previewMode) ? confObj : confObj.definition.chatWidgetStyling;

        if (previewMode) {
            var lmConfig = confObj.leaveMessage,
                poConfig = confObj,
                snippetConfig = confObj,
                customFormConfig = confObj, 
                win = window;
        }

        if (target.chatInitiation && typeof target.chatInitiation.widgetIndex !== 'undefined'){
            var snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex],
                lmConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex].leaveMessage,
                poConfig = confObj.definition.proactiveOffers[target.proactiveOffer.widgetIndex],
                customFormConfig = confObj.definition.forms[target.form.widgetIndex],
                logoUrl = snippetConfig.contactTab.iconUrl, 
                win = window.parent;
        }
        
        var pcConfig = (snippetConfig && snippetConfig.preChat) ? snippetConfig.preChat : '',
            source = window.sessionStorage.getItem('source'),
            sourceObj = (source == 'proactive' && window.sessionStorage.getItem('serviceAvailable') =='true') ? poConfig.preChat : pcConfig;
        
        function checkIframe() {
            var key = (+new Date) + "" + Math.random();

            try {
                var global = window.parent;
                global[key] = "asd";
                return global[key] === "asd";
            }
            catch(e){
                return false;
            }
        }

        if (!checkIframe()){
            win = window;
        }
            
        if (comparsion){

            if(!mobileCheck()){
                var frameHeight = Math.min.apply(Math,[cwConfig.height, win.innerHeight - 20]);
                $('#sp-chat-frame').css('height', frameHeight);
                $('#sp-chat-frame').css('width', cwConfig.width);

            } else {
                $('#sp-chat-frame').css({
                    height: '100%',
                    width: '100%'
                });
            }
            switch (cwConfig.showAgentPic) {
                case 'none':
                    window.sessionStorage.removeItem('logoUrl');
                    $('#messages-div').addClass('noAgentImage');
                    $('#messages-div').removeClass('defaultAgentImage');
                    $('#header-avatar .avatar').hide();
                    break;
                case 'always_default':
                    if (logoUrl){
                        window.sessionStorage.setItem('logoUrl', logoUrl);
                    } else {
                        window.sessionStorage.setItem('logoUrl', 'none');
                    }
                    $('#header-avatar .avatar').show();                    
                    break;
                case 'show':
                    $('#header-avatar .avatar').show();
                    $('#messages-div').removeClass('noAgentImage');
                    $('#messages-div').removeClass('defaultAgentImage');
                    $('.previewAgentImage').attr('style','background:url(images/man-with-glasses.jpg) center center no-repeat/contain;');
                    window.sessionStorage.removeItem('logoUrl');
                    break;
            }
            
            if (cwConfig.fileUploadEnabled === false) {
                $('#attachFile:not(.preview)').remove();
                $('#attachFile.preview').hide();
                $('#input-div').addClass('without_file');
            } else {
                $('#attachFile.preview').show(); 
                $('#input-div').removeClass('without_file');
            }

           

            if (cwConfig.title) {
                $('.agent-name').text(cwConfig.title);
            }

            $('.agentJoinedMessage span').text(cwConfig.agentJoinedMessage);
            $('.inactivityWarningText span').text(cwConfig.inactivityWarningMessage);
            $('.inactivityTimeoutText span').text(cwConfig.inactivityTimeoutMessage);
            $('.sessionEndedText span').text(cwConfig.sessionEndedMessage);
            $('.agentLeftText span').text(cwConfig.agentLeftMessage);
            $('.chat_widget #agent-name').text(cwConfig.title);

        }

        if(confObj.widgetType == 'onPageForm'){ 
            
            if($('.sp-callback-form').length == 1) {
                $('#preview .sp-callback-form').css('display','inline-block'); 
            }
            generateInputs(confObj.fields, '.sp-callback-form'); 
            var chatButtonText = confObj.chatButtonText;
            var callButtonText = confObj.callButtonText;

            if (confObj.chatButtonEnabled){
                $('.sp-callback-form').append('<button id="sp-callback-submit" class="chatButton">' + chatButtonText + '</button>');
            } else{
                $('.chatButton').remove();
            }
            if (confObj.callButtonEnabled){
                $('.sp-callback-form').append('<button id="sp-callback-submit" class="callButton">' + callButtonText + '</button>');
            } else{
                $('.callButton').remove();
            }
        }
        

        if (sourceObj){
            
            if(sourceObj.enabled) {
                var isCallButtonEnabled = sourceObj.callButtonEnabled;
                var isChatButtonEnabled = sourceObj.chatButtonEnabled;
                $('#preChatForm')
                    .toggleClass('question__call-tab_hide', !isCallButtonEnabled)
                    .toggleClass('question__chat-tab_hide', !isChatButtonEnabled)
                    .toggleClass('question__call-tab_active', (isCallButtonEnabled && !isChatButtonEnabled))
                    .toggleClass('question__chat-tab_active', isChatButtonEnabled);

                    
                if (sessionStorage.getItem('serviceAvailable') == 'false'){
                    var title = lmConfig ? lmConfig.title : '';
                } else{
                        var title = sourceObj.title;
                }

                $('#agent-name').html(title);
                $('#submitPhone').val(sourceObj.callButtonText);
                $('.tabPhone span').text(sourceObj.callButtonText);
                $('#submitChat').val(sourceObj.chatButtonText);
                $('.tabChat span').text(sourceObj.chatButtonText);
                $('#cancelPreChatForm').val(sourceObj.cancelButtonText);
                $('#cancelPreChatForm').on('click', function () {
                    safeEndSession();
                });

                var submit = function (formName, className) {
                    var globalNoError = true;

                    switch (formName){
                        case 'preChatForm':
                                var fields = $('#preChatForm .commonFields .field-wrapper, #preChatForm .' + className + ' .field-wrapper').not(".field-label, .field-captcha");
                                break;
                        case 'questionForm':
                                var fields = $('#questionForm .field-wrapper').not(".field-label, .field-captcha");
                                break;
                        case 'unavailableForm':
                                var fields = $('#unavailableForm .field-wrapper').not(".field-label, .field-captcha");
                                variables.leaveMessageForm = 'true';
                                variables.extChatData = {
                                    email: (lmConfig.email) ? lmConfig.email : ''
                                };
                                fields.each(function(index){
                                    var name = $(this).find('input,label,select,textarea').attr('name');
                                    var val;
                                    if($(this).find('input').not('input[type="radio"],input[type="checkbox"]').length>0){
                                        val = $(this).find('input').val();
                                    }
                                    if($(this).find('textarea').length>0){
                                        val = $(this).find('textarea').val();
                                    }
                                    if($(this).find('input[type="radio"],input[type="checkbox"]').length>0){
                                        val = $(this).find('input:checked').val();
                                    }
                                    if($(this).find('select').length>0){
                                        val = $(this).find('option:selected').val();
                                    }
                                    variables.extChatData[name] = val;
                                    
                                })
                               
                                break;
                     }

                    fields.each(function () {
                        var val;
                        var key;
                        var noError;

                        switch ($(this).attr('class')) {

                            case 'field-wrapper field-radio':
                                val = $(this).find('input:checked').val();
                                key = $(this).find('input:checked').attr('name');
                                noError = ( $(this).find('input:checked').length == 0 && $(this).find('input[requried="true"]').length > 0) ? false : true;
                                break;

                            case 'field-wrapper field-multiline':
                                val = $(this).find('textarea').val();
                                key = $(this).find('textarea').attr('name');
                                noError = ( $(this).find('textarea').val().length == 0 && ($(this).find('textarea').attr('required') || $(this).find('textarea[requried="true"]').length > 0)) ? false : true;
                                break;

                            case 'field-wrapper field-select':
                                val = $(this).find('option:selected').val();
                                key = $(this).find('select').attr('name');
                                noError = ( $(this).find('option:selected').val().length == 0 && $(this).find('select[requried="true"]').length > 0) ? false : true;
                                break;

                            default:
                                
                                val = $(this).find('input').val();
                                key = $(this).find('input').attr('name');
                                noError = ($(this).find('input').val().length == 0 && ($(this).find('input').attr('required') || $(this).find('input[requried="true"]').length > 0)) ? false : true;
                        }
                        
                        switch (key){
                            case 'email':
                                variables.cp.email = val;
                                break;
                            case 'first_name':
                                variables.cp.first_name = val;
                                break;
                            case 'last_name':
                                variables.cp.last_name = val;
                                break;
                            case 'from':
                                variables.cp.from = val;
                                break;
                            case 'phone_number':
                                variables.cp.phone_number = val;
                                break;
                            case 'phone':
                                variables.cp.phone_number = val;
                                break;
                        }

                        variables.cp.parameters[key] = val;                        
                        
                        $(this).find('.error-balloon').hide();

                        if (noError === false) {
                            $(this).find('.error-balloon').show();
                            globalNoError = false;
                        }

                    });

                    if (JSON.stringify(sourceObj).indexOf('"formFieldType":"captcha"') !== -1) {
                        var string = '';
                        $('.captcha td').each(function () {
                            string += $(this).text();
                        });
                        if (string != $('#captchaText').val()) {
                            $('#error-captcha').css("display", "block");
                            globalNoError = false;
                        }
                    }
                    console.log(variables);
                    if (globalNoError) {
                         $('#offline-form').css('display', 'none');
                         switch (formName){
                            case 'preChatForm':
                                    connection.connect();
                                    $('#preChatForm').css('display', 'none');
                                    break;
                            case 'questionForm':
                                    connection.connect();
                                    $('#questionForm').css('display', 'none');
                                    break;
                            case 'unavailableForm':
                                    connection.connect();
                                    $('#unavailableForm').css('display', 'none');
                                    break;
                         }

                    } else{ 
                        switch (formName) {
                            case 'preChatForm':
                                $('.questionFormInner').animate({
                                    scrollTop: $('.error-balloon:visible').eq(0).offset().top + $('.questionFormInner').scrollTop() -154},
                            'fast');
                                break;
                            case 'questionForm':
                                $('.questionFormFieldsWrapper').animate({
                                    scrollTop: $('.error-balloon:visible').eq(0).offset().top + $('.questionFormInner').scrollTop() -154},
                            'fast');
                                break;
                            case 'unavailableForm':
                                    $('#offline-form-fields').animate({
                                    scrollTop: $('.error-balloon:visible').eq(0).offset().top + $('.questionFormInner').scrollTop() -154},
                            'fast');
                                    break;

                        }
                        
                    }

                };

                $('#submit').on('click', function () {
                    submit('questionForm');
                });

                $('#submitChat').on('click', function () {
                    submit('preChatForm', 'chatFields');
                });

                $('#submitPhone').on('click', function () {
                    submit('preChatForm', 'phoneFields');
                });

                $('#unsubmit').on('click', function () {
                    submit('unavailableForm');
                });
                
                
                generateInputs(sourceObj.commonFields, '.commonFields');
                generateInputs(sourceObj.chatFields, '.chatFields');
                generateInputs(sourceObj.phoneFields, '.phoneFields');
            }

            
        }
        
        if(snippetConfig && snippetConfig.contactTab){
            var src = snippetConfig.contactTab.iconUrl ? snippetConfig.contactTab.iconUrl : '';
            if (src.length > 0){
                $('.avatar-image').attr('style', "background-image:url('" + src + "')");
            } else {
                $('.avatar-image-wrapper').addClass('collapse');
            }

        }
        

        if (lmConfig){


            if (lmConfig.okButtonText) {
                $('#unsubmit').val(lmConfig.okButtonText);
            }

            if (lmConfig.cancelButtonText) {
                $('#uncancel').html(lmConfig.cancelButtonText);
            }
            
            generateInputs(lmConfig.fields, '.offlineFields');

        }

        if (customFormConfig){

            if (customFormConfig.title) {
                $('#agent-name').html(customFormConfig.title);
            }

            if (!previewMode){
                var frameHeight = Math.min.apply(Math,[cwConfig.height, window.parent.innerHeight - 20]);
            } else {
                var frameHeight = Math.min.apply(Math,[cwConfig.height, window.innerHeight - 20]);
            }
            $('#sp-chat-frame').css('height', frameHeight);
            $('#sp-chat-frame').css('width', cwConfig.width);

            generateInputs(customFormConfig.fields, '.customFormFields');

        }
        proactiveOfferConfig();

        updateStyles(cwConfig, styles);
  
        if ($.fn.perfectScrollbar) {
            $('#surveyForm').perfectScrollbar({useBothWheelAxes: false});
            $('.questionFormInner').perfectScrollbar({useBothWheelAxes: false});
            $('.offlineFields').perfectScrollbar({useBothWheelAxes: false});
            $('.custom-form-fields').perfectScrollbar({useBothWheelAxes: false});
            $('.questionFormFieldsWrapper').perfectScrollbar({useBothWheelAxes: false});
        }
  

        
    };
});

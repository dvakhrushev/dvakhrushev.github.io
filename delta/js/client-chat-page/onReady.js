define(function (require, exports, module) {
    var getUrlVars = require('client-chat-page/getUrlVars');
    var mobileCheck = require('snippet/mobileCheck');
    var platform = require('libraries/platform/platform.min');
    var safeEndSession = require('client-chat-page/safeEndSession');
    var variables = require('client-chat-page/variables');
    var getConfObject = require('snippet/getConfObject');
    var uploadFiles = require('client-chat-page/uploadFiles');
    var updateScrollbar = require('client-chat-page/updateScrollbar');
    var onFormSubmit = require('client-chat-page/onFormSubmit');
    var getConnectRequestData = require('client-chat-page/getConnectRequestData');
    var connection = require('client-chat-page/connection');
    var configuration_chat = require('client-chat-page/configurationChat');
    var checkSessionExists = require('chat-api-session/checkSessionExists');
    var buildSessionFromSessionId = require('chat-api-session/buildSessionFromSessionId');
    var getConf = require('getConf');
    var showForm = require('client-chat-page/showForm');

    return function (e) {
        var args = getUrlVars(window.location.href);

        for (var arg in args) {
            if (args.hasOwnProperty(arg)) {
                variables.cp[arg] = args[arg];
            }
        }

        window.parent.postMessage("ready", "*");

        $(window).on("message", function (event) {
            var data = event.originalEvent.data;

            if(data.indexOf('definition')!=-1){
                sessionStorage.setItem("confParams",data);
                generateForms();
            }
            if(data.indexOf('[parentPath]')!=-1){
                var value = data.split('[parentPath]=')[1];
                sessionStorage.setItem("parentPath",value)
            }
            if(data.indexOf('[parentHost]')!=-1){
                var value = data.split('[parentHost]=')[1];
                sessionStorage.setItem("parentHost",value)
            }
            if(data.indexOf('[serviceAvailable]')!=-1){
                var value = data.split('[serviceAvailable]=')[1];
                sessionStorage.setItem("serviceAvailable",value)
            }
        });

        
            

        function generateForms(){
            var conf = window.sessionStorage.getItem("confParams");
            
            if(conf) {
                var confObj = JSON.parse(conf),
                target = getConf(conf, false);
                if(confObj && typeof target.chatInitiation.widgetIndex !== 'undefined'){

                    snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];

                    $('body').addClass(Object.keys(confObj.styles)[0]);
                    $('body').addClass('position_' + snippetConfig.contactTab.location);
                    if (snippetConfig.contactTab.location.indexOf('right_') !== -1 || snippetConfig.contactTab.location.indexOf('left_') !== -1) {
                        $('body').addClass('vertical');
                    } else {
                        $('body').addClass('horizontal');
                    }
                    snippetConfig.contactTab.location.split('_').forEach(function (item, i) {
                        $('body').addClass(item + "_" + i);
                    });
            
                }
            }

            start = args.start;
            if(confObj){ 
                configuration_chat();
            }

            if(start){
                var sessionId = start;
                connection.connect();

            } else{

                switch (window.sessionStorage.getItem("tab")) {
                    case 'chat':
                        $('#preChatForm').removeClass('question__call-tab_active');
                        $('#preChatForm').addClass('question__chat-tab_active');
                        break;
                    case 'call':
                        $('#preChatForm').removeClass('question__chat-tab_active');
                        $('#preChatForm').addClass('question__call-tab_active');
                        break;
                }

                var sessionId = window.sessionStorage.getItem("sp-chat-session");

                if (sessionId) {
                    checkSessionExists(getConnectRequestData(), sessionId)
                        .fail(function () {
                            if(typeof snippetConfig !== 'undefined'){
                                preChatCheck(confObj, snippetConfig);
                            }
                        })
                        .done(function () {
                            connection.onConnected(buildSessionFromSessionId(getConnectRequestData(), sessionId, '?'));
                        });
                } else {
                    if(typeof snippetConfig !== 'undefined'){
                        preChatCheck(confObj, snippetConfig);
                    }
                }

            }

            

            // Initializes and creates emoji set from sprite sheet
            window.emojiPicker = new EmojiPicker({
                emojiable_selector: '[data-emojiable=true]',
                assetsPath: '../js/libraries/emoji/img',
                popupButtonClasses: 'fa fa-smile-o'
            });
            // Finds all elements with `emojiable_selector` and converts them to rich emoji input fields
            // You may want to delay this step if you have dynamically created input fields that appear later in the loading process
            // It can be called as many times as necessary; previously converted input fields will not be converted again
            window.emojiPicker.discover();

            if (mobileCheck()) {
                $('#inner-chat').addClass("mobile-version");
            }

            if (navigator.userAgent.match(/iPhone/i)) {
                $('#input-div').addClass("input-div-iphone");
            }

            $(document.getElementById('content-form')).on("submit", onFormSubmit);

            var cp = variables.cp;
            variables.cp.parameters = {
                email: cp.email,
                last_name: cp.last_name,
                first_name: cp.first_name,
                account_number: cp.account_number,
                logging: cp.logging,
                location: {
                    latitude: cp.latitude,
                    longitude: cp.longitude
                },
                user_platform: {
                    browser: platform.name + ' ' + platform.version,
                    os: platform.os.toString(),
                    description: platform.description
                }
            };

        
        }

        var preChatCheck = function (confObj, snippetConfig) {
            if(confObj && snippetConfig && snippetConfig.preChat.enabled) {
                $('#offline-form').css('display', 'block');

                available = sessionStorage.getItem('serviceAvailable');

                if (available == 'false') {
                    $('#unavailableForm').css('display', 'block');
                }
                else {
                    $('#preChatForm').css('display', 'block');
                }
                // sessionStorage.removeItem('serviceAvailable');

            } else {
                connection.connect();
            }
        };

        

        $('#servicepattern_close_button').on('click', function () {
            safeEndSession();
        });

        $('#input-button').on('click', function () {
            $.chatUI.sendMessage(window.chatSession);
        });

        $('#custom_cancel').on('click', function () { 
             if ($(this).parents('#customForm').hasClass('secure')){
                window.chatSession.cancelSecureForm(variables.currentFormRequestId, variables.currentFormName);
             }
        });

        $('#custom_submit').on('click', function (key) { 

            var data = {};
            
            var fields = $('.customFormFields .field-wrapper');
            fields.each(function(key){
                if($(this).find('*[name]').length>0){
                    key = $(this).find('*[name]').attr('name');
                }
                if($(this).find('label').length >0){
                    data[key] = $(this).find('label').html();
                }

                if($(this).find('input[type=tel], input[type=email], input[type=text], input[type=datetime], input[type=range], input[type=button]').length >0){
                    data[key] = $(this).find('input').val();
                }

                if($(this).find('input[type=checkbox], input[type=radio]').length >0){
                    data[key] = $(this).find('input:checked').val();
                }

                if($(this).find('select').length >0){
                    data[key] = $(this).find('option:selected').val();
                }

                if($(this).find('textarea').length >0){
                    data[key] = $(this).find('textarea').val();
                }

                if($(this).find('button').length >0){
                    data[key] = $(this).find('button').val();
                }              
            });
            if ($(this).parents('#customForm').hasClass('secure')){
                window.chatSession.sendSecureFormData(variables.currentFormRequestId, variables.currentFormName, data);
            } else{
                window.chatSession.sendFormData(variables.currentFormRequestId, variables.currentFormName, data);
            }
            
        });

        $('#uncancel').on('click', function () {
           safeEndSession();
        });

        $("#submitSurvey").on("click", function () {

            var data = {};
            var noError = true;
            var radios = $('input[name="service"]:checked');
            if (radios.length > 0)
                data.service = radios.get(0).value;

            radios = $('input[name="helpful"]:checked');
            if (radios.length > 0)
                data.helpful = radios.get(0).value;

            radios = $('input[name="recommend"]:checked');
            if (radios.length > 0)
                data.recommend = radios.get(0).value;

            radios = $('input[name="transcript"]:checked');
            if (radios.length > 0)
                data.transcript = radios.get(0).value;

            data.transcriptEmail = $('#transcriptEmail').val();
            if ($('input[name="transcript"]:checked').length>0 && !validateEmail(data.transcriptEmail)){
                noError = false;
                $('#transcriptEmail').addClass('error');
            } else{
                noError = true;
                $('#transcriptEmail').removeClass('error');
            }
            if(noError == true){
                window.chatSession.sendFormData(variables.currentFormRequestId, variables.currentFormName, data);
            }
        });
        
        function validateEmail(email) {
            var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }

        $('#input-field, .emoji-wysiwyg-editor').on('keypress', function (event) {
            $.chatUI.msgKeyPress(event, window.chatSession);
        });

        $('#input-field').on('blur', function (event) {
            $.chatUI.notTyping(window.chatSession);
        });

        $('body').on('keypress', '.emoji-wysiwyg-editor', function (event) {
            $.chatUI.msgKeyPress(event, window.chatSession);
        });

        $('body').on('keyup', '.emoji-wysiwyg-editor', function () {
            var $editor = $('.emoji-wysiwyg-editor');

            var bottom = $('.chat-body__input').height();
            var scrollHeight = $editor.prop("scrollHeight") - 12;
            
            if($editor.html().length>20){
                $editor.height(scrollHeight + "px");
            } else {
                $editor.height("auto");
                $('#messages-div').css("bottom", "auto");
            }

            $('#input-field').val($editor.text());
            $('#messages-div').css("bottom", bottom + "px");
        });

        $('body').on('blur', '.emoji-wysiwyg-editor', function () {
            $.chatUI.notTyping(window.chatSession);
        });

        $('#endChat').on('click', function () {
            window.chatSession.disconnectSession();
        });

        $('#customForm .buttons > div').on('click', function () {
            $('#customForm').css('display', 'none');
            updateScrollbar();
        });

        $('#callme').on('click', function () {
            if ($('#callme').hasClass("hang-up")) {
                window.chatSession.webRTC.closeConnection();
                $('#callme').removeClass("hang-up");
                $('#video').css("display", "none");
                $('#servicepattern-chat').css('top', '0');
                updateScrollbar();
            } else {
                if (window.chatSession.internalParty) {
                    window.chatSession.callPrompt = $('#call-prompt');
                    window.chatSession.webRTCSignaling(window.chatSession.internalParty.id).requestCall(true);
                }
            }
        });



        $('#shareScreen').on('click', function () {
            if ($('#shareScreen').hasClass('stop-sharing')) {
                window.parent.postMessage("sp-stop-together", "*");
            } else {
                window.parent.postMessage("sp-start-together", "*");
            }
        });


        $('#requestAudio').on('click', function () {
            if (window.chatSession.internalParty) {
                window.chatSession.callPrompt = $('#call-prompt');
                window.chatSession.webRTCSignaling(window.chatSession.internalParty.id).requestCall(false);
            }
        });

        $('#attachFile').on('click', function () {
            $('#file-upload-form').html('<input type="file" id="attach-file" name="file-upload-input"/>');
            $('#attach-file').on('change', function (event) {
                uploadFiles(event.target.files);
            });
            $('#attach-file').click();
        });
        
        

    };
});

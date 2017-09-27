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

    return function (e) {
        var args = getUrlVars(window.location.href);

        for (var arg in args) {
            if (args.hasOwnProperty(arg)) {
                variables.cp[arg] = args[arg];
            }
        }

        start = args.start;
        
        configuration_chat();
        
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
                        preChatCheck();
                    })
                    .done(function () {
                        connection.onConnected(buildSessionFromSessionId(getConnectRequestData(), sessionId, '?'));
                    });
            } else {
                preChatCheck();
            }

        }

        
        var config = getConfObject();

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

        $('#servicepattern_close_button').on('click', function () {
            safeEndSession();
        });

        $('#input-button').on('click', function () {
            $.chatUI.sendMessage(window.chatSession);
        });

        $('#uncancel').on('click', function () {
            window.chatSession.endSession();
        });

        $("#submitSurvey").on("click", function () {

            var data = {};
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

            window.chatSession.sendFormData(variables.currentFormRequestId, variables.currentFormName, data);
        });

        // $('#unsubmit').on('click', function () {

        //     variables.extChatData = {
        //         email: config.definition.leaveMessage.email
        //     };

        //     var globalNoError = true;

        //     var fields = $('#unavailableForm .field-wrapper').not(".field-label, .field-captcha");
        //     fields.each(function () {
        //         var val;
        //         var key;
        //         var noError;

        //         switch ($(this).attr('class')) {

        //             case 'field-wrapper field-radio':
        //                 val = $(this).find('input:checked').val();
        //                 key = $(this).find('input:checked').attr('name');
        //                 noError = ( $(this).find('input:checked').length == 0 && $(this).find('input[requried]').length > 0) ? false : true;
        //                 break;

        //             case 'field-wrapper field-multiline':
        //                 val = $(this).find('textarea').val();
        //                 key = $(this).find('textarea').attr('name');
        //                 noError = ( $(this).find('textarea').val().length === 0 && $(this).find('textarea[requried]').length > 0) ? false : true;
        //                 break;

        //             case 'field-wrapper field-select':
        //                 val = $(this).find('option:selected').val();
        //                 key = $(this).find('select').attr('name');
        //                 noError = ( $(this).find('option:selected').val().length === 0 && $(this).find('select[requried]').length > 0) ? false : true;
        //                 break;

        //             default:
        //                 val = $(this).find('input').val();
        //                 key = $(this).find('input').attr('name');
        //                 noError = ($(this).find('input').val().length === 0 && $(this).find('input[requried]').length > 0) ? false : true;

        //         }

        //         variables.extChatData[key] = val;

        //         if (noError === false) {
        //             $(this).find('.error-balloon').show();
        //         }
        //     });

        //     if (JSON.stringify(config.definition.preChat).indexOf('"formFieldType":"captcha"') !== -1) {
        //         var string = '';
        //         $('.captcha td').each(function () {
        //             string += $(this).text();
        //         });
        //         if (string !== $('#captchaText').val()) {
        //             $('#error-captcha').css("display", "block");
        //             globalNoError = false;
        //         }
        //     }

        //     if (globalNoError) {
        //         window.chatSession.sendFormData(variables.currentFormRequestId, variables.currentFormName, variables.extChatData);
        //     }

        // });

        $('#input-field').on('keypress', function (event) {
            $.chatUI.msgKeyPress(event, window.chatSession);
        });

        $('#input-field').on('blur', function (event) {
            $.chatUI.notTyping(window.chatSession);
        });

        $('body').on('keypress', '.emoji-wysiwyg-editor', function () {
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

        // $('#first_name').on('focus', function() {
        //     $('#error-first_name').css("display", "none");
        // });

        // $('#last_name').on('focus', function() {
        //     $('#error-last_name').css("display", "none");
        // });

        // $('#email').on('focus', function() {
        //     $('#error-phone').css("display", "none");
        // });

        // $('#question').on('focus', function() {
        //     $('#error-message').css("display", "none");
        // });

        $('#endChat').on('click', function () {
            window.chatSession.disconnectSession();
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
        
        var preChatCheck = function () {
            if(config.definition.preChat.enabled) {
                $('#offline-form').css('display', 'block');

                available = sessionStorage.getItem('serviceAvailable');
                if (available == 'false') {
                    $('#unavailableForm').css('display', 'block');
                }
                else {
                    $('#preChatForm').css('display', 'block');
                }
                sessionStorage.removeItem('serviceAvailable');

            } else {
                connection.connect();
            }
        };

    };
});

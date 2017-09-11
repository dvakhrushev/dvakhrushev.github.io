define(function (require, exports, module) {
    var proactiveOfferConfig = require('client-chat-page/configurationProactiveOffer');
    var getConfObject = require('snippet/getConfObject');
    var updateStyles = require('updateStyles');
    var safeEndSession = require('client-chat-page/safeEndSession');
    var variables = require('client-chat-page/variables');
    var connection = require('client-chat-page/connection');

    return function () {
        var config = getConfObject();

        var def = config.definition;

        var cwConfig = def.chatWidgetStyling;
        var pcConfig = def.preChat;
        var lmConfig = def.leaveMessage;

        proactiveOfferConfig();

        updateStyles(config, config.styles, def.highlights);

        $('#sp-chat-frame').css({
            height: cwConfig.height,
            width: cwConfig.width
        });

        if (cwConfig.fileUploadEnabled === false) {
            $('body:not(#preview) #attachFile').remove();
            $('#input-div').addClass('without_file');
        }

        if (cwConfig.logoUrl) {
            $('.avatar-image').attr('src', cwConfig.logoUrl);
        }

        if (cwConfig.title) {
            $('.agent-name').text(cwConfig.title);
        }

        if(pcConfig.enabled) {
            var isCallButtonEnabled = pcConfig.callButtonEnabled;
            var isChatButtonEnabled = pcConfig.chatButtonEnabled;

            $('#preChatForm')
                .toggleClass('question__call-tab_hide', !isCallButtonEnabled)
                .toggleClass('question__chat-tab_hide', !isChatButtonEnabled);

            $('#submitPhone').val(pcConfig.callButtonText);
            $('#submitChat').val(pcConfig.chatButtonText);
            $('#cancelPreChatForm').val(pcConfig.cancelButtonText);
            $('#cancelPreChatForm').on('click', function () {
                safeEndSession();
            });

            var submit = function (className) {
                var globalNoError = true;

                var fields = $('#preChatForm .' + className + ' .field-wrapper').not(".field-label, .field-captcha");
                fields.each(function () {
                    var val;
                    var key;
                    var noError;

                    switch ($(this).attr('class')) {

                        case 'field-wrapper field-radio':
                            val = $(this).find('input:checked').val();
                            key = $(this).find('input:checked').attr('name');
                            noError = ( $(this).find('input:checked').length == 0 && $(this).find('input[requried]').length > 0) ? false : true;
                            break;

                        case 'field-wrapper field-multiline':
                            val = $(this).find('textarea').val();
                            key = $(this).find('textarea').attr('name');
                            noError = ( $(this).find('textarea').val().length == 0 && $(this).find('textarea[requried]').length > 0) ? false : true;
                            break;

                        case 'field-wrapper field-select':
                            val = $(this).find('option:selected').val();
                            key = $(this).find('select').attr('name');
                            noError = ( $(this).find('option:selected').val().length == 0 && $(this).find('select[requried]').length > 0) ? false : true;
                            break;

                        default:
                            val = $(this).find('input').val();
                            key = $(this).find('input').attr('name');
                            noError = ($(this).find('input').val().length == 0 && $(this).find('input[requried]').length > 0) ? false : true;
                    }

                    variables.cp.parameters[key] = val;

                    if (noError === false) {
                        $(this).find('.error-balloon').show();
                    }

                });

                if (JSON.stringify(config.definition.preChat).indexOf('"formFieldType":"captcha"') !== -1) {
                    var string = '';
                    $('.captcha td').each(function () {
                        string += $(this).text();
                    });
                    if (string != $('#captchaText').val()) {
                        $('#error-captcha').css("display", "block");
                        globalNoError = false;
                    }
                }

                if (globalNoError) {
                    $('#offline-form').css('display', 'none');
                    $('#preChatForm').css('display', 'none');
                    connection.connect();
                }
            };

            $('#submitChat').bind('click', function () {
                submit('chatFields');
            });

            $('#submitPhone').bind('click', function () {
                submit('phoneFields');
            });

            generateInputs(pcConfig.commonFields, '.commonFields');
            generateInputs(pcConfig.chatFields, '.chatFields');
            generateInputs(pcConfig.phoneFields, '.phoneFields');
        }


        if (lmConfig.okButtonText) {
            $('#unsubmit').val(lmConfig.okButtonText);
        }

        if (lmConfig.cancelButtonText) {
            $('#uncancel').html(lmConfig.cancelButtonText);
        }

        generateInputs(lmConfig.fields, '.offlineFields');

        $('.questionFormInner').perfectScrollbar({useBothWheelAxes: false});
        $('#offline-form-fields').perfectScrollbar({useBothWheelAxes: false});

        function generateInputs(object, parentElement) {

            var formInputsOutput = '';

            object.forEach(function (item, i, arr) {

                var formFieldType = item.formFieldType,
                    label = item.label,
                    placeholder = item.name,
                    name = item.name ? item.name.replace(/\s/g, '_').toLowerCase() : 'field_' + i,
                    required = item.required ? "true" : "false",
                    requiredSuffix = item.required ? '*' : '',
                    errorMsg = item.required ? ' <div id="error-' + name + '" class="error-balloon">Please, fill</div>' : '',
                    options = item.options,
                    outputCurrent = '';

                switch (formFieldType) {

                    case 'label':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-label">' +
                            '<label id="' + name + '">' + label + '</label>' +
                            '</div>';
                        break;

                    case 'callback_phone':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-callback-phone">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="tel" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'phone':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-tel">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="tel" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'email':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-email">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="email" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'name':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-name">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="text" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'text':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-text">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="text" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'date':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-date">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="datetime" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'multiline_text':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-multiline">' +
                            '<textarea ' +
                            'class="agent-message"' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'requried="' + required +
                            '">' +
                            '</textarea>' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'numerical_range_slider':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-range">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="range" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="" ' +
                            'min="' + options.min +
                            '" max="' + options.max +
                            '" requried = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'radio_buttons':
                        outputCurrent = '<div class="field-wrapper field-radio">';
                        options.forEach(function (option, j) {
                            outputCurrent += '' +
                                '<div class="option">' +
                                '<input ' +
                                'type="radio" ' +
                                'id="' + name + '_' + j +
                                '" name="' + name +
                                '" value="' + option +
                                '" requried="' + required +
                                '" />' +
                                '<label for="' + name + '_' + j + '">' +
                                option +
                                '</label><' +
                                '/div>';
                        });
                        outputCurrent += errorMsg + '</div>';
                        break;

                    case 'captcha':

                        var defaults = {
                            captchaLength: 5,
                            chars: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
                        };

                    function generateCaptcha(options) {
                        var text = '';
                        for (var i = 0; i < options.captchaLength; i++) {
                            var rand = Math.floor(Math.random() * options.chars.length);
                            text += options.chars.charAt(rand);
                        }
                        return text;
                    }

                        var captchaText = generateCaptcha(defaults);

                        var table = $('<table></table>')

                        var row = $('<tr></tr>').appendTo(table);
                        for (var i = 0; i < captchaText.length; i++) {
                            $('<td>' + captchaText.charAt(i) + '</td>').css({
                                'border': '1px solid lightgrey'
                            }).appendTo(row);
                        }

                        outputCurrent = '<div class="field-wrapper field-captcha"><label>Enter the text shown below: </label><div class="captcha_wrapper"><input type="text" required="true" id="captchaText" /><table class="captcha">' + table.html() + '</table></div><div id="error-captcha" class="error-balloon">Incorrect code</div></div>';
                        break;

                    case 'contact_button':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-contact-button">' +
                            '<input ' +
                            'type="button" ' +
                            'id="' + name +
                            '" name="' + name +
                            // '" placeholder="' + placeholder + requiredSuffix +
                            '" value="Contact button" ' +
                            '/>' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'selection_list':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-select">' +
                            '<select id="' + name + '" name="' + name + '" requried = "' + required + '">' +
                            '<option value="" disabled selected>' + placeholder + '</option>';
                        options.forEach(function (option, j) {
                            outputCurrent += '<option value="' + option + '">' + option + '</option>';
                        });
                        outputCurrent += '</select>' + errorMsg + '</div>';
                        break;
                }

                formInputsOutput += outputCurrent;

            });

            $(parentElement).html(formInputsOutput);

            $('.tabChat').on('click', function () {
                $('#preChatForm').addClass('question__chat-tab_active');
                $('#preChatForm').removeClass('question__call-tab_active');
            });

            $('.tabPhone').on('click', function () {
                $('#preChatForm').addClass('question__call-tab_active');
                $('#preChatForm').removeClass('question__chat-tab_active');
            });
        }
    };
});

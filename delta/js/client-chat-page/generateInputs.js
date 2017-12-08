define(function (require, exports, module) {

    var previewMode = require('constructor/previewMode');

    return function (object, parentElement) {
        

        var formInputsOutput = '';
        if (object){
            object.forEach(function (item, i, arr) {
                var formFieldType = item.formFieldType,
                    placeholder = item.name,
                    name = item.name ? item.name.replace(/\s/g, '_').toLowerCase() : 'field_' + i,
                    required = item.required ? "true" : "false",
                    requiredSuffix = item.required ? '*' : '',
                    label = (typeof item.label !== 'undefined' && item.label != null) ? item.label + requiredSuffix : '',
                    errorMsg = item.required ? ' <div id="error-' + name + '" class="error-balloon">Please, fill</div>' : '',
                    options = item.options,
                    outputCurrent = '',
                    value = (previewMode && typeof SERVICE_PATTERN_CHAT_CONFIG[item.name] != 'undefined') ? SERVICE_PATTERN_CHAT_CONFIG[item.name] : '';
                    
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
                            '" placeholder="' + label +
                            '" value="" ' +
                            'required = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'phone':
                        outputCurrent = '' +
                            '<div class="field-wrapper field-phone_number">' +
                            '<input ' +
                            'class="agent-message"' +
                            'type="tel" ' +
                            'id="' + name +
                            '" name="' + name +
                            '" placeholder="' + label +
                            '" value="" ' +
                            'required = "' + required +
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
                            '" placeholder="' + label +
                            '" value="" ' +
                            'required = "' + required +
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
                            '" placeholder="' + label +
                            '" value="" ' +
                            '" required = "' + required +
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
                            '" placeholder="' + label +
                            '" value="' + value +
                            '" required = "' + required +
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
                            '" placeholder="' + label +
                            '" value="" ' +
                            'required = "' + required +
                            '" />' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'multiline_text':
                    	var rows = ((typeof options == 'object' && Array.isArray(options) && options.length == 1 )? options[0] : '');
                        outputCurrent = '' +
                            '<div class="field-wrapper field-multiline">' +
                            '<textarea ' +
                            'class="agent-message"' +
                            'id="' + name +
                            '" name="' + name +
                            '" placeholder="' + label +
                            (rows != '' ? '" rows="' + rows : '" height="80px' ) +                           
                            '" required="' + required +
                            '">' +
                            value +
                            '</textarea>' +
                            errorMsg +
                            '</div>';
                        break;

                    case 'numerical_range_slider':
                        var middleValue = Math.floor(((item.maxValue - item.minValue)/2)) + item.minValue;
                        outputCurrent = '' +
                            '<div class="field-wrapper field-range">' +
                            '<input oninput="$(this).siblings(\'.currentValue\').html($(this).val());"' +
                            'class=""' +
                            'type="range" ' +
                            'id="' + name +
                            '" name="' + name +
                            '" placeholder="' + label +
                            '" value="" ' +
                            'min="' + item.minValue +
                            '" max="' + item.maxValue +
                            '" required = "' + required +
                            '" />' +
                            '<div class="minValue">' + item.minValue + '</div>' +
                            '<div class="maxValue">' + item.maxValue + '</div>' +
                            '<div class="currentValue">' + middleValue + '</div>' +
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
                                '" required="' + required +
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

                        outputCurrent = '<div class="field-wrapper field-captcha"><label>Enter the text shown below: </label><div class="captcha_wrapper"><input type="text" required="true" id="captchaText" class="agent-message" /><table class="captcha">' + table.html() + '</table></div><div id="error-captcha" class="error-balloon">Incorrect code</div></div>';
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

            $('.radioStars input').on('change', function(){
                $(this).parent().attr('data-rated',$(this).val());
            })
        }
    }
});
define(function (require, exports, module) {

    var updateScrollbar = require('client-chat-page/updateScrollbar');
    var getConfObject = require('snippet/getConfObject');
    var getUrlVars = require('client-chat-page/getUrlVars');
    var generateInputs = require('client-chat-page/generateInputs');
    var getConf = require('getConf');


    $.support.cors = true;
    var conf = sessionStorage.getItem("confParams")
    var confObj = JSON.parse(conf);

    var variables = {
        cp: {},
        currentFormName: '',
        currentFormRequestId: '',
        currentForm: null,
        extChatData: {},
        forms: {

            MobileChatCustomerData: {
                html: '',

                onShow: function () {

                    window.parent.postMessage('sp-chat-init', '*');

                    $('#offline-form').css('display', 'block');
                    $('#agent-name').text(getConfObject().definition.preChat.title);

                    if (window.chatSession) {
                        window.chatSession.reassignUICallbacks({
                            onLogEvent: function (event) {
                                $.chatUI.appendLog(event);
                                updateScrollbar();
                            }
                        });
                    }
                },
                onHide: function () {
                    $('#offline-form').css('display', 'none');
                    $('#questionForm').css('display', 'none');
                },
                onSubmit: function () {
                }
            },

            find_agent_form: {
                html: '',
                onShow: function () {
                    window.chatSession.sessionStatus = 'queued';

                    window.parent.postMessage('sp-chat-drag', '*');

                    var conf = sessionStorage.getItem("confParams");
                    var confObj = JSON.parse(conf);
                    if(confObj.definition && confObj.definition.chatWidgetStyling){
                        $('#agent-name').text(confObj.definition.chatWidgetStyling.title);  
                    }
                    // $('#agent-name').text('Waiting for agent...');
                    // $('#agent-name').attr('title', $('#agent-name').text());

                    $('#chat-body').css('display', 'block');
                    $('#chat-body').removeClass('sp-readonly');

                    $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});

                    if (window.chatSession) {

                        window.chatSession.reassignUICallbacks({
                            onLogEvent: function (event) {
                                $.chatUI.appendLog(event);
                                updateScrollbar();

                                if (window.chatSession.internalParty) {
                                    var config = getConfObject();
                                    var conf = sessionStorage.getItem("confParams");
                                    var confObj = JSON.parse(conf);
                                    var target = getConf(conf, false);
                                    var snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];
                                    var src = snippetConfig.contactTab.iconUrl ? snippetConfig.contactTab.iconUrl : '';

                                    $('#agent-name').text(window.chatSession.internalParty.displayName);
                                    $('#agent-name').attr('title', $('#agent-name').text());
                                    var url = window.chatSession.getProfilePhotoUrl(window.chatSession.internalParty.id);
                                    if(confObj && confObj.definition && confObj.definition.chatWidgetStyling.showAgentPic == 'show'){
                                        $('.avatar-image').attr("style", "background-image:url('" + url + "')");
                                    }
                                    if(confObj && confObj.definition && confObj.definition.chatWidgetStyling.showAgentPic == 'always_default'){
                                        $('.avatar-image').attr('style', 'background-image:url(' + src + ')');
                                    }
                                    if(confObj && confObj.definition && confObj.definition.chatWidgetStyling.showAgentPic == 'none'){
                                        $('#header-avatar .avatar').hide();
                                    }
                                } else {
                                    var config = getConfObject();
                                    var conf = sessionStorage.getItem("confParams");
                                    var confObj = JSON.parse(conf);
                                    var target = getConf(conf, false);

                                    if(confObj.definition && confObj.definition.chatWidgetStyling){
                                        $('#agent-name').text(confObj.definition.chatWidgetStyling.title);  
                                    }

                                    if (typeof target.chatInitiation.widgetIndex !== 'undefined'){
                                        var snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];
                                        var src = snippetConfig.contactTab.iconUrl ? snippetConfig.contactTab.iconUrl : '';
                                        if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'show'){
                                            $('.avatar-image').attr('style', "background-image:url('" + src + "')");
                                        }
                                        if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'always_default'){
                                            $('.avatar-image').attr('style', "background-image:url('" + src + "')");
                                        }
                                        if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'none'){
                                            $('#header-avatar .avatar').hide();
                                        } 
                                    }
                                    
                                }
                            }
                        });
                    }
                },
                onHide: function () {
                    window.chatSession.sessionStatus = undefined;
                    $('#chat-body').css('display', 'none');
                },
                onSubmit: function () {
                }
            },

            start_form: {
                html: '',
                onShow: function () {

                    window.parent.postMessage('sp-chat-drag', '*');

                    $('#chat-body').css('display', 'block');
                    $('#chat-body').removeClass('sp-readonly');

                    $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});

                    if (window.chatSession) {
                        window.chatSession.reassignUICallbacks({
                            onLogEvent: function (event) {
                                $.chatUI.appendLog(event);
                                updateScrollbar();
                            }
                        });
                    }
                },
                onHide: function () {
                    $('#chat-body').css('display', 'none');
                },
                onSubmit: function () {
                }
            },

            connect_chat_form: {
                html: '',

                onShow: function () {
                    window.chatSession.sessionStatus = 'connected';
                    $('#chat-body').css('display', 'block');
                    $('#callme').css('display', (window.mozRTCPeerConnection || window.webkitRTCPeerConnection) ? 'inline-block' : 'none');
                    $('#callme').removeClass('hang-up');
                    if (getUrlVars(window.location.href)['togetherJS_enabled'] == 'true') {
                        $('#shareScreen').css('display', 'inline-block');
                    }
                    $('#endChat').css('display', 'block');
                    $('#chat-body').removeClass('sp-readonly');

                    $('#messages-div-inner').css('bottom', '0');
                    $('#messages-div-inner').css('top', 'auto');

                    $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});

                    window.parent.postMessage('sp-get-status-together', '*');

                    if (window.chatSession) {
                        if(confObj && confObj.definition && confObj.definition.chatWidgetStyling.webNotificationsEnabled == true){
                            window.parent.postMessage('sp-session-start', '*');//request web notifications 
                        }

                        window.chatSession.reassignUICallbacks({
                            onLogEvent: function (event) {
                                if (event.msg == '/ban') {
                                    var store = {
                                        action: 'sp-storage',
                                        key: 'bp-bc',
                                        value: '1'
                                    };
                                    window.parent.postMessage(JSON.stringify(store), '*');
                                    window.chatSession.disconnectSession();
                                    window.chatSession.endSession();
                                    return;
                                }

                                var event = $.chatUI.appendLog(event);
                                
                                var history = !window.chatSession.historyReceived || window.chatSession.historyRendered;
                                if (history && event.fromClass !== 'me' && event.fromClass !== 'sys') {
                                    var a = {
                                        action: 'sp-notification',
                                        photo: event.profilePhotoUrl,
                                        msg: event.originalMsg,
                                        name: event.fromName
                                    }
                                    window.parent.postMessage(JSON.stringify(a), '*');
                                }
                                
                                if (history && event.event && event.event == 'chat_session_secure_form_show') {
                                    var conf = sessionStorage.getItem("confParams"),
                                        confObj = JSON.parse(conf),
                                        index = -1;
                                        variables.currentFormRequestId = event.form_request_id;
                                    if(confObj){
                                        for(var key in confObj.definition.forms){
                                            if (confObj.definition.forms[key].id == event.form_id){
                                                index = key;
                                            }
                                        }
                                        var customFormConfig = confObj.definition.forms[index];
                                        if (customFormConfig.title) {
                                            $('#agent-name').html(customFormConfig.title);
                                        }

                                        generateInputs(customFormConfig.fields, '.customFormFields');
                                        $('#customForm').css('display', 'block');
                                        $('#customForm').addClass('secure');
                                        //$('.custom-form-fields').scrollTop(0);
                                        $('#customFormFields').scrollTop(0);
                                    }
                                }
                                if (window.chatSession.internalParty) {
                                    $('#agent-name').text(window.chatSession.internalParty.displayName);
                                    $('#agent-name').attr('title', $('#agent-name').text());
                                    var url = window.chatSession.getProfilePhotoUrl(window.chatSession.internalParty.id);
                                    var config = getConfObject();
                                    var conf = sessionStorage.getItem("confParams");
                                    var confObj = JSON.parse(conf);
                                    var target = getConf(conf, false);
                                    var snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];

                                    var src = snippetConfig.contactTab.iconUrl ? snippetConfig.contactTab.iconUrl : '';
                                    if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'show'){
                                        $('.avatar-image').attr('style', "background-image:url('" + url + "')");
                                    }
                                    if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'always_default'){
                                        $('.avatar-image').attr('style', 'background-image:url("' + src + '")');
                                    }
                                    if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'none'){
                                        $('#header-avatar .avatar').hide();
                                    }

 +                                  $('.avatar-image').attr('style', "background-image:url('" + url + "')");
                                }
                                updateScrollbar();
                            },
                            onSessionTyping: function (a) {
                                $('#agent-typing').css('display', 'block');
                                $('.agent-typing-wrapper').text(a.displayName + ' is typing');
                            },
                            onSessionNotTyping: function () {
                                $('#agent-typing').css('display', 'none');
                            },
                            onAddStream: function (src) {
                                var video = $('#video');
                                video.attr('src', src);
                                video.css('display', 'block');
                                $('#callme').addClass('hang-up');
                                $('#servicepattern-chat').css('top', '120px');
                                updateScrollbar();
                            }
                        });
                    }
                },
                onHide: function () {
                    window.chatSession.sessionStatus = undefined;
                    $('#endChat').css('display', 'none');
                    $('#chat-body').css('display', 'none');
                    $('#video').css('display', 'none');
                    $('#servicepattern-chat').css('top', '0');
                    $('#callme').css('display', 'none');
                    $('#shareScreen').css('display', 'none');
                    var config = getConfObject();
                    var conf = sessionStorage.getItem("confParams");
                    var confObj = JSON.parse(conf);
                    var target = getConf(conf, false);
                    var snippetConfig = confObj.definition.chatInitiations[target.chatInitiation.widgetIndex];

                    var src = snippetConfig.contactTab.iconUrl ? snippetConfig.contactTab.iconUrl : '';

                    if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'always_default'){
                        $('.avatar-image').attr('style', 'background-image:url("' + sessionStorage.getItem("logoUrl")+ '")');
                    }
                    if(confObj && confObj.definition.chatWidgetStyling.showAgentPic == 'none'){
                        $('#header-avatar .avatar').hide();
                    }
                    updateScrollbar();
                },
                onSubmit: function () {
                    this.submitForm();
                },
                submitForm: function () {
                    window.chatSession.sendFormData(variables.currentFormRequestId, variables.currentFormName, {});
                }
            },

            chat_unavailable_form: {
                html: '',
                onShow: function () {
                    variables.currentFormName = 'chat_unavailable_form';
                    window.chatSession.sessionStatus = undefined;
                    // window.parent.postMessage('sp-chat-init', '*');
                    $('#offline-form').css('display', 'block');
                    $('#unavailableForm').css('display', 'block');
                },
                onHide: function () {
                },
                onSubmit: function () {
                }
            },

            custom_form: {
                html: '',
                onShow: function (form_name) {
                    var conf = sessionStorage.getItem("confParams"),
                        confObj = JSON.parse(conf),
                        index = -1;
                    if(confObj){
                        for(var key in confObj.definition.forms){
                            if (confObj.definition.forms[key].name == form_name){
                                index = key;
                            }
                        }
                        if (index!=-1){
                            var customFormConfig = confObj.definition.forms[index];
                            if (customFormConfig && customFormConfig.title) {
                                $('#agent-name').html(customFormConfig.title);
                            }

                            generateInputs(customFormConfig.fields, '.customFormFields');
                            $('#offline-form').css('display', 'block');
                            $('#customForm').css('display', 'block');
                        }

                        else{
                            window.chatSession.sendFormData(variables.currentFormRequestId, form_name, 'Form not found');
                        }
                        
                    }
                },
                onHide: function (form_name) {
                },
                onSubmit: function (form_name) {
                }
            },

            survey_form: {
                html: '',
                onShow: function () {

                    window.parent.postMessage('sp-chat-init', '*');

                    $('#offline-form').css('display', 'block');
                    $('#surveyForm').css('display', 'block');

                    $('#agent-name').text('Please leave us a feedback');
                    $('#agent-name').attr('title', $('#agent-name').text());

                    $('#transcriptEmail').val(variables.extChatData.email);
                },
                onHide: function () {
                    $('#offline-form').css('display', 'none');
                    $('#surveyForm').css('display', 'none');
                },
                onSubmit: function () {
                },
                submitForm: function () {
                }
            },

            MobileChatSurvey: {
                html: '',
                onShow: function () {

                    window.parent.postMessage('sp-chat-init', '*');

                    $('#offline-form').css('display', 'block');
                    $('#surveyForm').css('display', 'block');

                    $('#agent-name').text('Please leave us a feedback');
                    $('#agent-name').attr('title', $('#agent-name').text());

                    $('#transcriptEmail').val(variables.extChatData.email);
                },
                onHide: function () {
                    $('#offline-form').css('display', 'none');
                    $('#surveyForm').css('display', 'none');
                },
                onSubmit: function () {
                },
                submitForm: function () {
                }
            }

        }
    };

    return variables;
});

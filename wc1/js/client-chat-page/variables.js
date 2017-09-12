define(function (require, exports, module) {

    var updateScrollbar = require('client-chat-page/updateScrollbar');
    var getConfObject = require('snippet/getConfObject');
    var getUrlVars = require('client-chat-page/getUrlVars');

    $.support.cors = true;

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

                    $('#agent-name').text('Waiting for agent...');
                    $('#agent-name').attr('title', $('#agent-name').text());

                    $('#chat-body').css('display', 'block');
                    $('#chat-body').removeClass('sp-readonly');

                    $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});

                    if (window.chatSession) {

                        window.chatSession.reassignUICallbacks({
                            onLogEvent: function (event) {
                                $.chatUI.appendLog(event);
                                updateScrollbar();

                                if (window.chatSession.internalParty) {
                                    $('#agent-name').text(window.chatSession.internalParty.displayName);
                                    $('#agent-name').attr('title', $('#agent-name').text());
                                    var url = window.chatSession.getProfilePhotoUrl(window.chatSession.internalParty.id);
                                    $('.avatar-image').attr('src', url);
                                } else {
                                    $('#agent-name').text('Waiting for agent...');
                                    $('#agent-name').attr('title', $('#agent-name').text());
                                    var config = getConfObject();
                                    var src = config.definition.chatWidgetStyling.logoUrl ? config.definition.chatWidgetStyling.logoUrl : 'images/logo-big.png';
                                    $('.avatar-image').attr('src', src);
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
                    // $('#callme').css('display', (window.mozRTCPeerConnection || window.webkitRTCPeerConnection) ? 'block' : 'none');
                    $('#callme').removeClass('hang-up');
                    if (getUrlVars(window.location.href)['togetherJS_enabled'] == 'true') {
                        $('#shareScreen').css('display', 'block');
                    }
                    $('#endChat').css('display', 'block');
                    $('#chat-body').removeClass('sp-readonly');

                    $('#agent-title').text('Consultant');

                    $('#messages-div-inner').css('bottom', '0');
                    $('#messages-div-inner').css('top', 'auto');

                    $('#messages-div-outer').perfectScrollbar({useBothWheelAxes: false});

                    window.parent.postMessage('sp-get-status-together', '*');

                    if (window.chatSession) {
                        var config = getConfObject();
                        if (config.definition.chatWidgetStyling.webNotificationsEnabled != 'false') {
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

                                if (window.chatSession.internalParty) {
                                    $('#agent-name').text(window.chatSession.internalParty.displayName);
                                    $('#agent-name').attr('title', $('#agent-name').text());
                                    var url = window.chatSession.getProfilePhotoUrl(window.chatSession.internalParty.id);
                                    $('.avatar-image').attr('src', url);
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
                    $('#agent-title').text("");
                    var config = getConfObject();
                    var src = config.definition.chatWidgetStyling.logoUrl ? config.definition.chatWidgetStyling.logoUrl : 'images/logo-big.png';
                    $('.avatar-image').attr('src', src);
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
                    window.chatSession.sessionStatus = undefined;
                    window.parent.postMessage('sp-chat-init', '*');

                    $('#agent-name').text('Send us a message');
                    $('#agent-name').attr('title', $('#agent-name').text());
                    $('#offline-form').css('display', 'block');
                    $('#unavailableForm').css('display', 'block');
                },
                onHide: function () {
                    $('#offline-form').css('display', 'none');
                    $('#unavailableForm').css('display', 'none');
                },
                onSubmit: function () {
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

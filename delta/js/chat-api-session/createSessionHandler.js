define(function (require, exports, module) {
    var printToConsole = require('chat-api-session/printToConsole');
    var sendXhr = require('chat-api-session/sendXhr');
    var handleHistoryEvents = require('chat-api-session/handleHistoryEvents');
    var startPoll = require('chat-api-session/startPoll');
    var helpers = require('chat-api-session/createSessionHandlerHelpers');
    var textFormId;

    return function (cp, r) {
        var o = {
            parties: {},
            displayName: "me",
            status: r.state,
            sessionId: r.chat_id,
            msgId: 1,
            cp: cp,
            handleEvent: function (msg) {
                printToConsole('Event received', msg);
                switch (msg.event) {
                    case 'chat_session_info':
                        o.serviceName = msg.service_name;
                        break;

                    case 'chat_session_status':
                        helpers.changeSessionState(o, msg.state);
                        break;

                    case 'chat_session_ended':
                        o.sessionEnded = true;
                        o.internalParty = undefined;
                        if (o.webRTC) {
                            o.webRTC.closeConnection();
                        }
                        msg.fromClass = 'sys';
                        msg.fromName = o.entryName;
                        o.uiCallbacks.onLogEvent(msg);
                        o.uiCallbacks.onSessionEnded();
                        break;

                    case 'chat_session_typing':
                        o.uiCallbacks.onSessionTyping(o.parties[msg.party_id]);
                        break;

                    case 'chat_session_form_show':
                        if (msg.form_name === '') {
                            textFormId = msg.form_request_id;
                        }
                        o.uiCallbacks.onFormShow(msg);
                        break;

                    case 'chat_session_secure_form_show':
                        o.uiCallbacks.onLogEvent(helpers.prepareLogEvent(o, msg));
                        break;

                    case 'chat_session_not_typing':
                        o.uiCallbacks.onSessionNotTyping(o.parties[msg.party_id]);
                        break;

                    case 'chat_session_party_joined':
                        var p = helpers.buildParty(o, msg);
                        helpers.detectParty(o);
                        o.uiCallbacks.onLogEvent(helpers.preparePartyLogEvent(o, msg, p));
                        var conf = JSON.parse(sessionStorage.getItem('confParams'));
                        if(conf && conf.definition && conf.definition.chatWidgetStyling){
                            var sound = new Audio(conf.definition.chatWidgetStyling.agentJoinSoundUrl);
                            if(sound){
                                sound.play();
                            }
                        }
                        break;

                    case 'chat_session_party_left':
                        var party = o.parties[msg.party_id];
                        delete o.parties[msg.party_id];
                        helpers.detectParty(o);
                        o.uiCallbacks.onLogEvent(helpers.preparePartyLogEvent(o, msg, party));
                        break;

                    case 'chat_session_message':
                        o.uiCallbacks.onLogEvent(helpers.prepareLogEvent(o, msg));
                        break;

                    case 'chat_session_file':
                        msg.party_id = msg.party_id || o.sessionId;
                        msg.fileUrl = o.cp.url + '/chats/' + o.sessionId + '/files/' + msg.file_id;
                        o.uiCallbacks.onLogEvent(helpers.prepareLogEvent(o, msg));
                        break;

                    case 'chat_session_timeout_warning':
                        o.uiCallbacks.onLogEvent(helpers.prepareLogEvent(o, msg));
                        break;

                    case 'chat_session_inactivity_timeout':
                        o.internalParty = undefined;
                        o.uiCallbacks.onLogEvent(helpers.prepareLogEvent(o, msg));
                        o.sessionEnded = true;
                        if (o.webRTC) {
                            o.webRTC.closeConnection();
                        }
                        o.sessionStatus = 'failed';
                        o.uiCallbacks.onSessionEnded();
                        break;

                    case 'chat_session_signaling':
                        helpers.handleSignaling(o, msg);
                        break;
                }
            },

            getProfilePhotoUrl: function (partyId) {
                return o.cp.url + '/chats/' + o.sessionId + '/profilephotos/' + partyId;
            },

            getHistory: function () {
                sessionStorage.removeItem('showForm');
                var historyEndpoint = 'chats/' + o.sessionId + '/history?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
                return sendXhr(cp, historyEndpoint, "GET").pipe(function (history) {
                    var offerRtc = handleHistoryEvents(history, o);
                    if (offerRtc) {
                        o.webRTCSignaling(offerRtc.party_id).requestCall(offerRtc.data.offerVideo);
                    }
                });
            },

            send: function (msg) {
                var m = {
                    event: 'chat_session_message',
                    party_id: o.sessionId,
                    msg: msg
                };
                o.uiCallbacks.onLogEvent(helpers.prepareLogEvent(o, m));

                if (textFormId) {
                    var data = {};
                    data.text = msg;
                    o.sendFormData(textFormId, "", data);
                    textFormId = undefined;
                }
                helpers.sendEvent(cp, o, {event: 'chat_session_message', msg: msg, msg_id: '' + o.msgId});
                o.msgId = o.msgId + 2;
            },

            sendLocation: function (latitude, longitude) {
                helpers.sendEvent(cp, o, {
                    event: 'chat_session_location',
                    latitude: latitude,
                    longitude: longitude,
                    msg_id: '' + o.msgId
                });
                o.msgId = o.msgId + 2;
            },

            sendNavigation: function (page, title) {
                helpers.sendEvent(cp, o, {
                    event: 'chat_session_navigation',
                    page: page,
                    title: title,
                    msg_id: '' + o.msgId
                });
                o.msgId = o.msgId + 2;
            },

            sendFormData: function (formRequestId, formName, formData) {
                var msg = {
                    event: 'chat_session_form_data',
                    form_request_id: formRequestId,
                    form_name: formName,
                    data: formData
                };
                printToConsole('Message sent', msg);
                helpers.sendEvent(cp, o, msg);
                o.uiCallbacks.onFormSent();
            },

            sendSecureFormData: function (formRequestId, formName, formData) {
                var msg = {
                    event: 'chat_session_secure_form_data',
                    form_request_id: formRequestId,
                    form_name: formName,
                    data: formData
                };
                printToConsole('Message sent', msg);
                helpers.sendEvent(cp, o, msg);
                o.uiCallbacks.onFormSent();
            },

            cancelSecureForm: function (formRequestId, formName) {
                var msg = {
                    event: 'chat_session_secure_form_cancel',
                    form_request_id: formRequestId,
                    form_name: formName
                };
                printToConsole('Message sent', msg);
                helpers.sendEvent(cp, o, msg);
                o.uiCallbacks.onFormSent();
            },

            sendTyping: function (message) {
                helpers.sendEvent(cp, o, {event: 'chat_session_typing', msg: message});
            },

            sendNotTyping: function () {
                helpers.sendEvent(cp, o, {event: 'chat_session_not_typing'});
            },

            endSession: function () {
                var msg = {event: 'chat_session_end'};
                printToConsole('end session', msg);
                if (o.webRTC) {
                    o.webRTC.closeConnection();
                }
                helpers.sendEvent(cp, o, msg);
                
            },

            disconnectSession: function () {
                var msg = {event: 'chat_session_disconnect'};

                printToConsole('Message sent', msg);

                if (o.webRTC) {
                    o.webRTC.closeConnection();
                }
                helpers.sendEvent(cp, o, msg);
            },

            fileUploaded: function (fileId, fileType, fileName) {
                var event = {
                    event: 'chat_session_file',
                    msg_id: '' + o.msgId,
                    file_id: fileId,
                    file_type: fileType,
                    file_name: fileName
                };
                helpers.sendEvent(cp, o, event);
                o.handleEvent(event);
                o.msgId = o.msgId + 2;
            },

            webRTCSignaling: function (party_id) {

                var requestCall = function (offerVideo) {
                    if (o.callPrompt) {
                        o.callPrompt.css("display", "block");
                    }
                    send({type: "REQUEST_CALL", offerVideo: offerVideo});
                };

                var endCall = function () {
                    send({type: "END_CALL"});
                };

                var answerCall = function (sdp) {
                    send({type: "ANSWER_CALL", sdp: sdp});
                };

                var offerCall = function (sdp) {
                    printToConsole("send offer");
                    send({type: "OFFER_CALL", sdp: sdp});
                };

                var sendIceCandidate = function (candidate) {
                    send({
                        type: "ICE_CANDIDATE",
                        candidate: candidate.candidate,
                        sdpMid: candidate.sdpMid,
                        sdpMLineIndex: candidate.sdpMLineIndex
                    });
                };

                var send = function (data) {
                    helpers.sendEvent(cp, o, {
                        event: 'chat_session_signaling',
                        msg_id: '' + o.msgId,
                        destination_party_id: party_id,
                        data: data
                    });
                    o.msgId = o.msgId + 2;
                };

                return {
                    requestCall: requestCall,
                    answerCall: answerCall,
                    offerCall: offerCall,
                    sendIceCandidate: sendIceCandidate,
                    endCall: endCall
                };
            },

            webRTCSession: function (remoteSdp, offerVideo, party_id) {
                window.PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
                window.IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
                window.SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
                window.navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

                var signaling = o.webRTCSignaling(party_id);

                var eh = function (err) {
                    printToConsole("Error", err);
                    if (o.callPrompt) {
                        o.callPrompt.css("display", "none");
                    }
                };

                var pc = new PeerConnection({iceServers: [
                        {
                            "url" : "stun:ocean03.brightpattern.com:20001", 
                            "username" : "turnserver", 
                            "credential" : "turnserverturnserver"
                        },
                        {
                            "url" : "stun:stun.l.google.com:19302"
                        },
                        {
                            "url" : "turn:ocean03.brightpattern.com:20001", 
                            "username" : "turnserver", 
                            "credential" : "turnserverturnserver"
                        },
                        {
                            "url" : "turn:ocean03.brightpattern.com:20001?transport=tcp", 
                            "username" : "turnserver", 
                            "credential" : "turnserverturnserver"
                        }
                    ]});
                pc.onicecandidate = function (event) {
                    printToConsole("onicecandidate %o", event);
                    if (!!event.candidate) {
                        signaling.sendIceCandidate(event.candidate);
                    }
                };
                pc.onaddstream = function (event) {
                    printToConsole('onaddstream', event);
                    o.uiCallbacks.onAddStream(URL.createObjectURL(event.stream));
                };

                var hasSDP = false;
                var iceCandidateList = [];

                var localStream;

                navigator.getUserMedia(
                    {audio: true, video: true},
                    function (stream) {
                        if (o.callPrompt) {
                            o.callPrompt.css("display", "none");
                        }
                        localStream = stream;
                        pc.addStream(stream);
                        o.uiCallbacks.onAddLocalStream(URL.createObjectURL(stream));
                        if (!remoteSdp) {
                            printToConsole("create offer");
                            pc.createOffer(function (data) {
                                pc.setLocalDescription(data, function () {
                                    hasSDP = true;
                                    signaling.offerCall(data.sdp);
                                }, eh);
                            }, eh);
                        } else {
                            printToConsole("createAnswer");
                            offerReceived(remoteSdp);
                            pc.createAnswer(function (data) {
                                pc.setLocalDescription(data, function () {
                                    hasSDP = true;
                                    iceCandidateList.forEach(function (e) {
                                        addIceCandidate(e);
                                    });
                                    signaling.answerCall(data.sdp);
                                }, eh);
                            }, eh);
                        }
                    }, eh);

                var answerReceived = function (sdp) {
                    printToConsole("answer received set remote description ");
                    pc.setRemoteDescription(new SessionDescription({type: "answer", sdp: sdp}), function () {
                        printToConsole('setRemoteDescription success');
                    }, eh);
                };

                var offerReceived = function (sdp) {
                    printToConsole("offerReceived set remote description");
                    pc.setRemoteDescription(new SessionDescription({type: "offer", sdp: sdp}), function () {
                        printToConsole('setRemoteDescription success');
                    }, eh);
                };

                var addIceCandidate = function (candidate) {
                    printToConsole("addIceCandidate", candidate);
                    if (hasSDP) {
                        pc.addIceCandidate(new IceCandidate(candidate), function () {
                            printToConsole('addIceCandidate success');
                        }, eh);
                    } else {
                        iceCandidateList.push(candidate);
                    }
                };

                var closeConnection = function () {
                    signaling.endCall();
                    try {
                        pc.close();
                    } catch (e) {

                    }
                    try {
                        localStream.stop();
                    } catch (e) {

                    }

                    pc = undefined;
                };

                o.webRTC = {
                    offerReceived: offerReceived,
                    answerReceived: answerReceived,
                    addIceCandidate: addIceCandidate,
                    closeConnection: closeConnection
                };

                return o.webRTC;
            },

            assignUICallbacks: function (a) {
                var cb = a || {};
                o.uiCallbacks = {};
                o.uiCallbacks.onChatQueued = cb.onChatQueued || helpers.noop;
                o.uiCallbacks.onChatConnected = cb.onChatConnected || helpers.noop;
                o.uiCallbacks.onSessionEnded = cb.onSessionEnded || helpers.noop;
                o.uiCallbacks.onLogEvent = cb.onLogEvent || helpers.noop;
                o.uiCallbacks.onSessionTyping = function (party) {
                    if (party && cb.onSessionTyping) cb.onSessionTyping(party);
                };
                o.uiCallbacks.onSessionNotTyping = function (party) {
                    if (party && cb.onSessionNotTyping) cb.onSessionNotTyping(party);
                };
                o.uiCallbacks.onFormShow = cb.onFormShow || helpers.noop;
                o.uiCallbacks.onFormSent = cb.onFormSent || helpers.noop;
                o.uiCallbacks.onAddStream = cb.onAddStream || helpers.noop;
                o.uiCallbacks.onAddLocalStream = cb.onAddLocalStream || helpers.noop;
            },

            reassignUICallbacks: function (a) {

                if (!o.uiCallbacks) {
                    o.assignUICallbacks(a);
                    return;
                }

                var cb = a || {};

                if (cb.onChatQueued) {
                    o.uiCallbacks.onChatQueued = cb.onChatQueued;
                }

                if (cb.onChatConnected) {
                    o.uiCallbacks.onChatConnected = cb.onChatConnected;
                }

                if (cb.onSessionEnded) {
                    o.uiCallbacks.onSessionEnded = cb.onSessionEnded;
                }

                if (cb.onLogEvent) {
                    o.uiCallbacks.onLogEvent = cb.onLogEvent;
                }

                if (cb.onSessionTyping) {
                    o.uiCallbacks.onSessionTyping = function (party) {
                        if (party) cb.onSessionTyping(party);
                    };
                }

                if (cb.onSessionNotTyping) {
                    o.uiCallbacks.onSessionNotTyping = function (party) {
                        if (party) cb.onSessionNotTyping(party);
                    };
                }

                if (cb.onFormShow) {
                    o.uiCallbacks.onFormShow = cb.onFormShow;
                }

                if (cb.onFormSent) {
                    o.uiCallbacks.onFormSent = cb.onFormSent;
                }

                if (cb.onAddStream) {
                    o.uiCallbacks.onAddStream = cb.onAddStream;
                }
            }
        };

        o.assignUICallbacks(null);

        startPoll(cp, o);

        return o;
    };
});

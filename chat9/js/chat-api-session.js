(function() {
    var $ = jQuery;
    var logging = false;

    if (typeof SERVICE_PATTERN_CHAT_CONFIG !== 'undefined')  {        
        if (typeof SERVICE_PATTERN_CHAT_CONFIG.$ !== 'undefined') {
            $ = SERVICE_PATTERN_CHAT_CONFIG.$;
        }
    }

    var prepareRequest = function(cp, endpoint, method) {
        var url = cp.url + '/' + endpoint + "&timestamp=" + (new Date().getTime());
        var xhrOptions = { type: method, url: url, headers: {Authorization: 'MOBILE-API-140-327-PLAIN appId="' + cp.appId + '", clientId="' + cp.clientId + '"' }};
        if (cp.crossDomain) {
            xhrOptions.crossDomain = true;
            xhrOptions.xhrFields = {withCredentials: true};
        }
        return xhrOptions;
    };

    var sendXhr = function(cp, endpoint, method, data) {
        var xhrOptions = prepareRequest(cp, endpoint, method);
        if (data) {
            if (data.toString() === '[object FormData]') {
                xhrOptions.data = data;
                xhrOptions.contentType = false;
                xhrOptions.processData = false;
            } else {
                xhrOptions.data = JSON.stringify(data);
                xhrOptions.contentType = 'application/json; charset=utf-8';
                xhrOptions.dataType = 'json';
        }
        }
        return $.ajax(xhrOptions);
    };
    
    
    var checkAvailability = function(cp) {
        var endpoint = 'availability?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, endpoint, 'GET');
    };
    
    var getActiveChats = function(cp) {
        var getActiveChatsEndpoint = 'chats/active?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, getActiveChatsEndpoint, 'GET');    
    };
        
    var getExpectedParameters = function(cp) {
        var getParametersEndpoint = 'parameters?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, getParametersEndpoint, 'GET');    
    };
        
    var uploadFiles = function(cp, formData) {
        var uploadFilesEndpoint = 'files?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, uploadFilesEndpoint, 'POST', formData);
    };

    var printToConsole = function(a, b) {
        if(logging) {
            if (typeof console !== 'undefined') {
                if(b !== 'undefined') {
                    console.log(a + " %o", b);
                } else {
                    console.log(a);
                }
            }
        }
    };

    var createSessionHandler = function(cp, r) {
        var o = {};
        o.parties = {};
        o.displayName = "me";
        o.status = r.state;
        o.sessionId = r.chat_id;
        o.msgId = 1;
        o.cp = cp;

        var sendEvent = function(event) {
            var endpoint = 'chats/' + o.sessionId + '/events?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
            return sendXhr(cp, endpoint, 'POST', {events:[event]});
        };

        var changeSessionState = function(state) {
            o.sessionStatus = state;
            switch(state) {
                case 'failed':
                    o.sessionEnded = true;
                    if(o.webRTC) {
                        o.webRTC.closeConnection();
                    }
                    o.uiCallbacks.onSessionEnded();
                    break;

                case 'queued':
                    o.uiCallbacks.onChatQueued();
                    break;

                case 'connected':
                    o.uiCallbacks.onChatConnected();
                    break;

            }
        };

        var handleSignaling = function(msg) {

            var type = msg.data.type;

            switch(type) {
                case 'OFFER_CALL':
                    o.webRTCSession(msg.data.sdp, msg.data.offerVideo, msg.party_id);
                    break;

                case 'ANSWER_CALL':
                    if(o.webRTC) {
                        o.webRTC.answerReceived(msg.data.sdp);
                    }
                    break;

                case 'ICE_CANDIDATE':
                    if(o.webRTC) {
                        o.webRTC.addIceCandidate(msg.data);
                    }
                    break;

                case 'END_CALL':
                    if(o.webRTC) {
                        o.webRTC.closeConnection();
                    }
                    break;

            }
        };

        var buildParty = function(msg) {
            var p = {
                id:             msg.party_id,
                type:           msg.type,
                firstName:      msg.first_name,
                lastName:       msg.last_name,
                displayName:    msg.display_name
            };

            o.parties[p.id] = p;
            return p;
        };

        var detectParty = function() {
            o.scenarioParty = undefined;
            o.internalParty = undefined;
            for (var prop in o.parties) {
                if( o.parties.hasOwnProperty( prop ) ) {
                    var p = o.parties[prop];
                    switch(p.type) {
                        case 'scenario':
                            o.scenarioParty = p;
                            break;

                        case 'internal':
                            o.internalParty = p;
                            break;
                    }
                }
            }
        };


        var prepareLogEvent = function(msg) {
            if (msg.party_id == o.sessionId) { // that's customer
                msg.fromClass = 'me';
                msg.fromName = o.displayName;
            } else {
                var party = o.parties[msg.party_id];
                msg.profilePhotoUrl = "images/logo-big-black.png";
                msg.fromName = '';
                if (party) {
                    switch (party.type) {
                        case 'scenario':
                            msg.fromClass = 'agent';
                            msg.fromName = party.displayName ? party.displayName : '';
                            break;
                        default:
                            msg.fromClass = 'agent';
                            msg.profilePhotoUrl = o.getProfilePhotoUrl(party.id);
                            msg.fromName = party.displayName ? party.displayName : 'Rep';
                    }
                }
            }
            return msg;
        };

        var preparePartyLogEvent = function(event, party) {
            event.fromClass = 'sys';
            if (party && party.type == 'internal') {
                event.fromName = party.displayName;
                event.profilePhotoUrl = o.getProfilePhotoUrl(party.id);
                return event;
            }
            return {fromClass : 'sys'};
        };
        
        o.handleEvent = function(msg) {
            printToConsole('Event received', msg);
            switch(msg.event) {

                case 'chat_session_info':
                    o.serviceName = msg.service_name;
                    break;

                case 'chat_session_status':
                    changeSessionState(msg.state);
                    break;

                case 'chat_session_ended':
                    o.sessionEnded = true;
                    o.internalParty = undefined;
                    if(o.webRTC) {
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
                    o.uiCallbacks.onFormShow(msg);
                    break;

                case 'chat_session_not_typing':
                    o.uiCallbacks.onSessionNotTyping(o.parties[msg.party_id]);
                    break;

                case 'chat_session_party_joined':
                    var p = buildParty(msg);
                    detectParty();
                    o.uiCallbacks.onLogEvent(preparePartyLogEvent(msg, p));
                    break;

                case 'chat_session_party_left':
                    var party = o.parties[msg.party_id];
                    delete o.parties[msg.party_id];
                    detectParty();
                    o.uiCallbacks.onLogEvent(preparePartyLogEvent(msg, party));
                    break;

                case 'chat_session_message':
                    o.uiCallbacks.onLogEvent(prepareLogEvent(msg));
                    break;

                case 'chat_session_file':
                    msg.party_id = msg.party_id || o.sessionId;
                    msg.fileUrl = o.cp.url + '/chats/' + o.sessionId + '/files/' + msg.file_id;
                    o.uiCallbacks.onLogEvent(prepareLogEvent(msg));
                break;

                case 'chat_session_timeout_warning':
                    o.uiCallbacks.onLogEvent(prepareLogEvent(msg));
                    break;

                case 'chat_session_inactivity_timeout':
                    o.internalParty = undefined;
                    o.uiCallbacks.onLogEvent(prepareLogEvent(msg));
                    o.sessionEnded = true;
                    if(o.webRTC) {
                        o.webRTC.closeConnection();
                    }
                    o.sessionStatus = 'failed';
                    o.uiCallbacks.onSessionEnded();
                    break;

                case 'chat_session_signaling':
                    handleSignaling(msg);
                    break;


            }
        };
        
        o.getProfilePhotoUrl = function(partyId) {
            return o.cp.url + '/chats/' + o.sessionId + '/profilephotos/' + partyId;
        };

        o.getHistory = function() {
            var historyEndpoint = 'chats/' + o.sessionId + '/history?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
            return sendXhr(cp, historyEndpoint, "GET").pipe(function(history) {
                var offerRtc = handleHistoryEvents(history, o);
                if(offerRtc) {
                    o.webRTCSignaling(offerRtc.party_id).requestCall(offerRtc.data.offerVideo);
                }
            });
        };
        
        o.send = function(msg) {
            var m = {
                event : 'chat_session_message',
                party_id: o.sessionId,
                msg: msg
            };
            o.uiCallbacks.onLogEvent(prepareLogEvent(m));
            sendEvent({event: 'chat_session_message', msg: msg, msg_id: '' + o.msgId});
            o.msgId = o.msgId + 2;
        };
        
        o.sendLocation = function(latitude, longitude) {
//            var m = {
//                event : 'chat_session_location',
//                party_id: o.sessionId,
//                msg: msg
//            };
//            o.uiCallbacks.onLogEvent(prepareLogEvent(m));
            sendEvent({event: 'chat_session_location', latitude: latitude, longitude: longitude, msg_id: '' + o.msgId});
            o.msgId = o.msgId + 2;
        };
        
        o.sendNavigation = function(page, title) {
            sendEvent({event: 'chat_session_navigation', page: page, title: title, msg_id: '' + o.msgId});
              o.msgId = o.msgId + 2;
        };

        o.sendFormData = function(formRequestId, formName, formData) {
            var msg = {event: 'chat_session_form_data', form_request_id: formRequestId, form_name: formName, data: formData};
            printToConsole('Message sent', msg);
            sendEvent(msg);
        };
        
        o.sendTyping = function() {
            sendEvent({event: 'chat_session_typing'});
        };
        
        o.sendNotTyping = function() {
            sendEvent({event: 'chat_session_not_typing'});
        };
        
        o.endSession = function() {
            window.sessionStorage.removeItem("chatConnected", true);
            var msg = {event: 'chat_session_end'};
            printToConsole('end session', msg);
            if(o.webRTC) {
                o.webRTC.closeConnection();
            }
            sendEvent(msg);
        };
        
        o.endSessionWithoutRedirect = function() {
            window.sessionStorage.removeItem("chatConnected", true);
            var msg = {event: 'chat_session_end'};
            printToConsole('end session', msg);
            if(o.webRTC) {
                o.webRTC.closeConnection();
            }
        };

        o.disconnectSession = function() {
            window.sessionStorage.removeItem("chatConnected", true);
            var msg = {event: 'chat_session_disconnect'};

            printToConsole('Message sent', msg);

            if(o.webRTC) {
                o.webRTC.closeConnection();
            }
        
            sendEvent(msg);
        };
                
        o.fileUploaded = function(fileId, fileType, fileName) {
            var event = {event: 'chat_session_file', msg_id: '' + o.msgId, file_id: fileId, file_type: fileType, file_name: fileName};
            sendEvent(event);
            o.handleEvent(event);
            o.msgId = o.msgId + 2;
        };

        o.webRTCSignaling = function(party_id) {

            var requestCall = function(offerVideo) {
                if(o.callPrompt) {
                    o.callPrompt.css("display", "block");
                }
                send({type: "REQUEST_CALL", offerVideo: offerVideo});
            };

            var requestPhoneCall = function(number) {
                send({type: "REQUEST_PHONE_CALL", number: number});
            };

            var requestSms = function(number) {
                send({type: "REQUEST_SMS", number: number});
            };

            var endCall = function() {
                send({type: "END_CALL"});
            };

            var answerCall = function(sdp) {
                send({type: "ANSWER_CALL", sdp: sdp});
            };

            var offerCall = function(sdp) {
                printToConsole("send offer");
                send({type: "OFFER_CALL", sdp: sdp});
            };

            var sendIceCandidate = function(candidate) {
                send({type: "ICE_CANDIDATE", candidate: candidate.candidate, sdpMid: candidate.sdpMid, sdpMLineIndex: candidate.sdpMLineIndex});
            };

            var send = function(data) {
                sendEvent({event: 'chat_session_signaling', msg_id: '' + o.msgId, destination_party_id: party_id, data: data});
                o.msgId = o.msgId + 2;
            };

            
            
            return {
                requestCall : requestCall,
                requestPhoneCall : requestPhoneCall,
                requestSms : requestSms,
                answerCall : answerCall,
                offerCall : offerCall,
                sendIceCandidate : sendIceCandidate,
                endCall : endCall
            };
        };

        o.webRTCSession = function(remoteSdp, offerVideo, party_id) {

            window.PeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
            window.IceCandidate = window.mozRTCIceCandidate || window.RTCIceCandidate;
            window.SessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
            window.navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;

            var signaling = o.webRTCSignaling(party_id);

            var eh = function (err) { printToConsole("Error", err);
                if(o.callPrompt) {
                    o.callPrompt.css("display", "none");
                }
            };

            var pc = new PeerConnection({iceServers : []});
            pc.onicecandidate = function(event) {
                printToConsole("onicecandidate %o", event);
                if(!!event.candidate) {
                    signaling.sendIceCandidate(event.candidate);
                }
            };
            pc.onaddstream =  function(event) {
                printToConsole('onaddstream', event);
                o.uiCallbacks.onAddStream(URL.createObjectURL(event.stream));
            };

            var hasSDP = false;
            var iceCandidateList = [];

            var localStream;

            navigator.getUserMedia(
                {audio:true, video:true},
                function(stream) {
                    if(o.callPrompt) {
                        o.callPrompt.css("display", "none");
                    }
                    localStream = stream;
                    pc.addStream(stream);
                    o.uiCallbacks.onAddLocalStream(URL.createObjectURL(stream));
                    if(!remoteSdp) {
                        printToConsole("create offer");
                        pc.createOffer(function (data) {
                            pc.setLocalDescription(data, function() {
                                hasSDP = true;
                                signaling.offerCall(data.sdp);
                            }, eh);
                        }, eh);
                    } else {
                        printToConsole("createAnswer");
                        offerReceived(remoteSdp);
                        pc.createAnswer(function (data) {
                            pc.setLocalDescription(data, function() {
                                hasSDP = true;
                                iceCandidateList.forEach(function(e) {
                                   addIceCandidate(e)
                                });
                                signaling.answerCall(data.sdp);
                            }, eh);
                        }, eh);
                    }
                }, eh);


            var answerReceived = function(sdp) {
                printToConsole("answer received set remote description ");
                pc.setRemoteDescription(new SessionDescription({type: "answer", sdp: sdp}), function(){
                    printToConsole('setRemoteDescription success');
                }, eh);
            };

            var offerReceived = function(sdp) {
                printToConsole("offerReceived set remote description");
                pc.setRemoteDescription(new SessionDescription({type: "offer", sdp: sdp}), function(){
                    printToConsole('setRemoteDescription success');
                }, eh);
            };

            var addIceCandidate = function(candidate) {
                printToConsole("addIceCandidate", candidate);
                if(hasSDP) {
                    pc.addIceCandidate(new IceCandidate(candidate), function() {
                        printToConsole('addIceCandidate success');
                    }, eh);
                } else {
                    iceCandidateList.push(candidate);
                }
            };

            var closeConnection = function() {
                signaling.endCall();
                try {
                    localStream.getAudioTracks().forEach(function(track) {
                        track.stop();
                    });

                    localStream.getVideoTracks().forEach(function(track) {
                        track.stop();
                    });
                    localStream.stop();
                } catch (e) {

                }
                try {
                    pc.close();
                } catch (e) {

                }

                localStream = undefined;
                pc = undefined;
            };

            o.webRTC = {
                offerReceived : offerReceived,
                answerReceived : answerReceived,
                addIceCandidate : addIceCandidate,
                closeConnection : closeConnection
            };

            return o.webRTC;
        };
        
        var noop = function() {};
        o.assignUICallbacks = function(a) {
            var cb  = a || {};
            o.uiCallbacks = {};
            o.uiCallbacks.onChatQueued = cb.onChatQueued || noop;
            o.uiCallbacks.onChatConnected = cb.onChatConnected || noop;
            o.uiCallbacks.onSessionEnded = cb.onSessionEnded || noop;
            o.uiCallbacks.onLogEvent = cb.onLogEvent || noop;
            o.uiCallbacks.onSessionTyping = function(party) { if (party && cb.onSessionTyping) cb.onSessionTyping(party); };
            o.uiCallbacks.onSessionNotTyping = function(party) { if (party && cb.onSessionNotTyping) cb.onSessionNotTyping(party); };
            o.uiCallbacks.onFormShow = cb.onFormShow || noop;
            o.uiCallbacks.onAddStream = cb.onAddStream || noop;
            o.uiCallbacks.onAddLocalStream = cb.onAddLocalStream || noop;
        };
        
        o.reassignUICallbacks = function(a) {
        
            if(!o.uiCallbacks)
            {
                o.assignUICallbacks(a);
                return;
            }
                
            var cb  = a || {};
    
            if(cb.onChatQueued)
                o.uiCallbacks.onChatQueued = cb.onChatQueued;
                
            if(cb.onChatConnected)
                o.uiCallbacks.onChatConnected = cb.onChatConnected;
                
            if(cb.onSessionEnded)
                o.uiCallbacks.onSessionEnded = cb.onSessionEnded;
                
            if(cb.onLogEvent)
                o.uiCallbacks.onLogEvent = cb.onLogEvent;
                
            if(cb.onSessionTyping)
                o.uiCallbacks.onSessionTyping = function(party) { if (party) cb.onSessionTyping(party); };
            
            if(cb.onSessionNotTyping)
                o.uiCallbacks.onSessionNotTyping = function(party) { if (party) cb.onSessionNotTyping(party); };
                
            if(cb.onFormShow)
                o.uiCallbacks.onFormShow = cb.onFormShow;
            if(cb.onAddStream)
                o.uiCallbacks.onAddStream = cb.onAddStream;
        };
        
        o.assignUICallbacks(null);
        
        
        startPoll(cp, o);
        
        return o;
    };

    var handleEvents = function(r, session) {
        if (r.events) {
            for (var i = 0, n = r.events.length; i < n; ++i) {
                session.handleEvent(r.events[i]);
            }
        }
    };

    var handleHistoryEvents = function(r, session) {
        var offerRtc = null;
        session.historyReceived = true;
        if (r.events) {
            for (var i = 0, n = r.events.length; i < n; ++i) {
                var event = r.events[i];
                if (event.event == 'chat_session_signaling') {
                    var type = event.data.type;
                    if(type == 'OFFER_CALL') {
                        offerRtc = event;
                    } else if(type == 'END_CALL') {
                        offerRtc = null;
                    }
                } else {
                    session.handleEvent(event);
                }
            }
        }
        session.historyRendered = true;
        return offerRtc;
    };
    
    var startPoll = function(cp, session) {
        var lastPollRequest = null;
        var poll = function() {
            var timeout = window.setTimeout(function() {
                if (lastPollRequest && !session.sessionEnded) {
                    lastPollRequest.abort();
                    lastPollRequest = null;
                }
                timeout = null;
                poll();
            }, 13000);
            var endpoint = 'chats/' + session.sessionId + '/events?tenantUrl=' + encodeURIComponent(cp.tenantUrl);

            lastPollRequest = sendXhr(cp, endpoint, 'GET');
            return lastPollRequest.done(function(r) {
                handleEvents(r, session);
                if (timeout) {
                    window.clearTimeout(timeout);
                    if (!session.sessionEnded) {
                        poll();
                    }
                }
            });
        };

        poll();
    };
    
    var createSession = function(cp) {
        logging = cp.parameters.logging;
        var endpoint = 'chats?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, endpoint, 'POST', {
            phone_number: cp.phone_number,
            from: cp.from,
            parameters: cp.parameters
        }).pipe(function(r) {
            r.session = createSessionHandler(cp, r);
            return r;
        });
    };

    var checkSessionExists = function(cp) {
        var historyEndpoint = 'chats/' + cp.sessionId + '/history?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
        return sendXhr(cp, historyEndpoint, "GET");
    };
    $.chat = {
        createSession: createSession,
        checkSessionExists: checkSessionExists,
        checkAvailability: checkAvailability,
        getActiveChats: getActiveChats,
        getExpectedParameters: getExpectedParameters,
        uploadFiles: uploadFiles
    }

})();

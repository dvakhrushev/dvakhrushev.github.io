define(function (require, exports, module) {
    var sendXhr = require('chat-api-session/sendXhr');

    var helpers = {
        sendEvent: function (cp, o, event) {
            var endpoint = 'chats/' + o.sessionId + '/events?tenantUrl=' + encodeURIComponent(cp.tenantUrl);
            return sendXhr(cp, endpoint, 'POST', {events: [event]});
        },

        changeSessionState: function (o, state) {
            o.sessionStatus = state;
            switch (state) {
                case 'failed':
                    o.sessionEnded = true;
                    if (o.webRTC) {
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
        },

        handleSignaling: function (o, msg) {
            var type = msg.data.type;

            switch (type) {
                case 'OFFER_CALL':
                    o.webRTCSession(msg.data.sdp, msg.data.offerVideo, msg.party_id);
                    break;

                case 'ANSWER_CALL':
                    if (o.webRTC) {
                        o.webRTC.answerReceived(msg.data.sdp);
                    }
                    break;

                case 'ICE_CANDIDATE':
                    if (o.webRTC) {
                        o.webRTC.addIceCandidate(msg.data);
                    }
                    break;

                case 'END_CALL':
                    if (o.webRTC) {
                        o.webRTC.closeConnection();
                    }
                    break;
            }
        },

        buildParty: function (o, msg) {
            var p = {
                id: msg.party_id,
                type: msg.type,
                firstName: msg.first_name,
                lastName: msg.last_name,
                displayName: msg.display_name
            };

            o.parties[p.id] = p;
            return p;
        },

        detectParty: function (o) {
            o.scenarioParty = undefined;
            o.internalParty = undefined;
            for (var prop in o.parties) {
                if (o.parties.hasOwnProperty(prop)) {
                    var p = o.parties[prop];
                    switch (p.type) {
                        case 'scenario':
                            o.scenarioParty = p;
                            break;

                        case 'internal':
                            o.internalParty = p;
                            break;
                    }
                }
            }
        },

        prepareLogEvent: function (o, msg) {
            if (msg.party_id === o.sessionId) { // that's customer
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
        },

        preparePartyLogEvent: function (o, event, party) {
            event.fromClass = 'sys';
            if (party && party.type === 'internal') {
                event.fromName = party.displayName;
                event.profilePhotoUrl = o.getProfilePhotoUrl(party.id);
                return event;
            }
            return {fromClass: 'sys'};
        },

        noop: function () {
        }
    };

    return helpers;
});

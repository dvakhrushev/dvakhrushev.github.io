define(function (require, exports, module) {
	var variables = require('snippet/variables');

	return (
		'<div id="preview">'+
			'<div class="chat-preview-content">'+
			    '<div id="sp-chat-widget">'+
			        '<div class="sp-chat-widget__content main-background-color contact-tab-border">'+
			            '<div id="sp-chat-label-icon"></div>'+
			            '<div id="sp-chat-label-text" class="base-font contact-tab-font second-color">text</div>'+
			        '</div>'+
			    '</div>'+
			    '<div class="proactive-offer base-font widget-border-radius">'+
			        '<div class="proactive-offer__body content-margin widget-background">'+
			            '<div class="proactive-offer__close close-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"><path clip-rule="evenodd" d="M14.318 15l-6.818-6.818-6.818 6.818-.682-.682 6.819-6.818-6.819-6.818.682-.682 6.818 6.818 6.818-6.818.682.682-6.818 6.818 6.818 6.818-.682.682z" /></svg></div>'+
			            '<div class="proactive-offer__content"></div>'+
			            '<div class="proactive-offer__button-wrapper">'+
			                '<button class="button-primary proactive-offer__button proactive-offer__button_type_chat main-background-color second-color"></button>'+
			                '<button class="button-primary proactive-offer__button proactive-offer__button_type_call main-background-color second-color"></button>'+
			            '</div>'+
			        '</div>'+
			    '</div>'+
			    '<div id="sp-chat-frame" class="">'+
			        '<div id="sp-drag-handle"></div>'+
			        '<div id="sp-side-bar">'+
			            '<div id="sp-close-frame" class="close-icon"></div>'+
			        '</div>'+
			        '<div id="sp-iframe-container">'+
			            '<div id="sp-chat-iframe2" class="widget-border widget-border-radius dialog-shadow">'+
			                '<div id="inner-chat" class="widget-border-radius base-font">'+
			                    '<div id="servicepatternsite-iframe-chat">'+
			                        '<div id="header-avatar" class="main-background-color">'+
			                            '<div id="header-avatar-container">'+
			                                '<div class="has-avatar">'+
			                                    '<div class="avatar">'+
			                                        '<img class="avatar-image" src="' + variables.SP.chatPath + 'images/logo-big.png">'+
			                                    '</div>'+
			                                    '<div class="info second-color title-font">'+
			                                        '<div id="agent-name" class="agent-name"></div>'+
			                                        '<div id="screen-title" class="screen-title"></div>'+
			                                        '<div id="agent-title" class="title"></div>'+
			                                    '</div>'+
			                                '</div>'+
			                            '</div>'+
			                            '<div class="clear"></div>'+
			                            '<div class="sound_player"></div>'+
			                            '<div id="callme" style="display: none;">'+
			                                '<div></div>'+
			                            '</div>'+
			                            '<div id="shareScreen" style="display: none;">'+
			                                '<div></div>'+
			                            '</div>'+
			                            '<div id="endChat" style="display: none;">'+
			                                '<div></div>'+
			                            '</div>'+
			                        '</div>'+
			                        '<form id="content-form" method="POST"></form>'+
			                        '<div id="offline-form">'+
			                            '<div id="offline-form-inner">'+
			                                '<div id="preChatForm" class="question__chat-tab_active agent-message">'+
			                                    '<div class="tabs">'+
			                                        '<div class="tab tab_active tabChat main-color widget-background"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="17"><path clip-rule="evenodd" d="M15.001 12.001h-3.601l-6.4 5v-5h-1c-.552 0-1-.447-1-1v-7c0-.552.448-1 1-1h11c.552 0 1 .448 1 1v7c.001.553-.447 1-.999 1zm-1-7h-9.001v5h2v3.391l3.827-3.391h3.174v-5zm-12.001 3.999h-1c-.552 0-1-.448-1-1v-7c0-.553.448-1 1-1h9c.552 0 1 .447 1 1v1h-9v7z" fill="none"/></svg>Chat</div>'+
			                                        '<div class="tab tabChat"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="17"><path clip-rule="evenodd" d="M15.001 12.001h-3.601l-6.4 5v-5h-1c-.552 0-1-.447-1-1v-7c0-.552.448-1 1-1h11c.552 0 1 .448 1 1v7c.001.553-.447 1-.999 1zm-1-7h-9.001v5h2v3.391l3.827-3.391h3.174v-5zm-12.001 3.999h-1c-.552 0-1-.448-1-1v-7c0-.553.448-1 1-1h9c.552 0 1 .447 1 1v1h-9v7z" fill="none"/></svg>Chat</div>'+

			                                        '<div class="tab tab_active tabPhone main-color widget-background"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"><path clip-rule="evenodd" d="M12.492 17c-.444 0-.883-.075-1.302-.224-5.191-1.836-9.303-6.056-11.001-11.289-.509-1.573.032-3.302 1.346-4.305l.838-.639c.465-.355 1.022-.543 1.609-.543 1 0 1.905.553 2.363 1.444l1.417 2.751c.134.262.206.555.206.848 0 .466-.174.912-.49 1.256l-.295.321c-.293.318-.357.791-.159 1.175.484.937 1.235 1.688 2.174 2.171.377.196.864.129 1.175-.157l.321-.295c.56-.514 1.432-.632 2.105-.285l2.754 1.415c.893.458 1.447 1.362 1.447 2.362 0 .701-.271 1.363-.768 1.865l-.958.969c-.728.738-1.742 1.16-2.782 1.16zm-8.51-15.407c-.235 0-.457.075-.642.216l-.838.639c-.777.594-1.097 1.618-.796 2.549 1.545 4.765 5.289 8.607 10.017 10.279.828.293 1.803.068 2.418-.555l.958-.97c.198-.201.308-.466.308-.745 0-.399-.223-.762-.58-.945l-2.754-1.415c-.111-.057-.246-.007-.299.041l-.321.295c-.793.728-2.025.895-2.983.4-1.235-.636-2.226-1.624-2.861-2.858-.503-.976-.342-2.173.4-2.981l.294-.32c.032-.035.07-.094.07-.179l-.029-.12-1.416-2.752c-.183-.358-.546-.579-.946-.579z" /></svg>Phone</div>'+
			                                        '<div class="tab tabPhone"><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17"><path clip-rule="evenodd" d="M12.492 17c-.444 0-.883-.075-1.302-.224-5.191-1.836-9.303-6.056-11.001-11.289-.509-1.573.032-3.302 1.346-4.305l.838-.639c.465-.355 1.022-.543 1.609-.543 1 0 1.905.553 2.363 1.444l1.417 2.751c.134.262.206.555.206.848 0 .466-.174.912-.49 1.256l-.295.321c-.293.318-.357.791-.159 1.175.484.937 1.235 1.688 2.174 2.171.377.196.864.129 1.175-.157l.321-.295c.56-.514 1.432-.632 2.105-.285l2.754 1.415c.893.458 1.447 1.362 1.447 2.362 0 .701-.271 1.363-.768 1.865l-.958.969c-.728.738-1.742 1.16-2.782 1.16zm-8.51-15.407c-.235 0-.457.075-.642.216l-.838.639c-.777.594-1.097 1.618-.796 2.549 1.545 4.765 5.289 8.607 10.017 10.279.828.293 1.803.068 2.418-.555l.958-.97c.198-.201.308-.466.308-.745 0-.399-.223-.762-.58-.945l-2.754-1.415c-.111-.057-.246-.007-.299.041l-.321.295c-.793.728-2.025.895-2.983.4-1.235-.636-2.226-1.624-2.861-2.858-.503-.976-.342-2.173.4-2.981l.294-.32c.032-.035.07-.094.07-.179l-.029-.12-1.416-2.752c-.183-.358-.546-.579-.946-.579z" /></svg>Phone</div>'+
			                                    '</div>'+
			                                    '<div class="questionFormInner ps-container widget-background">'+
			                                    	'<div class="fieldsWrapper">'+
				                                        '<div class="commonFields"></div>'+
				                                        '<div class="chatFields"></div>'+
				                                        '<div class="phoneFields"></div>'+
			                                        '</div>'+
			                                    '</div>'+
			                                    '<div class="prechat__action-buttons base-font">'+
		                                            '<input id="cancelPreChatForm" type="button" value="Cancel" class="button-primary cancel main-background-color second-color">'+
		                                            '<input id="submitChat" type="button" value="Call tab" class="button-primary accept main-background-color second-color">'+
		                                            '<input id="submitPhone" type="button" value="Phone tab" class="button-primary phone main-background-color second-color">'+
		                                        '</div>'+
			                                '</div>'+
			                                '<div id="unavailableForm">'+
			                                    '<div id="offline-form-fields" class="ps-container">'+
			                                        '<div class="offlineFields"></div>'+
			                                        '<div class="buttons">'+
			                                            '<div class="left-button">'+
			                                                '<a id="uncancel" class="servicepatternBtn cancel main-background-color second-color" href="#">Cancel</a>'+
			                                            '</div>'+
			                                            '<div>'+
			                                                '<input id="unsubmit" type="button" value="Send" class="servicepatternBtn main-background-color second-color">'+
			                                            '</div>'+
			                                        '</div>'+
			                                        '<div class="clear"></div>'+
			                                        '<div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;"><div class="ps-scrollbar-x" style="left: 0px; width: 0px;"></div></div><div class="ps-scrollbar-y-rail" style="top: 0px; right: 3px;"><div class="ps-scrollbar-y" style="top: 0px; height: 0px;"></div></div></div>'+
			                                '</div>'+
			                                '<div id="surveyForm" style="display: none;">'+
			                                    '<div class="field-wrapper serviceSurvey">'+
							                        '<div class="description">Did we provide the service you were looking for?</div>'+
							                        '<input type="radio" name="service" id="service-1" value="1" checked="checked">'+
							                        '<label for="service-1">yes</label>'+
							                        '<input type="radio" name="service" id="service-0" value="0">'+
							                        '<label for="service-0">no</label>'+
							                    '</div>'+
							                    '<div class="field-wrapper helpfulSurvey radioStars">'+
							                        '<div class="description">How helpful was our representative?</div>'+
							                        '<div class="stars">'+
							                            '<input type="radio" name="helpful" id="helpful-1" value="1"><label for="helpful-1"></label>'+
							                            '<input type="radio" name="helpful" id="helpful-2" value="2"><label for="helpful-2"></label>'+
							                            '<input type="radio" name="helpful" id="helpful-3" value="3"><label for="helpful-3"></label>'+
							                            '<input type="radio" name="helpful" id="helpful-4" value="4"><label for="helpful-4"></label>'+
							                            '<input type="radio" name="helpful" id="helpful-5" value="5"><label for="helpful-5"></label>'+
							                        '</div>'+
							                    '</div>'+
							                    '<div class="field-wrapper recommendSurvey radioStars">'+
							                        '<div class="description">How likely are you recommend our products and services in the future?</div>'+
							                        '<div class="stars">'+
							                            '<input type="radio" name="recommend" id="recommend-1" value="1"><label for="recommend-1"></label>'+
							                            '<input type="radio" name="recommend" id="recommend-2" value="2"><label for="recommend-2"></label>'+
							                            '<input type="radio" name="recommend" id="recommend-3" value="3"><label for="recommend-3"></label>'+
							                            '<input type="radio" name="recommend" id="recommend-4" value="4"><label for="recommend-4"></label>'+
							                            '<input type="radio" name="recommend" id="recommend-5" value="5"><label for="recommend-5"></label>'+
							                        '</div>'+
							                    '</div>'+
							                    '<div class="field-wrapper transcriptSurvey">'+
							                        '<input type="checkbox" name="transcript" id="transcript" value="1">'+
							                        '<label for="transcript" class="description small">Send me transcript of the chat by email?</label>'+
							                    '</div>'+
							                    '<div class="field-wrapper emailSurvey">'+
							                        '<div class="description">Your email*</div>'+
							                        '<input type="text" name="transcriptEmail" id="transcriptEmail"/>'+
							                    '</div>'+
							                    '<div class="buttons" style="margin-top: -10px;">'+
							                        '<div>'+
							                            '<input id="submitSurvey" type="button" value="Submit" class="servicepatternBtn main-background-color second-color">'+
							                        '</div>'+
							                    '</div>'+
			                                '</div>'+
			                            '</div>'+
			                        '</div>'+
			                        '<div id="chat-body" class="widget-background">'+
			                            '<div class="chat-body__content">'+
			                                '<video id="video" style="display: none; height: 100px; width: 100%" autoplay=""></video>'+
			                                '<div id="notification-prompt" style="display: none;" class="promptMessage">When'+
			                                    'prompted, please'+
			                                    'allow notifications from this window, so you could see responses when this window is'+
			                                    'hidden.'+
			                                '</div>'+
			                                '<div id="call-prompt" style="display: none;" class="promptMessage">When prompted, please'+
			                                    'allow'+
			                                    'access to your camera and microphone.'+
			                                '</div>'+
			                                '<div id="servicepattern-chat">'+
			                                    '<div id="scrollbar-container">'+
			                                        '<div id="messages-div" class="viewport">'+
			                                            '<div id="messages-div-outer" class="ps-container">'+
			                                                '<div id="messages-div-inner" class="overview messages-div-inner"'+
			                                                     'style="bottom: 0px; top: auto;">'+
			                                                    '<div class="new-msg-container agentMessage new-msg-animate agent-message">'+
			                                                        '<div class="pip agent-message base-font"></div>'+
			                                                        '<div class="new-msg-body agentMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text" style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner base-font">Please wait while we'+
			                                                                        'are'+
			                                                                        'looking for an available representative...'+
			                                                                    '</div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time">00:00</div>'+
			                                                    '</div>'+
			                                                    '<div id=""'+
			                                                         'class="new-msg-container agentMessage new-msg-animate agent-message">'+
			                                                        '<div class="new-msg-body agentMessage">'+
			                                                            '<div class="pip agent-message base-font"></div>'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner base-font">Representative found. Connecting...'+
			                                                                    '</div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time">00:00</div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container systemMessage new-msg-animate main-color">'+
			                                                        '<div class="new-msg-body systemMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner agentJoinedMessage"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path class="main-fill-color" d="M9.811 2.327l-4.023 4.056-.045.069c-.073.074-.159.126-.249.16l-.03.008-.159.031-.121-.002-.123-.024-.063-.02c-.085-.032-.165-.083-.233-.153l-1.265-1.273c-.27-.272-.27-.713 0-.985.271-.272.708-.272.978 0l.848.854 3.59-3.621c.247-.249.646-.249.895 0 .246.248.246.651 0 .9zm-4.848-.994c-2.01 0-3.64 1.642-3.64 3.667 0 2.026 1.63 3.667 3.64 3.667 1.828 0 3.337-1.358 3.596-3.127l1.303-1.312c.038.252.064.509.064.772 0 2.762-2.222 5-4.963 5s-4.963-2.238-4.963-5c0-2.761 2.222-5 4.963-5 .991 0 1.911.296 2.686.799l-.963.971c-.513-.278-1.1-.437-1.723-.437z"/></svg><span></span>'+
			                                                                    '</div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time"></div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container clientMessage new-msg-animate main-background-color">'+
			                                                        '<div class="pip main-background-color second-color"></div>'+
			                                                        '<div class="new-msg-body clientMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner second-color">User message</div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time">00:00</div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container agentMessage new-msg-animate agent-message">'+
			                                                        '<div class="pip agent-message base-font"></div>'+
			                                                        '<div class="new-msg-body agentMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="agentImage" style="background:url(' + variables.SP.chatPath + 'images/man-with-glasses.jpg) center center no-repeat/contain"></div>'+
			                                                                    '<div class="new-msg-text-inner base-font">Agent message</div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time">00:00</div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container systemMessage new-msg-animate main-color">'+
			                                                        '<div class="new-msg-body systemMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner inactivityWarningText"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path class="main-fill-color" d="M9.811 2.327l-4.023 4.056-.045.069c-.073.074-.159.126-.249.16l-.03.008-.159.031-.121-.002-.123-.024-.063-.02c-.085-.032-.165-.083-.233-.153l-1.265-1.273c-.27-.272-.27-.713 0-.985.271-.272.708-.272.978 0l.848.854 3.59-3.621c.247-.249.646-.249.895 0 .246.248.246.651 0 .9zm-4.848-.994c-2.01 0-3.64 1.642-3.64 3.667 0 2.026 1.63 3.667 3.64 3.667 1.828 0 3.337-1.358 3.596-3.127l1.303-1.312c.038.252.064.509.064.772 0 2.762-2.222 5-4.963 5s-4.963-2.238-4.963-5c0-2.761 2.222-5 4.963-5 .991 0 1.911.296 2.686.799l-.963.971c-.513-.278-1.1-.437-1.723-.437z"/></svg><span></span></div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time"></div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container systemMessage new-msg-animate main-color">'+
			                                                        '<div class="new-msg-body systemMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner inactivityTimeoutText"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path class="main-fill-color" d="M9.811 2.327l-4.023 4.056-.045.069c-.073.074-.159.126-.249.16l-.03.008-.159.031-.121-.002-.123-.024-.063-.02c-.085-.032-.165-.083-.233-.153l-1.265-1.273c-.27-.272-.27-.713 0-.985.271-.272.708-.272.978 0l.848.854 3.59-3.621c.247-.249.646-.249.895 0 .246.248.246.651 0 .9zm-4.848-.994c-2.01 0-3.64 1.642-3.64 3.667 0 2.026 1.63 3.667 3.64 3.667 1.828 0 3.337-1.358 3.596-3.127l1.303-1.312c.038.252.064.509.064.772 0 2.762-2.222 5-4.963 5s-4.963-2.238-4.963-5c0-2.761 2.222-5 4.963-5 .991 0 1.911.296 2.686.799l-.963.971c-.513-.278-1.1-.437-1.723-.437z"/></svg><span></span></div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time"></div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container systemMessage new-msg-animate main-color">'+
			                                                        '<div class="new-msg-body systemMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner agentLeftText"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path class="main-fill-color" d="M9.811 2.327l-4.023 4.056-.045.069c-.073.074-.159.126-.249.16l-.03.008-.159.031-.121-.002-.123-.024-.063-.02c-.085-.032-.165-.083-.233-.153l-1.265-1.273c-.27-.272-.27-.713 0-.985.271-.272.708-.272.978 0l.848.854 3.59-3.621c.247-.249.646-.249.895 0 .246.248.246.651 0 .9zm-4.848-.994c-2.01 0-3.64 1.642-3.64 3.667 0 2.026 1.63 3.667 3.64 3.667 1.828 0 3.337-1.358 3.596-3.127l1.303-1.312c.038.252.064.509.064.772 0 2.762-2.222 5-4.963 5s-4.963-2.238-4.963-5c0-2.761 2.222-5 4.963-5 .991 0 1.911.296 2.686.799l-.963.971c-.513-.278-1.1-.437-1.723-.437z"/></svg><span></span></div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time"></div>'+
			                                                    '</div>'+
			                                                    '<div class="new-msg-container systemMessage new-msg-animate main-color">'+
			                                                        '<div class="new-msg-body systemMessage">'+
			                                                            '<div class="new-msg-body-inner">'+
			                                                                '<div class="new-msg-text " style="height: auto;">'+
			                                                                    '<div class="new-msg-text-inner sessionEndedText"><svg xmlns="http://www.w3.org/2000/svg" width="10" height="10"><path class="main-fill-color" d="M9.811 2.327l-4.023 4.056-.045.069c-.073.074-.159.126-.249.16l-.03.008-.159.031-.121-.002-.123-.024-.063-.02c-.085-.032-.165-.083-.233-.153l-1.265-1.273c-.27-.272-.27-.713 0-.985.271-.272.708-.272.978 0l.848.854 3.59-3.621c.247-.249.646-.249.895 0 .246.248.246.651 0 .9zm-4.848-.994c-2.01 0-3.64 1.642-3.64 3.667 0 2.026 1.63 3.667 3.64 3.667 1.828 0 3.337-1.358 3.596-3.127l1.303-1.312c.038.252.064.509.064.772 0 2.762-2.222 5-4.963 5s-4.963-2.238-4.963-5c0-2.761 2.222-5 4.963-5 .991 0 1.911.296 2.686.799l-.963.971c-.513-.278-1.1-.437-1.723-.437z"/></svg><span></span></div>'+
			                                                                '</div>'+
			                                                            '</div>'+
			                                                        '</div>'+
			                                                        '<div class="new-time"></div>'+
			                                                    '</div>'+
			                                                    '<div id="messages-div-inner-clear"></div>'+
			                                                '</div>'+
			                                                '<div class="ps-scrollbar-x-rail" style="left: 0px; bottom: 3px;">'+
			                                                    '<div class="ps-scrollbar-x" style="left: 0px; width: 0px;"></div>'+
			                                                '</div>'+
			                                                '<div class="ps-scrollbar-y-rail" style="top: 0px; right: 0px;">'+
			                                                    '<div class="ps-scrollbar-y" style="top: 0px; height: 0px;"></div>'+
			                                                '</div>'+
			                                            '</div>'+
			                                            '<div id="agent-typing" style="display: none;">'+
			                                                '<div class="agent-typing-wrapper"></div>'+
			                                            '</div>'+
			                                        '</div>'+
			                                    '</div>'+
			                                '</div>'+
			                            '</div>'+
			                            '<div id="input-div" class="chat-body__input agent-message">'+
			                                '<div class="input-div-table">'+
			                                    '<div class="td-textarea">'+
			                                        '<textarea id="input-field" data-emojiable="true" rows="1" name="input-field" maxlength="1000" placeholder="Text..." autocomplete="off" style="resize: none;"></textarea>'+
			                                    '</div>'+
			                                    '<i class="emoji-picker-icon emoji-picker fa fa-smile-o" data-type="picker"></i>'+
			                                    '<div id="attachFile" class="preview"></div>'+
			                                    '<div class="td-button">'+
			                                        '<input id="input-button" type="button" value="Send" class="servicepatternBtn accept">'+
			                                    '</div>'+
			                                '</div>'+
			                            '</div>'+
			                        '</div>'+
			                    '</div>'+
			                    '<form name="file-upload-form" id="file-upload-form" target="_blank" method="post" enctype="multipart/form-data" style="display:none;"></form>'+
			                '</div>'+
			            '</div>'+
			        '</div>'+
			    '</div>'+
			'</div>'+
		'</div>'
	);

})
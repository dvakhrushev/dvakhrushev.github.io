define(function (require, exports, module) {

	var previewMode = require('constructor/previewMode');
	var compareUrl = require('compareUrl');

	return function(data, isIframe,debug){
		
		var conf = JSON.parse(data);
		var obj = (conf && conf.widget) ? conf.widget : conf;
		
		if(conf){
			if(previewMode){
				
				var output = {
					data: {},
					styles: conf.styles
				}

				var sourceId = conf.id,
					targetId = '',
					sourceSection = conf.section, 
					targetSection = '';
				
				switch(sourceSection) {
					case "chat_initiation":
						targetSection = obj.chatInitiations;
						for (var key in targetSection){
							targetId = targetSection[key].id;
							if (sourceId == targetId){
								output.index = key;
								output.data = targetSection[key];
							}
						} 
						break;

					case "proactive_offer":
						targetSection = obj.proactiveOffers;

						for (var key in targetSection){
							targetId = targetSection[key].id;
							if (sourceId == targetId){
								output.index = key;
								output.data = targetSection[key];
								output.data.widgetType = 'proactive_offer';
							}
						}
						break;

					case "chat_styling":
						output.data = obj.chatWidgetStyling;
						output.data.widgetType = 'chat_styling';
						
						chatInit = obj.chatInitiations[0];
						if(chatInit) {
							output.data.contactTab = chatInit.contactTab;
						}
						break;

					case "form":
						targetSection = obj.forms;

						for (var key in targetSection){
							targetId = targetSection[key].id;
							if (sourceId == targetId){
								output.index = key;
								output.data = targetSection[key];
								output.data.widgetType = 'form';
							}
						}
						break;

					case "on_page_form":
						targetSection = obj.onPageForms;

						for (var key in targetSection){
							targetId = targetSection[key].id;
							if (sourceId == targetId){
								output.index = key;
								output.data = targetSection[key];
								output.data.widgetType = 'onPageForm';
							}
						}
						break;
				}
				
			} else{

					var output = {},
						temporaryWeight = 0;
					if (conf.definition && conf.definition.chatInitiations){
						var chatInitiations = {
					    	data: conf.definition.chatInitiations,
					    	widgetIndex: -1,
					    	target: {}
					    } 
					}
					if (conf.definition && conf.definition.proactiveOffers){
					    var proactiveOffers = {
					    	data: conf.definition.proactiveOffers,
					    	widgetIndex: -1,
					    	target: {}
					    }
					}
					if (conf.definition && conf.definition.forms){
					    forms = {
					    	data: conf.definition.forms,
					    	widgetIndex: -1,
					    	target: {}
					    }
					}
				
				output['chatInitiation'] = (findUrls(chatInitiations, 'chatInitiation', isIframe, temporaryWeight));
				output['proactiveOffer'] = (findUrls(proactiveOffers, 'proactiveOffer', isIframe, temporaryWeight));
				output['form'] = (findUrls(forms, 'form', isIframe, temporaryWeight));
				
			}
		}

		return output;

	} 

	function findUrls (section, item, isIframe, weight){
		var widgetIndex = -1,
			result = {};
		
		if(section)	{
			for (let i=0; i< section.data.length; i++){
				
				for (let key in section.data[i].urls){
					var comparedUrl = section.data[i].urls[key];
					var compareResult = compareUrl(comparedUrl, isIframe)
					
					if(compareResult.check){
						if (compareResult.weight>weight){
							weight = compareResult.weight;
							result.widgetIndex = i;
							result.url = comparedUrl;
						}
					}
				}
			}
		}
		
		return result;			
	}

});
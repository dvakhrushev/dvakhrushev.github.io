define(function (require, exports, module) {
    var updateStyles = require('updateStyles');
    var previewMode = require('constructor/previewMode');
    var getConf = require('getConf');

    return function (config, styles) {
            
        updateStyles(config, styles);
        
        if(config && config.contactTab) {
            $('#sp-root-container').show();
            if(previewMode && config.widgetType == "chat_styling") {
            	$('#sp-chat-widget, #sp-chat-fake').removeAttr('class');
	            $('#sp-chat-widget, #sp-chat-fake').addClass('position_' + config.contactTab.location);
	            if (config.contactTab.location.indexOf('right_') !== -1 || config.contactTab.location.indexOf('left_') !== -1) {
	                $('#sp-chat-widget, #sp-chat-fake').addClass('vertical');
	            } else {
	                $('#sp-chat-widget, #sp-chat-fake').addClass('horizontal');
	            }
	            config.contactTab.location.split('_').forEach(function (item, i) {
	                $('#sp-chat-widget, #sp-chat-fake').addClass(item + "_" + i);
	            });	            
            } else {
	            $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').removeAttr('class');
	            $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass('position_' + config.contactTab.location);
	            if (config.contactTab.location.indexOf('right_') !== -1 || config.contactTab.location.indexOf('left_') !== -1) {
	                $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass('vertical');
	            } else {
	                $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass('horizontal');
	            }
	            config.contactTab.location.split('_').forEach(function (item, i) {
	                $('#sp-chat-widget, #sp-chat-fake, #sp-chat-frame').addClass(item + "_" + i);
	            });
	        }
            
            if (sessionStorage.getItem('serviceAvailable') == "true") {
                var text = config.contactTab.agentsAvailableMsg ? config.contactTab.agentsAvailableMsg : "";
                if(!previewMode){
                    $('.proactive-offer').attr('style','display:block');
                }
            } else {
                var text = config.contactTab.outOfHoursMsg ? config.contactTab.outOfHoursMsg : "";
            }
 
            var icon = config.contactTab.iconUrl || '';
            $('#sp-chat-label-text').text(text || '');
            if (icon.length == 0){
                $('#sp-chat-label-icon').addClass('collapse');
            } else{
                $('#sp-chat-label-icon').attr('style', 'background:url("'+icon+'") center center no-repeat');
            }
            



        } else {
            $('#sp-chat-widget').hide()
        }
        
    }; 
});

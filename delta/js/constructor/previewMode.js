define(function (require, exports, module) {

	var getUrlVars = require('client-chat-page/getUrlVars');

	if (getUrlVars(window.location.href).brightpattern == 'previewmode') {
        return true;
    }  else {
    	return false;
    } false;
    
});
define(function (require, exports, module) {
    var build = require('snippet/build');
	var previewMode = require('constructor/previewMode');
    var loadScripts = require('snippet/loadScripts');
	
    if(previewMode){

    	var preview = require('preview');
     	build(); 
     	
    } else {

		loadScripts([
		    'js/libraries/json2/json2.min.js',
		    'js/libraries/XDomainRequest/jQuery.XDomainRequest.min.js'
		], function () {
		    build();
		});

    }
  
}); 

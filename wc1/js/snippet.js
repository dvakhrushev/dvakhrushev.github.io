define(function (require, exports, module) {
    var build = require('snippet/build');
    var preview = require('preview');
    var loadScripts = require('snippet/loadScripts');

    loadScripts([
        'js/libraries/json2/json2.min.js',
        'js/libraries/XDomainRequest/jQuery.XDomainRequest.min.js'
    ], function () {
        build();
    });
}); 

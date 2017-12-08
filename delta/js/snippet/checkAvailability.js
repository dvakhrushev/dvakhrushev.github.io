define(function (require, exports, module) {
    var handleAvailability = require('snippet/handleAvailability');
    var getConf = require('getConf');
    var compareUrl = require('compareUrl');

    return function (needToHandleAvailability) {

        var cachedConfUrl = sessionStorage.getItem('cachedConfUrl');
            cachedConf = sessionStorage.getItem('confParams');

        if(cachedConfUrl && compareUrl(cachedConfUrl) && cachedConf){
            
            availabilityRequest();

        } else{

            var confUrl = SERVICE_PATTERN_CHAT_CONFIG.apiUrl + '/configuration?tenantUrl=' + encodeURIComponent(SERVICE_PATTERN_CHAT_CONFIG.tenantUrl);

            var confParams = {
                headers: {Authorization: 'MOBILE-API-140-327-PLAIN appId="' + SERVICE_PATTERN_CHAT_CONFIG.appId + '", clientId="' + SERVICE_PATTERN_CHAT_CONFIG.clientId + '"'},
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                type: 'GET',
                url: confUrl,
                crossDomain: true,
                withCredentials: true
            };

            return $.ajax(confParams).then(function (conf) {
              
                sessionStorage.setItem('confParams', JSON.stringify(conf));

                availabilityRequest();
                
            });

        }

        function availabilityRequest(){

            var url = SERVICE_PATTERN_CHAT_CONFIG.apiUrl + '/availability?tenantUrl=' + encodeURIComponent(SERVICE_PATTERN_CHAT_CONFIG.tenantUrl);

            var config = {
                headers: {Authorization: 'MOBILE-API-140-327-PLAIN appId="' + SERVICE_PATTERN_CHAT_CONFIG.appId + '", clientId="' + SERVICE_PATTERN_CHAT_CONFIG.clientId + '"'},
                contentType: 'application/json; charset=utf-8',
                dataType: 'json',
                type: 'GET',
                url: url,
                crossDomain: true,
                withCredentials: true
            };

            return $.ajax(config).then(function (e) {
                
                var available = e.chat === 'available';
                sessionStorage.setItem('serviceAvailable', available);
                needToHandleAvailability && handleAvailability(available);
                
            });

        }

    };
});

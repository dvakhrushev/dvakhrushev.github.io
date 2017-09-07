angular.module('app')
    .factory('StatsApi', ['$http', function($http){

        var HTTP_CFG = {
            timeout: 5000,
            withCredentials: true
        }
        var STATS_CFG = {
            host: "https://new.brightpattern.com"
            // host: "http://127.0.0.1:45162"
            //host: window.location.protocol + "//" + window.location.hostname
            //loginId: 'aaa',
            //tenantUrl: 'bbb'
        }

        return {

            authenticate: function(tenantUrl, username, password){
                STATS_CFG.tenantUrl = tenantUrl;
                STATS_CFG.loginId = username;
                return $http.post(STATS_CFG.host + '/statsapi/auth', {
                    tenant_url: STATS_CFG.tenantUrl,
                    username: STATS_CFG.loginId,
                    password: password
                }, HTTP_CFG);
            },

            logout: function(cfg){
                console.log('RESOURCE:', 'logout');
                return $http.delete(STATS_CFG.host + '/statsapi/auth', HTTP_CFG);
            },

            createSubscription: function(subscription){
                console.log('RESOURCE:', 'createSubscription');
                return $http.post(STATS_CFG.host + '/statsapi/subscription', subscription, HTTP_CFG);
            },

            deleteSubscription: function(cfg){
                console.log('RESOURCE:', 'deleteSubscription');
                return $http.delete(STATS_CFG.host + '/statsapi/subscription/active', HTTP_CFG);
            },

            getData: function(cfg){
                console.log('RESOURCE:', 'getData');
                return $http.get(STATS_CFG.host + '/statsapi/subscription/data', HTTP_CFG);
            },

            loadDispositions: function(cfg){
                console.log('RESOURCE:', 'loadDispositions');
                return $http.get(STATS_CFG.host + '/statsapi/cfg/dispositions', HTTP_CFG);
            },

            loadWallboards: function(cfg){
                console.log('RESOURCE:', 'loadWallboards');
                return $http.get(STATS_CFG.host + '/statsapi/cfg/wallboards', HTTP_CFG);
            },

            loadConfig: function(id){
                console.log('RESOURCE:', 'loadConfig');
                return $http.get(STATS_CFG.host + '/statsapi/cfg/wallboards/' + id, HTTP_CFG);
            },

            deleteWallboard: function(id){
                console.log('RESOURCE:', 'deleteWallboard');
                return $http.delete(STATS_CFG.host + '/statsapi/cfg/wallboards/' + id, HTTP_CFG);
            },

            createWallboard: function(wb){
                console.log('RESOURCE:', 'createWallboard');
                return $http.post(STATS_CFG.host + '/statsapi/cfg/wallboards', wb, HTTP_CFG);
            },

            updateWallboard: function(id,name,cfg){
                console.log('RESOURCE:', 'updateWallboard');
                return $http.put(STATS_CFG.host + '/statsapi/cfg/wallboards/' + id + '/'+ name, cfg, HTTP_CFG);
            }

        }
    }])

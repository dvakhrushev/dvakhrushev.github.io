/* ___PRODUCT_BUILD___ (___PRODUCT_COMMENTS___) ___PRODUCT_DATE___ */

var soundAlertTimer = null;
function myTimer() 
{
    var thissound = document.getElementById( "alert" );
    thissound.play();
}

angular.module('app', [])

.config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $injector, $rootScope) {
        return {
            //console.log(rejection.status);
            responseError: function(rejection) {
                if (rejection.status === 401 || rejection.status === 404 || rejection.status === 500) {
                    $rootScope.$broadcast('LoginRequired');
                    console.log('rejection status: ' + rejection.status);
                }
                return $q.reject(rejection);
            }
        };
    });
})

.directive('wbWidget', function(){
    return {
        restrict: 'EA',
        scope: {
            config: '=',
            data: '=',
            datasingle: '=',
            datagridagent: '=',
            datagridservice: '='
        },
        template: '<ng-include src="getTemplateUrl()"/>',
        
        controller: ['$scope', '$parse', '$filter', '$compile', 
        function($scope, $parse, $filter, $compile){

            var selectedStat;
            $scope.config.temptype = $scope.config.subscription.type;

            // IT'S A HACK !!! We select widget by name here 
            if($scope.config.title === 'Leaderboard'){ 
            //if($scope.config.type === 'grid'){

                $scope.dispositions = [];
                $scope.show_settings = false;

                $scope.$on('DispositionsArrived', function(ev, data){
                    var col = $scope.config.subscription.req.columns[2];
                    if(angular.equals(col.dispositions, [])){
                        col.dispositions = col.dispositions.concat(data);
                    }
                    function find(ar, v){
                        for(var i = 0; i < ar.length; i++){
                            if(ar[i] === v)
                                return true;
                        }
                        return false;
                    }
                    $scope.dispositions = data.map(function(v){
                        return {
                            name: v,
                            selected: find(col.dispositions, v)
                        }
                    })
                })

                $scope.updateDispositions = function(){
                    var r = []
                    $scope.dispositions.forEach(function(v){
                        if(v.selected){
                            r.push(v.name);
                        }
                    })
                    $scope.config.subscription.req.columns[2].dispositions = r;
                    $scope.$emit('RecreateSubscription');
                }

                $scope.showSettings = function(){
                    $scope.show_settings = true;
                    $scope.$emit('LoadDispositions');
                }

                $scope.applySettings = function(){
                    $scope.show_settings = false;
                    $scope.updateDispositions();
                }

                $scope.cancelSettings = function(){
                    $scope.show_settings = false;
                    //$scope.updateDispositions();
                }

                $scope.selectedDispositionsCount = function(){
                    var len = $filter('filter')($scope.dispositions, {selected: true}, true).length;
                    //console.log(len);
                    return len;
                }

                $scope.selectAll = function(){
                    $scope.dispositions.forEach(function(v){
                        v.selected = true;
                    })
                }

                $scope.unselectAll = function(){
                    $scope.dispositions.forEach(function(v){
                        v.selected = false;
                    })
                }
            }

            if($scope.config.subscription.type === 'stats_total'){

                if($scope.config.value != undefined) {
                    $scope.config.tempvalue = $scope.config.value;
                }
                if($scope.config.optValue != undefined){
                    $scope.config.tempvaluesec = $scope.config.subscription.req[1];
                }
                else $scope.config.tempvaluesec = "";
                $scope.config.tempvaluefilt = "sp_percent";
                

                $scope.updateDispositions = function(){
                    $scope.$emit('RecreateSubscription');
                }

                $scope.showSettings = function(){
                    $scope.show_settings = true;
                    $scope.$emit('LoadDispositions');
                }

                $scope.applySettings = function(){ 
                    
                    $scope.show_settings = false;
                    //console.log("Apply Settings Single");
                    if($scope.config.subscription.type == $scope.config.temptype){
                        console.log("Change Stats Single");
                        if($scope.config.tempvalue != "" && $scope.config.tempvalue != undefined){
                            console.log($scope.config.value);
                            $scope.config.value = $scope.config.tempvalue;
                            $scope.config.subscription.req[0] = $scope.config.tempvalue;
                            //$scope.getValue();
                            console.log($scope.config.value);
                        }
                        if($scope.config.tempvaluesec != "" && $scope.config.tempvaluesec != undefined){
                            if($scope.config.tempvaluefilt != "" && $scope.config.tempvaluefilt != undefined){
                                $scope.config.optValue = $scope.config.tempvaluesec + " | " + $scope.config.tempvaluefilt;
                            }else{
                                //$scope.config.optValue = $scope.config.tempvaluesec + " | sp_percent";
                            }
                            $scope.config.subscription.req[1] = $scope.config.tempvaluesec;
                        }
                    }else{
                        switch($scope.config.temptype){
                            case "stats_total":

                                break;
                            case "agent_grid":
                                $scope.config.type = "grid";
                                $scope.config.temptype = "agent_grid";
                                $scope.config.subscription.type = "agent_grid";
                                $scope.config.subscription.req = undefined;
                                $scope.config.subscription.req = {};
                                
                                $scope.config.subscription.req.id = $scope.config.id;
                                $scope.config.subscription.req.columns = [];
                                $scope.config.subscription.req.columns[0] = {};
                                $scope.config.subscription.req.columns[0].id = "1";
                                $scope.config.subscription.req.columns[0].statName = "firstname";
                                $scope.config.subscription.req.columns[1] = {};
                                $scope.config.subscription.req.columns[1].id = "2";
                                $scope.config.subscription.req.columns[1].statName = "lastname";
                                $scope.config.subscription.req.limit = 6;
                                $scope.config.subscription.req.order_by = "1";
                                $scope.config.subscription.req.order_dir = "DESC";
                                $scope.config.value = undefined;
                                $scope.config.tempvalue = undefined;
                                if($scope.config.optValue != "" && $scope.config.optValue != undefined){
                                    $scope.config.optValue = undefined;
                                    $scope.config.tempvaluesec = undefined;
                                }
                                $scope.config.tempvaluefilt = undefined;

                                break;
                            case "service_grid":
                                $scope.config.type = "grid";
                                $scope.config.temptype = "service_grid";
                                $scope.config.subscription.type = "service_grid";
                                $scope.config.subscription.req = undefined;
                                $scope.config.subscription.req = {};
                                
                                $scope.config.subscription.req.id = $scope.config.id;
                                $scope.config.subscription.req.columns = [];
                                $scope.config.subscription.req.columns[0] = {};
                                $scope.config.subscription.req.columns[0].id = "1";
                                $scope.config.subscription.req.columns[0].statName = "name";
                                $scope.config.subscription.req.columns[1] = {};
                                $scope.config.subscription.req.columns[1].id = "2";
                                $scope.config.subscription.req.columns[1].statName = "in_calls_waiting";
                                $scope.config.subscription.req.limit = 6;
                                $scope.config.subscription.req.order_by = "2";
                                $scope.config.subscription.req.order_dir = "DESC";
                                $scope.config.value = undefined;
                                $scope.config.tempvalue = undefined;
                                if($scope.config.optValue != "" && $scope.config.optValue != undefined){
                                    $scope.config.optValue = undefined;
                                    $scope.config.tempvaluesec = undefined;
                                }
                                $scope.config.tempvaluefilt = undefined;
                                break;
                            case "chat_messages":

                                break;
                            default:
                                break;
                        }
                        $scope.$emit('Rebuild');
                    }
                    
                    $scope.updateDispositions();
                }

                $scope.cancelSettings = function(){
                    $scope.show_settings = false;
                    //$scope.updateDispositions();
                }


            }

            if($scope.config.type === 'grid'){

                $scope.updateDispositions = function(){
                    $scope.$emit('RecreateSubscription');
                }

                $scope.showSettings = function(){
                    $scope.show_settings = true;
                    $scope.$emit('LoadDispositions');
                }

                

                $scope.applySettings = function(){
                    $scope.show_settings = false;
                    //console.log("Change Grid Stats!");
                    if($scope.config.subscription.type == $scope.config.temptype){

                    }else{
                        switch($scope.config.temptype){
                            case "stats_total":
                                //console.log("Change to Single Stats");
                                $scope.config.type = "single";
                                $scope.config.temptype = "stats_total";
                                $scope.config.subscription.type = "stats_total";
                                $scope.config.subscription.req = undefined;
                                $scope.config.subscription.req = [];
                                $scope.config.value = "in_calls_waiting";
                                $scope.config.subscription.req[0] = "in_calls_waiting";

                                break;
                            case "agent_grid":
                                if($scope.config.subscription.type == "agent_grid"){break;};
                                if($scope.config.subscription.type == "service_grid"){
                                    $scope.config.temptype = "agent_grid";
                                    $scope.config.subscription.type = "agent_grid";
                                    $scope.config.subscription.req = undefined;
                                    $scope.config.subscription.req = {};
                                    
                                    $scope.config.subscription.req.id = $scope.config.id;
                                    $scope.config.subscription.req.columns = [];
                                    $scope.config.subscription.req.columns[0] = {};
                                    $scope.config.subscription.req.columns[0].id = "1";
                                    $scope.config.subscription.req.columns[0].statName = "firstname";
                                    $scope.config.subscription.req.columns[1] = {};
                                    $scope.config.subscription.req.columns[1].id = "2";
                                    $scope.config.subscription.req.columns[1].statName = "lastname";
                                    $scope.config.subscription.req.limit = 6;
                                    $scope.config.subscription.req.order_by = "1";
                                    $scope.config.subscription.req.order_dir = "DESC";
                                    break;
                                }
                                break;
                            case "service_grid":
                                if($scope.config.subscription.type == "service_grid"){break;};
                                if($scope.config.subscription.type == "agent_grid"){
                                    $scope.config.type = "grid";
                                    $scope.config.temptype = "service_grid";
                                    $scope.config.subscription.type = "service_grid";
                                    $scope.config.subscription.req = undefined;
                                    $scope.config.subscription.req = {};
                                    
                                    $scope.config.subscription.req.id = $scope.config.id;
                                    $scope.config.subscription.req.columns = [];
                                    $scope.config.subscription.req.columns[0] = {};
                                    $scope.config.subscription.req.columns[0].id = "1";
                                    $scope.config.subscription.req.columns[0].statName = "name";
                                    $scope.config.subscription.req.columns[1] = {};
                                    $scope.config.subscription.req.columns[1].id = "2";
                                    $scope.config.subscription.req.columns[1].statName = "in_calls_waiting";
                                    $scope.config.subscription.req.limit = 6;
                                    $scope.config.subscription.req.order_by = "2";
                                    $scope.config.subscription.req.order_dir = "DESC";
                                    break;
                                };
                                break;
                            case "chat_messages":

                                break;
                            default:
                                break;
                        }
                        $scope.$emit('Rebuild');
                    }
                    $scope.updateDispositions();
                    
                }

                $scope.cancelSettings = function(){
                    $scope.show_settings = false;
                    //$scope.updateDispositions();
                }

                $scope.delCol = function(column){
                    //console.log("Delete "+ column.id +" column!");
                    var i = 1;
                    var index = $scope.config.subscription.req.columns.indexOf(column); 
                    $scope.config.subscription.req.columns.splice(index, 1);
                    $scope.config.subscription.req.columns.forEach(function(col){
                        col.id = i.toString();
                        i++;
                    })
                }

                $scope.addCol = function(){
                    console.log("Add column!");
                    //console.log($scope.config.subscription.req.columns);
                    var newCol = {};
                    var i = 1;
                    newCol.id = ($scope.config.subscription.req.columns.length + 1).toString(); 
                    if($scope.config.subscription.type == "agent_grid"){newCol.statName = "firstname";}
                    if($scope.config.subscription.type == "service_grid"){newCol.statName = "name";}
                    //console.log(newCol);
                    $scope.config.subscription.req.columns.push(newCol); 
                    $scope.config.subscription.req.columns.forEach(function(col){
                        col.id = i.toString();
                        i++;
                    })
                    newCol = null;
                    //console.log($scope.config.subscription.req.columns);
                }


            }

            $scope.isDataEmpty = function(){
                return angular.isUndefined($scope.data) || 
                    angular.equals($scope.data, []) || 
                    angular.equals($scope.data, {});
            }

            $scope.getTemplateUrl = function(){
                return 'partials/widgets/' + $scope.config.type + '.html';
            }
            
            $scope.getGridCellStyle = function(index, data, row, cell){
                index = parseInt(index);
                return {
                    'font-size': '' + (0.9 + 7 / (Math.max(data.length, row.length))) + 'vh',
                }
            }

            $scope.getNewsRowStyle = function(index, data, row){
                index = parseInt(index);
                return {
                    'font-size': '2.5vmin',
                }
            }

            $scope.getValue = function(){
                return $parse($scope.config.value)($scope.data);
            }

            $scope.getOptValue = function(){
                return $parse($scope.config.optValue)($scope.data);
            }
            
            $scope.getWidgetMode = function(){
                return $scope.config.mode;
            }
            
            
            
        }]
    }
})


.directive('wbLoginForm', function(){
    return {
        restrict: 'EA',
        scope: {},
        templateUrl: 'partials/login_form.html',
        
        controller: ['$scope', 'StatsApi', function($scope, StatsApi){

            $scope.show_login_form = false;
            if(localStorage.getItem('tenant_url') != null) {$scope.tenant_url = localStorage.getItem('tenant_url')};
            if(localStorage.getItem('username') != null) {$scope.username = localStorage.getItem('username')};

            $scope.$on('LoginRequired', function(){
                //console.log('LoginRequired');
                $scope.show_login_form = true;
            })

            $scope.onLogin = function(){
                StatsApi.authenticate(
                    $scope.tenant_url, 
                    $scope.username, 
                    $scope.password)
                    .then(function(){
                        localStorage.setItem('tenant_url', $scope.tenant_url);
                        localStorage.setItem('username', $scope.username);
                        $scope.show_login_form = false;
                        $scope.password = '';
                    }, function(){
                        console.warn('auth error');
                    });
            }

            $scope.isFormValid = function(){
                return angular.isDefined($scope.tenant_url) && $scope.tenant_url.length > 0 &&
                    angular.isDefined($scope.username) && $scope.username.length > 0 &&
                    angular.isDefined($scope.password) && $scope.password.length > 0;
            }
        }]
    }
})


.controller('AppController', ['$scope', '$http', '$timeout', '$parse', 'StatsApi', '$compile',/* remove $parse after refactoring !!! */

    function($scope, $http, $timeout, $parse, StatsApi, $compile){

    $scope.widgets = [];

    $scope.dataAllSingle = {
        in_calls_short_abandoned_in_queue_per_day: "In calls short abandoned per day",
        in_calls_short_abandoned_in_queue_ratio_per_day: "In calls abandoned ratio per day",
        in_calls_abandoned_in_queue_per_day: "In calls abandoned per day",
        in_calls_abandoned_in_queue_ratio_per_day: "In calls abandoned in queue ratio per day",
        in_max_wait_time: "In max wait time",
        in_calls_waiting: "In calls waiting",
        in_calls_queued_per_day: "In calls queued per day"
    };

    $scope.dataGridAgent = {
        firstname: "Firstname",
        lastname: "Lastname",
        active_item_talk_duration: "Active item talk duration",
        active_item_hold_duration: "Active item hold duration"//,
        //calls_dispositions_per_day: "Calls dispositions per day",
    };

    $scope.dataGridService = {
        name: "Name",
        in_calls_waiting: "In calls waiting",
        service_level_target: "Service level target",
        service_level_threshold_time: "Service level threshold time",
        service_level: "Service level"//,
        //calls_dispositions_per_day: "Calls dispositions per day",
    };

    $scope.getWidgetMode = function(widget){
        return widget.config.mode;
    }
    $scope.getWidgetStyle = function(index, widget){
        index = parseInt(index);
        var top = ~~(index / 3) * (100 / 3) + 0.5;
        var left = (index % 3) * (100 / 3) + 0.5;
        var style = {
            position: 'absolute',
            top: '' + top + '%',
            left: '' + left + '%'
        }
        // it's a hack!!!
       /* if(widget.config.type === 'news'){
            style.width = "66%";
        }*/
        return style;
    }

    var subscription = false;
    var SUBSCRIBE_DELAY = 5000;
    var GET_DATA_DELAY = 3000;

    $scope.$on('RecreateSubscription', function(){
        StatsApi.deleteSubscription().finally(function(){ // TODO: change to 'then' when server fix is ready
            subscription = false;
            createSubscription();
        });
    })

    $scope.$on('LoadDispositions', function(){
        StatsApi.loadDispositions()
            .then(function(response){
                $scope.$broadcast('DispositionsArrived', response.data);
            }, function(response){
                // error
            })
    })

    function createSubscription(){
        StatsApi.createSubscription(createSubscriptionRequest())
            .then(function(response){
                subscription = true;
                $scope.$on('$destroy', function(){
                    StatsApi.deleteSubscription();
                })
                getData();
            }, function(response){
                // error
                $timeout(createSubscription, SUBSCRIBE_DELAY);
            })
    }

    function createSubscriptionRequest(){
        var req = {
            data: {
                stats_totals: [],
                service_grids: [],
                agent_grids: [],
                chat_messages: {}
            }
        }

        $scope.widgets.forEach(function(w){

            if(w.config.subscription && w.config.subscription.type){

                if(w.config.subscription.type === 'stats_total'){
                    w.config.subscription.req.forEach(function(v){
                        if(req.data.stats_totals.indexOf(v) === -1){
                            req.data.stats_totals.push(v);
                        }
                    })

                } else if(w.config.subscription.type === 'agent_grid'){
                    req.data.agent_grids.push(w.config.subscription.req);

                } else if(w.config.subscription.type === 'service_grid'){
                    req.data.service_grids.push(w.config.subscription.req);
                
                } else if(w.config.subscription.type === 'chat_messages'){
                    req.data.chat_messages = w.config.subscription.req;
                }
            }
        })

        return req;
    }

    function getData(){
        StatsApi.getData()
            .then(function(response){
                try{
                    processData(response.data);
                    processAlerts();
                }catch(e){
                    console.error(e);
                }
                $timeout(getData, GET_DATA_DELAY);

            }, function(response){
                // error
                emptyData();
                subscription = false;
                //createSubscription();
                $scope.$emit('RecreateSubscription');
            })
    }

    function processData(data){
        $scope.widgets.forEach(function(w){


            if(w.config.subscription && w.config.subscription.type){

                if(w.config.subscription.type === 'stats_total'){
                    processStatsTotalData(w, data);

                } else if(w.config.subscription.type === 'agent_grid'){
                    processAgentGridData(w, data);

                } else if(w.config.subscription.type === 'service_grid'){
                    processServiceGridData(w, data);

                } else if(w.config.subscription.type === 'chat_messages'){
                    processChatMessagesData(w, data);
                }
            }
            
        })
    }


    function processAlerts(){
        $scope.widgets.forEach(function(w){

            if(w.config.subscription && w.config.subscription.type){
               if(w.config.alert!=null){


                  var value = $parse(w.config.value)(w.data);
                  var optValue = $parse(w.config.optValue)(w.data);
                  w.config.mode = ""; 

                  if ((w.config.alert.sound === "true") && eval(w.config.alert.sound_condition)){

                   		if (soundAlertTimer == null)
                   		{
                   			soundAlertTimer = setInterval(myTimer, 30000);
                   			myTimer();
                   		}

                   	}
                   	else if (soundAlertTimer != null)
                   	{
                   		clearInterval(soundAlertTimer);
                   	}


                   	if ((w.config.alert.blink === "true") && eval(w.config.alert.blink_condition)){
                   		w.config.mode = "alerted";            		
                   	}

                } 
            }
        })
    }

    function processStatsTotalData(widget, data){

/*        widget.dataAll = {
            in_calls_short_abandoned_in_queue_per_day: "In calls short abandoned per day",
            in_calls_short_abandoned_in_queue_ratio_per_day: "In calls abandoned ratio per day",
            in_calls_abandoned_in_queue_per_day: "In calls abandoned per day",
            in_calls_abandoned_in_queue_ratio_per_day: "In calls abandoned in queue ratio per day",
            in_max_wait_time: "In max wait time",
            in_calls_waiting: "In calls waiting",
            in_calls_queued_per_day: "In calls queued per day"
        };
*/
        widget.config.subscription.req.forEach(function(k){
            widget.data = widget.data || {};
            
            if(data.data && data.data.stats_totals){
                widget.data[k] = data.data.stats_totals[k];
                //console.log(widget.data[k]);
            }
        });
    }

    function processAgentGridData(widget, data){
    	if (data.data != null && data.data.agent_grids != null) {
    		processGridData(widget, data.data.agent_grids);
    	}
    }

    function processServiceGridData(widget, data){
    	if (data.data != null && data.data.service_grids != null) {
    		processGridData(widget, data.data.service_grids);
    	}
    }

    function processGridData(widget, data_grids){
        var req_id = widget.config.subscription.req.id;
        for(var i = 0; data_grids && i < data_grids.length; i++){
            if(data_grids[i].id === req_id){
                if(!angular.isDefined(widget.config.columns)){
                    widget.data = data_grids[i].values.map(function(obj){
                        return $.map(obj, function(prop){
                            //console.log(prop);
                            if(prop == null) {return "0";}
                            else return [prop];
                        })
                    })
                } else {
                    var view_columns = widget.config.columns;
                    widget.data = data_grids[i].values.map(function(obj){
                        return view_columns.map(function(exp){
                            var new_obj = {};
                            Object.keys(obj).map(function(k){
                                new_obj['item' + k] = obj[k];
                            })
                            return $parse(exp)(new_obj);
                        })
                    })
                }
                break;
            }
        }
    }

    function processChatMessagesData(widget, data){
        if(data.data && data.data.chat_messages){
            widget.data = data.data.chat_messages.map(function(v){
                return v.content;
            });
        } else {
            widget.data = [];
        }
    }

    function emptyData(){
        $scope.widgets.forEach(function(w){
            w.data = undefined;
        })
    }

    $scope.downloadConf = function(){
        var conf = {};
        conf.widgets = $scope.widgets;
        conf.widgets.forEach(function(w){
            w.data = undefined;
        });
        var json = angular.toJson(conf);
        var file = new File([json], "config.json", {type: "text/json;charset=utf-8"});
        saveAs(file);
    }

    $scope.$on('Rebuild', function(){
        //console.log("ChangeWidgetType!");
        var board = angular.element(document.querySelector(".board"));
        board.remove();

        var body = angular.element(document.querySelector(".board-ancer"));

        var newBoard = angular.element("<div ng-include=\"'partials/board.html'\"></div>");
        var compileFn = $compile(newBoard);
        compileFn($scope);

        body.after(newBoard);
        
        
    })

    function bootstrap(){
        $http.get('config.json').then(function(response){
            $scope.widgets = response.data.widgets;
            StatsApi.loadDispositions().then(function(response){
                $scope.$broadcast('DispositionsArrived', response.data);
                $scope.$emit('RecreateSubscription');
            }, function(response){
                // error
                console.error('Failed to load dispositions');
                $timeout(bootstrap, 5000);
            })
        }, function(response){
            // error
            console.error('Failed to load config.json');
        })
    }

    bootstrap();

}])

.filter('sp_duration', function(){
    return function(input){
        input = parseInt(input) || 0;
        var DAY = 60 * 60 * 24;
        var HOUR = 60 * 60;
        var MIN = 60;
        var days = Math.floor(input / DAY);
        input %= DAY;
        var hours = Math.floor(input / HOUR);
        input %= HOUR;
        var mins = Math.floor(input / MIN);
        var secs = input % MIN;
        function pad(n){ return n < 10 ? ('0' + n) : ('' + n) }
        var out = pad(mins) + ':' + pad(secs);
        if(hours || days){
            out = pad(hours) + ':' + out;
        }
        if(days){
            out = pad(days) + ', ' + out;
        }
        return out;
    }
})

.filter('sp_percent', ['$filter', function($filter){
    return function(input, decimals){
        decimals = decimals || 0;
        return $filter('number')(input * 100, decimals) + '%';
    }
}])


// Stats API
.factory('StatsApi', ['$http', function($http){

    var HTTP_CFG = {
        timeout: 5000,
        withCredentials: true
    }
    var STATS_CFG = {
        host: "https://new.brightpattern.com"
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

        createSubscription: function(subscription){
            return $http.post(STATS_CFG.host + '/statsapi/subscription', subscription, HTTP_CFG);
        },

        deleteSubscription: function(cfg){
            return $http.delete(STATS_CFG.host + '/statsapi/subscription/active', HTTP_CFG);
        },

        getData: function(cfg){
            return $http.get(STATS_CFG.host + '/statsapi/subscription/data', HTTP_CFG);
        },

        loadDispositions: function(cfg){
            return $http.get(STATS_CFG.host + '/statsapi/cfg/dispositions', HTTP_CFG);
        }

    }
}])








angular.module('app')
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

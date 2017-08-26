angular.module('app')
    .filter('sp_percent', ['$filter', function($filter){
        return function(input, decimals){
            decimals = decimals || 0;
            return $filter('number')(input * 100, decimals) + '%';
        }
    }])

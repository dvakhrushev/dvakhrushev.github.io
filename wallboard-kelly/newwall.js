/* ___PRODUCT_BUILD___ (___PRODUCT_COMMENTS___) ___PRODUCT_DATE___ */
//build RedFoxRus 2016

var soundAlertTimer = null;
function myTimer() 
{
    var thissound = document.getElementById( "alert" );
    thissound.play();
}

angular.module('app', ['ngDropdowns'])

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
});

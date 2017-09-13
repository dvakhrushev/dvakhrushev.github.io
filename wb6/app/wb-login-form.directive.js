angular.module('app')
    .directive('wbLoginForm', function(){
        return {
            restrict: 'EA',
            scope: {},
            templateUrl: 'partials/login_form.html',

            controller: ['$scope','$window','$location', 'StatsApi', function($scope, $window, $location, StatsApi){

                $scope.show_login_form = false;
                if(localStorage.getItem('tenant_url') != null) {
                  $scope.tenant_url = localStorage.getItem('tenant_url');
                } else {
                  $scope.tenant_url = $location.absUrl();
                }
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
                            $scope.$emit('RecreateSubscription');
                            $window.location.reload();
                        }, function(){
                            console.warn('auth error');
                        });
                }

                //style login form elements
                $scope.getLoginStyle = function(str){
                    style = {
                        'background-color':'white'
                    };
                    switch(str){
                        case 'url':
                            if(angular.isDefined($scope.tenant_url) && $scope.tenant_url.length > 0) style = {'background-color':'grey'}
                            else style = {'background-color':'white'};
                            break;
                        case 'use':
                            if(angular.isDefined($scope.username) && $scope.username.length > 0) style = {'background-color':'grey'}
                            else style = {'background-color':'white'};
                            break;
                        case 'pas':
                            if(angular.isDefined($scope.password) && $scope.password.length > 0) style = {'background-color':'grey'}
                            else style = {'background-color':'white'};
                            break;
                    };
                    return style;
                };

                $scope.isFormValid = function(){
                    return angular.isDefined($scope.tenant_url) && $scope.tenant_url.length > 0 &&
                        angular.isDefined($scope.username) && $scope.username.length > 0 &&
                        angular.isDefined($scope.password) && $scope.password.length > 0;
                }
            }]
        }
    })

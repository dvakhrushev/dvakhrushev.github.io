(function () {
    //config for resize widget
    var resizableConfig = {
        autoHide: true,
        distance: 5,
        //ghost: true,
        //grid: [ 82, 54 ],
        handles: "all",
        disabled: true
    };
    //config for drag widget
    var draggableConfig = {
        cursor: 'move',
        scroll: false,
        disabled: true
    };

    angular.module('app')
        .directive('changeTheme', function () {

            return {
                restrict: 'C',
                scope: {
                    wallboardId: '='
                },
                templateUrl: 'app/directives/change-theme/change-theme.html',

                controller: ['$scope', 'StyleApi', 'WallboardStorage',
                    function ($scope, StyleApi, WallboardStorage) {
                        $scope.changeTheme = function(themeId){
                            WallboardStorage.setTheme($scope.wallboardId, themeId);
                        };

                        $scope.dropTheme = function() {
                            document.getElementById("myDropdown").classList.toggle("show");
                        };
                    }
                ]
            };
        });
})();

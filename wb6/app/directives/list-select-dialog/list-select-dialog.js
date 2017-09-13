(function () {
    angular.module('app')
        .directive('listSelectDialog', function () {
            return {
                restrict: 'E',
                scope: {
                    dialogTitle: '@',
                    visibility:'=',
                    srcListLoader: '&',
                    dstList: '=',
                    onCancel: '&',
                    onOk: '&'
                },
                templateUrl: 'app/directives/list-select-dialog/list-select-dialog.html',
                link: function(scope, element, attr) {
                    scope.innerVisibility = false;
                    scope.$watch('visibility', function visibilityWatchAction(value) {
                        if (value) {
                            if (scope.innerVisibility == false) {
                                scope.toList = [];
                                toIds = {};
                                if (scope.dstList) {
                                    scope.dstList.forEach(function(item) {
                                        toIds[item] = true;
                                    });
                                }
                                scope.srcListLoader().then(function(response) {
                                    scope.fromList = response.data;
                                    scope.sortList(scope.fromList);
                                    for (i = scope.fromList.length - 1; i>= 0; i--) {
                                        if (scope.fromList[i].id in toIds) {
                                            scope.toList.push(scope.fromList[i]);
                                            scope.fromList.splice(i, 1);
                                        }
                                    }
                                    scope.toList.reverse();
                                }, function(response) {
                                    console.error("load list for " + scope.dialogTitle);
                                });
                                scope.innerVisibility = true;
                            }
                        } else {
                            scope.innerVisibility = false;
                        }
                    }, true);
                },
                controller: ['$scope',
                    function ($scope) {
                        $scope.toList = [{'id':1, 'name':'v1'},{'id':2, 'name':'v2'}];
                        $scope.ok = function() {
                            $scope.dstList = $scope.toList.map(function(item) {
                                return item.id;
                            });
                            $scope.onOk();
                        };
                        $scope.cancel = function(){
                            $scope.onCancel();
                        };

                        function move(elements, fromList, toList) {
                            ids = {};
                            elements.forEach(function(elem) {
                                ids[elem.id] = true;
                                toList.push(elem);
                            });
                            for (i = fromList.length - 1; i>= 0; i--) {
                                if (fromList[i].id in ids) {
                                    fromList.splice(i, 1);
                                }
                            }
                            $scope.sortList(toList);
                        };
                        $scope.moveTo = function() {
                            move($scope.fromSelected, $scope.fromList, $scope.toList);
                        };
                        $scope.moveFrom = function() {
                            move($scope.toSelected, $scope.toList, $scope.fromList);
                        };
                        $scope.moveToAll = function() {
                            move($scope.fromList, $scope.fromList, $scope.toList);
                        };
                        $scope.moveFromAll = function() {
                            move($scope.toList, $scope.toList, $scope.fromList);
                        };
                        $scope.sortList = function(list) {
                            list.sort(function (a, b) {
                                if (a.name > b.name) {
                                    return 1;
                                } else if (a.name < b.name) {
                                    return -1;
                                } else {
                                    return 0;
                                }
                            })
                        };
                    }
                ]
            };
        });
})();

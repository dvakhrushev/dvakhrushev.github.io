(function () {
    //config for resize widget
    var resizableConfig = {
        autoHide: true,
        distance: 5,
        ghost: true,
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
        .directive('wbWidget', function () {

            return {
                restrict: 'EA',
                scope: {
                    config: '=',
                    themeStyle: '=',
                    data: '=',
                    datasingle: '=',
                    datagridagent: '=',
                    datagridservice: '=',
                    editmode: '=',
                    addwidget: '=',
                    globalmode: '=',
                    callback: '&onResize',
                    calldrag: '&onDrag'
                },
                template: '<ng-include src="getTemplateUrl()"/>',

                //initial resize and drag events
                link: function postLink(scope, elem, attrs) {
                    scope.config.id === '1' && console.log('RENDER LINK', scope.config.id, scope);
                    if (scope.editmode) {
                        elem.resizable(Object.assign({}, resizableConfig, {disabled: false}));
                        elem.draggable(Object.assign({}, draggableConfig, {disabled: false}));
                    }
                    elem.on('resizestart', function (evt, ui) {
                        scope.$apply(function () {
                            if (scope.callback) {
                                scope.callback({
                                    $evt: evt,
                                    $ui: ui
                                });
                            }
                        });
                    });
                    elem.on('resizestop', function (evt, ui) {
                        scope.$apply(function () {
                            if (scope.callback) {
                                scope.callback({
                                    $evt: evt,
                                    $ui: ui
                                });
                            }
                        });
                    });
                    elem.on('dragstart', function (evt, ui) {
                        scope.$apply(function () {
                            if (scope.calldrag) {
                                scope.calldrag({
                                    $evt: evt,
                                    $ui: ui
                                });
                            }
                        });
                    });
                    elem.on('dragstop', function (evt, ui) {
                        scope.$apply(function () {
                            if (scope.calldrag) {
                                scope.calldrag({
                                    $evt: evt,
                                    $ui: ui
                                });
                            }
                        });
                    });
                },

                controller: ['$scope', '$parse', '$filter', '$compile', '$element',
                    function ($scope, $parse, $filter, $compile, $element) {
                        $scope.config.id === '1' && console.log('RENDER CONTROLLER', $scope.config.id, $scope);

                        var selectedStat;

                        if ($scope.config.subscription != undefined) {
                            $scope.config.temptype = $scope.config.subscription.type;
                        }

                        $scope.getWidgetHeaderStyle = function () {
                            return _.assign({},
                                $scope.themeStyle.WidgetHeaderHeight,
                                $scope.themeStyle.WidgetHeaderLine,
                                $scope.themeStyle.WidgetHeaderBackground
                            );
                        };

                        $scope.getWidgetHeaderTitleStyle = function () {
                            return _.assign({},
                                $scope.themeStyle.WidgetHeaderFont,
                                $scope.themeStyle.WidgetHeaderFontColor
                            );
                        };

                        //source code remainder

                        if ($scope.config.type === 'empty') {

                            $scope.show_add = "new";

                            $scope.addbut = "addbut glyphicon glyphicon-plus";

                            $scope.$on('offEditMode', function () {
                                turnOffEditMode($scope, $element);
                            });

                            $scope.$on('onEditMode', function () {
                                turnOnEditMode($scope, $element);
                            });

                            //add hover on "select widget" button
                            $scope.addHover = function () {
                                if ($scope.globalmode) return;
                                //$('#addbut'+$scope.config.id).attr("src","picture/full-screen_hover.png");
                                $('#addbut' + $scope.config.id + ' path').attr("fill", "#969696");
                            }

                            //remove hover
                            $scope.addNoHover = function () {
                                if ($scope.globalmode) return;
                                //$('#addbut'+$scope.config.id).attr("src","picture/full-screen.png");
                                $('#addbut' + $scope.config.id + ' path').attr("fill", "#D9D9D9");
                            }

                            //open widget select dialog
                            $scope.showSettings = function () {
                                if ($scope.globalmode) return;
                                $scope.show_settings = true;
                                turnOnEditMode($scope, $element);
                                $('.widget-select').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                $scope.$emit('onEditModeUp', 'add');
                                //$scope.$emit('LoadDispositions');
                            }

                            $scope.updateDispositions = function () {
                                $scope.$emit('RecreateSubscription');
                            }

                            //cancel widget select dialog
                            $scope.cancelSettings = function () {
                                $scope.show_settings = false;
                                //$scope.updateDispositions();
                            }

                            //select widget to add and apply default widget type config
                            $scope.selectWidgetType = function (type, w) {
                                $scope.show_settings = false;
                                if (w != undefined) {
                                    var tempId = $scope.config.id;
                                    var tempX = $scope.config.x;
                                    var tempY = $scope.config.y;
                                    var tempW = $scope.config.width;
                                    var tempH = $scope.config.height;
                                    $scope.config = w.config;
                                    $scope.config.id = tempId;
                                    $scope.config.x = tempX;
                                    $scope.config.y = tempY;
                                    $scope.config.width = tempW;
                                    $scope.config.height = tempH;
                                } else {
                                    switch (type) {
                                        case "stats_total":
                                            $scope.config.type = "single";
                                            $scope.config.temptype = "stats_total";
                                            $scope.config.title = "Total Interactions";
                                            $scope.config.subscription = {};
                                            $scope.config.subscription.type = "stats_total";
                                            $scope.config.subscription.req = [];
                                            $scope.config.value = "in_calls_waiting";
                                            $scope.config.subscription.req[0] = "in_calls_waiting";
                                            break;
                                        case "agent_grid":
                                            $scope.config.type = "grid";
                                            $scope.config.temptype = "agent_grid";
                                            $scope.config.title = "Long Calls";

                                            /*	                            //it's cheat, rewrite later
                                                                            $scope.config.columns = [];
                                                                            $scope.config.columns[0] = ["item1 + \" \" + item2"];
                                            */
                                            $scope.config.subscription = {};
                                            $scope.config.subscription.type = "agent_grid";
                                            $scope.config.subscription.req = {};

                                            $scope.config.subscription.req.id = $scope.config.id;
                                            $scope.config.subscription.req.columns = [];
                                            $scope.config.subscription.req.columns[0] = {};
                                            $scope.config.subscription.req.columns[0].id = "1";
                                            $scope.config.subscription.req.columns[0].statName = "name";
                                            /*
                                            $scope.config.subscription.req.columns[1] = {};
                                            $scope.config.subscription.req.columns[1].id = "2";
                                            $scope.config.subscription.req.columns[1].statName = "lastname";
                                            */
                                            $scope.config.subscription.req.limit = 6;
                                            //    $scope.config.subscription.req.order_by = "1";
                                            //    $scope.config.subscription.req.order_dir = "DESC";
                                            $scope.config.subscription.req.order = [];
                                            $scope.config.subscription.req.order[0] = {};
                                            $scope.config.subscription.req.order[0].by = "1";
                                            $scope.config.subscription.req.order[0].dir = "DESC";
                                            $scope.config.subscription.req.columns[0].dir = "DESC";
                                            break;
                                        case "service_grid":
                                            $scope.config.type = "grid";
                                            $scope.config.temptype = "service_grid";
                                            $scope.config.title = "Queued Interactions";
                                            $scope.config.subscription = {};
                                            $scope.config.subscription.type = "service_grid";
                                            $scope.config.subscription.req = {};

                                            $scope.config.subscription.req.id = $scope.config.id;
                                            $scope.config.subscription.req.columns = [];
                                            $scope.config.subscription.req.columns[0] = {};
                                            $scope.config.subscription.req.columns[0].id = "1";
                                            $scope.config.subscription.req.columns[0].statName = "name";
                                            $scope.config.subscription.req.columns[1] = {};
                                            $scope.config.subscription.req.columns[1].id = "2";
                                            $scope.config.subscription.req.columns[1].statName = "service_level_threshold_time";
                                            $scope.config.subscription.req.columns[2] = {};
                                            $scope.config.subscription.req.columns[2].id = "3";
                                            $scope.config.subscription.req.columns[2].statName = "service_level_target";
                                            $scope.config.subscription.req.limit = 6;
                                            //    $scope.config.subscription.req.order_by = "2";
                                            //    $scope.config.subscription.req.order_dir = "DESC";
                                            $scope.config.subscription.req.order = [];
                                            $scope.config.subscription.req.order[0] = {};
                                            $scope.config.subscription.req.order[0].by = "2";
                                            $scope.config.subscription.req.order[0].dir = "DESC";
                                            $scope.config.subscription.req.columns[1].dir = "DESC";
                                            break;
                                        case "news":
                                            $scope.config.type = "news";
                                            $scope.config.title = "Daily Updates";
                                            $scope.config.subscription = {};
                                            $scope.config.subscription.type = "chat_messages";
                                            $scope.config.subscription.req = {};
                                            $scope.config.subscription.req.filter = "";
                                            $scope.config.subscription.req.limit = 6;
                                            $scope.data = [];
                                            break;
                                        case "summary":
                                            $scope.config.type = "summary";
                                            $scope.config.title = "Agent State Summary";
                                            $scope.config.subscription = {};
                                            $scope.config.subscription.type = "summary";
                                            $scope.data = [];
                                            break;
                                        case "gauge":
                                            $scope.config.type = "gauge";
                                            $scope.config.title = "Gauge";
                                            $scope.config.subscription = {};
                                            $scope.config.subscription.type = "gauge";
                                            $scope.data = [];
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                $scope.$emit('Rebuild', $scope.config);
                                $scope.updateDispositions();
                            }
                        }

                        if ($scope.config.type === 'single') {

                            if ($scope.config.value != undefined) {
                                $scope.config.tempvalue = $scope.config.value;
                            }
                            if ($scope.config.optValue != undefined) {
                                $scope.config.tempvaluesec = $scope.config.subscription.req[1];
                            }
                            else $scope.config.tempvaluesec = "";
                            $scope.config.tempvaluefilt = "sp_percent";

                            if ($scope.editmode) {
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            }
                            else {
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            }

                            $scope.$on('offEditMode', function () {
                                turnOffEditMode($scope, $element);
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            });

                            $scope.$on('onEditMode', function () {
                                turnOnEditMode($scope, $element);
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            });

                            $scope.updateDispositions = function () {
                                $scope.$emit('RecreateSubscription');
                            }

                            //open widget settins dialog
                            $scope.showSettings = function () {
                                if ($scope.globalmode) return;
                                $scope.show_settings = true;
                                turnOnEditMode($scope, $element);
                                $('.widget-settings').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                $scope.$emit('onEditModeUp');
                                $scope.$emit('LoadDispositions');
                            }

                            //open options dialog
                            $scope.openOptions = function () {
                                $scope.show_options = true;
                                $('.widget-options').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                            }

                            //close options dialog
                            $scope.closeOptions = function () {
                                $scope.show_options = false;
                            }

                            //apply widget settings
                            $scope.applySettings = function () {

                                $scope.show_settings = false;

                                if ($scope.config.tempvalue != "" && $scope.config.tempvalue != undefined) {
                                    $scope.config.value = $scope.config.tempvalue;
                                    $scope.config.subscription.req[0] = $scope.config.tempvalue;
                                    //$scope.getValue();
                                }
                                if ($scope.config.tempvaluesec != "" && $scope.config.tempvaluesec != undefined) {
                                    if($scope.config.tempvaluesec.includes('ratio')){
                                            $scope.config.optValue = $scope.config.tempvaluesec + " | " + "sp_percent";
                                    } else if($scope.config.tempvaluesec.includes('time') || $scope.config.tempvaluesec.includes('duration')){
                                            $scope.config.optValue = $scope.config.tempvaluesec + " | " + "sp_duration";
                                    } else {
                                      $scope.config.optValue = $scope.config.tempvaluesec;
                                    }
                                    $scope.config.subscription.req[1] = $scope.config.tempvaluesec;
                                }

                                $scope.updateDispositions();
                            }

                            //cancel widget settings
                            $scope.cancelSettings = function () {
                                $scope.show_settings = false;
                                $scope.$emit('cancelEditModeUp');
                                //$scope.updateDispositions();
                            }

                            $scope.getWidgetBodyMainFont = function () {
                                return _.assign({},
                                    $scope.themeStyle.WidgetBodyMainFont
                                );
                            };

                            $scope.getWidgetBodySecondFont = function () {
                                return _.assign({},
                                    $scope.themeStyle.WidgetBodySecondFont
                                );
                            };

                        }

                        if ($scope.config.type === 'grid') {
                            $scope.config.coltitle = [];
                            $scope.state_icon = false;

                            $scope.arrCircle = [
                                "picture/Green.png",
                                "picture/Green.png",
                                "picture/Red.png",
                                "picture/Red.png",
                                "picture/Grey.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png",
                                "picture/Blue.png"
                            ];

                            if ($scope.editmode) {
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            }
                            else {
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            }

                            $scope.$on('offEditMode', function () {
                                turnOffEditMode($scope, $element);
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            });

                            $scope.$on('onEditMode', function () {
                                turnOnEditMode($scope, $element);
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            });

                            //detect state icon column and save ID
                            $scope.config.subscription.req.columns.forEach(function (col) {
                                if (col.statName == "state_ic") {
                                    $scope.state_icon = true;
                                    $scope.icon_col_id = col.id;
                                }
                            });

                            // size and color state icon
                            $scope.getCircleStyle = function (index, data, row) {
                                if (row[$scope.icon_col_id - 1] == "ready") {
                                    $scope.arrCircle[index] = "picture/Green.png";
                                }
                                ;
                                if (row[$scope.icon_col_id - 1] == "not_ready") {
                                    $scope.arrCircle[index] = "picture/Grey.png";
                                }
                                ;
                                if (row[$scope.icon_col_id - 1] == "busy") {
                                    $scope.arrCircle[index] = "picture/Blue.png";
                                }
                                ;
                                if (row[$scope.icon_col_id - 1] == "0" || row[$scope.icon_col_id - 1] == "") {
                                    $scope.arrCircle[index] = "picture/Trans.png";
                                }
                                ;
                                if (row[$scope.icon_col_id - 1] == "after_call_work") {
                                    $scope.arrCircle[index] = "picture/Red.png";
                                }
                                ;

                                return {
                                    'width': '12px',
                                    'height': '12px'
                                }
                            }

                            $scope.updateDispositions = function () {
                                $scope.$emit('RecreateSubscription');
                            }

                            //open widget settins dialog
                            $scope.showSettings = function () {
                                if ($scope.globalmode) return;
                                $scope.show_settings = true;
                                turnOnEditMode($scope, $element);
                                $('.widget-settings').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                $scope.$emit('onEditModeUp');
                                $scope.$emit('LoadDispositions');
                            }

                            //sort by ID
                            function compareID(a, b) {
                                return parseInt(a.id) - parseInt(b.id);
                            }

                            //change ID and sort & replace row in table settings
                            $scope.changeID = function (column) {
                                var indexCol = $scope.config.subscription.req.columns.indexOf(column);
                                var indexStart = 0;
                                var indexStop = 0;

                                if (column.id != "" && column.id >= 0 && column.id < 100) {
                                    indexStart = $scope.config.subscription.req.columns.findIndex(function (obj) {
                                        return obj.id == column.id
                                    });

                                    for (var j = $scope.config.subscription.req.columns.length - 1; j > 0; j--) {
                                        if ($scope.config.subscription.req.columns[j].id == column.id) {
                                            indexStop = j;
                                            break;
                                        }
                                    }

                                    if (indexCol > indexStart) {
                                        for (var i = indexStart; i < indexCol; i++) {
                                            $scope.config.subscription.req.columns[i].id = parseInt($scope.config.subscription.req.columns[i].id) + 1;
                                        }
                                    }

                                    if (indexCol < indexStop) {
                                        for (var i = indexStop; i > indexCol; i--) {
                                            $scope.config.subscription.req.columns[i].id = parseInt($scope.config.subscription.req.columns[i].id) - 1;
                                        }
                                    }

                                    $scope.config.subscription.req.columns.sort(compareID);

                                }
                            }

                            // sort options switch
                            // need rebuild to normal function use
                            $scope.fChangeSort = function (column, str) {
                                var indexCol = $scope.config.subscription.req.columns.indexOf(column);
                                var findFlag = false;
                                var findIndexEmpt = -1;
                                var tempOrder = {};
                                if (str == 'empt') {
                                    $scope.config.subscription.req.columns[indexCol].dir = "DESC";
                                    if ($scope.config.subscription.req.order != undefined) {
                                        $scope.config.subscription.req.order.forEach(function (ord) {
                                            if (ord.by == column.id) {
                                                ord.dir = "DESC";
                                                findFlag = true;
                                            }
                                        });
                                        if (!findFlag) {
                                            tempOrder.by = column.id;
                                            tempOrder.dir = "DESC";
                                            $scope.config.subscription.req.order.push(tempOrder);
                                        }

                                    } else {
                                        $scope.config.subscription.req.order = [];
                                        $scope.config.subscription.req.order[0] = {};
                                        $scope.config.subscription.req.order[0].by = column.id;
                                        $scope.config.subscription.req.order[0].dir = "DESC";
                                    }
                                }
                                if (str == 'des') {
                                    $scope.config.subscription.req.columns[indexCol].dir = "ASC";
                                    if ($scope.config.subscription.req.order != undefined) {
                                        $scope.config.subscription.req.order.forEach(function (ord) {
                                            if (ord.by == column.id) {
                                                ord.dir = "ASC";
                                                findFlag = true;
                                            }
                                        });
                                        if (!findFlag) {
                                            tempOrder.by = column.id;
                                            tempOrder.dir = "DESC";
                                            $scope.config.subscription.req.order.push(tempOrder);
                                        }
                                    } else {
                                        $scope.config.subscription.req.order = [];
                                        $scope.config.subscription.req.order[0] = {};
                                        $scope.config.subscription.req.order[0].by = column.id;
                                        $scope.config.subscription.req.order[0].dir = "ASC";
                                    }
                                }
                                if (str == 'as') {
                                    $scope.config.subscription.req.columns[indexCol].dir = undefined;
                                    if ($scope.config.subscription.req.order != undefined) {
                                        $scope.config.subscription.req.order.forEach(function (ord, i) {
                                            if (ord.by == column.id) {
                                                ord.dir = undefined;
                                                findIndexEmpt = i;
                                            }
                                        });
                                        $scope.config.subscription.req.order.splice(findIndexEmpt, 1);
                                    }
                                }
                            }

                            // apply widget settings
                            $scope.applySettings = function () {
                                $scope.show_settings = false;
                                //$scope.$emit('Rebuild');
                                $scope.updateDispositions();
                            }

                            // input column title
                            $scope.fInputTitle = function (col) {

                            }

                            // select state icon statistic
                            $scope.fChangeStat = function (col) {
                                if (col.statName == "state_ic") {
                                    //$scope.config.subscription.req.columns[$scope.config.subscription.req.columns.indexOf(col)].statName = "state";
                                    $scope.state_icon = true;
                                    $scope.icon_col_id = col.id;
                                }
                            }

                            //cancel widget settings
                            $scope.cancelSettings = function () {
                                $scope.show_settings = false;
                                $scope.$emit('cancelEditModeUp');
                                //$scope.updateDispositions();
                            }

                            //delete stat column
                            $scope.delCol = function (column) {
                                var i = 1;
                                var index = $scope.config.subscription.req.columns.indexOf(column);
                                $scope.config.subscription.req.columns.splice(index, 1);
                                $scope.config.subscription.req.columns.forEach(function (col) {
                                    col.id = i.toString();
                                    i++;
                                })
                            }

                            // add stat column
                            $scope.addCol = function (str) {
                                var newCol = {};
                                var i = 1;
                                newCol.id = ($scope.config.subscription.req.columns.length + 1).toString();
                                if ($scope.config.subscription.type == "agent_grid") {
                                    newCol.statName = "name";
                                }
                                if ($scope.config.subscription.type == "service_grid") {
                                    newCol.statName = "name";
                                }
                                $scope.config.subscription.req.columns.push(newCol);
                                $scope.config.subscription.req.columns.forEach(function (col) {
                                    col.id = i.toString();
                                    i++;
                                })
                                newCol = null;

                                //scroll down to added column
                                $('.widget-content').animate({
                                    scrollTop: $("#" + str).offset().top
                                }, 2000);
                            }

                            //open state dialog
                            $scope.onStateDial = function () {
                                $scope.show_statesdial = true;
                                $('.widget-statesdial').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                //$scope.updateDispositions();
                            }

                            // ok state dialog
                            $scope.okState = function () {
                                $scope.show_statesdial = false;
                                //$scope.updateDispositions();
                            }

                            // cancel state dialog
                            $scope.cancelState = function () {
                                $scope.show_statesdial = false;
                                //$scope.updateDispositions();
                            }

                            // open team dialog
                            $scope.onTeamsDial = function () {
                                $scope.show_teamsdial = true;
                                $('.widget-teamsdial').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                //$scope.updateDispositions();
                            }

                            // ok team dialog
                            $scope.okTeams = function () {
                                $scope.show_teamsdial = false;
                                //$scope.updateDispositions();
                            }

                            // cancel team dialog
                            $scope.cancelTeams = function () {
                                $scope.show_teamsdial = false;
                                //$scope.updateDispositions();
                            }

                            //open service dialog
                            $scope.onServDial = function () {
                                $scope.show_servdial = true;
                                $('.widget-teamsdial').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                //$scope.updateDispositions();
                            }

                            // ok service dialog
                            $scope.okServ = function () {
                                $scope.show_servdial = false;
                                //$scope.updateDispositions();
                            }

                            // cancel service dialog
                            $scope.cancelServ = function () {
                                $scope.show_servdial = false;
                                //$scope.updateDispositions();
                            }


                            $scope.getWidgetBodyMainFont = function () {
                                return _.assign({},
                                    $scope.themeStyle.WidgetBodyMainFont
                                );
                            };

                            $scope.getWidgetBodySecondFont = function () {
                                return _.assign({},
                                    $scope.themeStyle.WidgetBodySecondFont
                                );
                            };

                            $scope.getWidgetListHeaderFont = function () {
                                return _.assign({},
                                    $scope.themeStyle.WidgetListHeaderFont,
                                    $scope.themeStyle.WidgetListBackground
                                );
                            };

                            $scope.getWidgetListItemFont = function () {
                                return _.assign({},
                                    $scope.themeStyle.WidgetListItemFont,
                                    $scope.themeStyle.WidgetListBackground
                                );
                            };

                        }

                        if ($scope.config.type === 'news') {
                            $scope.tempnumb = {};
                            $scope.tempnumb.int = parseInt($scope.config.subscription.req.limit);

                            if ($scope.editmode) {
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            }
                            else {
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            }

                            $scope.$on('offEditMode', function () {
                                turnOffEditMode($scope, $element);
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            });

                            $scope.$on('onEditMode', function () {
                                turnOnEditMode($scope, $element);
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            });

                            $scope.updateDispositions = function () {
                                $scope.$emit('RecreateSubscription');
                            }

                            $scope.showSettings = function () {
                                if ($scope.globalmode) return;
                                $scope.show_settings = true;
                                turnOnEditMode($scope, $element);
                                $('.widget-settings').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                $scope.$emit('onEditModeUp');
                                $scope.$emit('LoadDispositions');
                            }

                            $scope.applySettings = function () {

                                $scope.show_settings = false;

                                $scope.config.subscription.req.limit = parseInt($scope.tempnumb.int);

                                $scope.updateDispositions();
                            }

                            $scope.cancelSettings = function () {
                                $scope.show_settings = false;
                                $scope.tempnumb.int = parseInt($scope.config.subscription.req.limit);
                                $scope.$emit('cancelEditModeUp');
                                //$scope.updateDispositions();
                            }
                        }


                        if ($scope.config.type === 'summary') {

                            $scope.config.coltitle = [];
                            $scope.state_icon = false;

                            if ($scope.editmode) {
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            }
                            else {
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            }

                            $scope.$on('offEditMode', function () {
                                turnOffEditMode($scope, $element);
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            });

                            $scope.$on('onEditMode', function () {
                                turnOnEditMode($scope, $element);
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            });


                            $scope.chartId = $scope.config.id + Math.floor(Math.random() * 10000);

                            var chart;
                            setTimeout(function () {
                                if ($('#' + getChartId($scope)).length === 0) {
                                    return;
                                }

                                chart = Highcharts.chart(getChartId($scope), {
                                    chart: {
                                        animation: false,
                                        backgroundColor: null,
                                    },
                                    legend: {
                                        labelFormat: '{y} {name}',
                                        // width: 3000,
                                        padding: 0,
                                        // align: 'left',
                                        layout: 'vertical',
                                        itemMarginTop: 3,
                                        itemMarginBottom: 3,
                                        align: 'right',
                                        verticalAlign: 'middle',
                                        itemStyle: _.assign(
                                            {
                                                fontWeight: 'normal',
                                                fontSize: '1.5vmin',
                                            },
                                            $scope.themeStyle.WidgetDonutPie
                                        ),
                                        // margin: 0,
                                        symbolHeight: 10,
                                        symbolPadding: 0,
                                    },
                                    credits: {
                                        enabled: false
                                    },
                                    title: {
                                        text: '',
                                        margin: 0,
                                    },
                                    // subtitle: {
                                    //      style: {
                                    //      'font-size': '20px',
                                    //     },
                                    //     text: '2015',
                                    //     align: 'center',
                                    //     //margin: 0,
                                    //     verticalAlign: 'middle',
                                    //     //y: 40
                                    // },
                                    tooltip: {
                                        pointFormat: '<span style="color:{point.color}">\u25CF</span> {point.name} {point.y}',
                                        headerFormat: '',
                                    },
                                    plotOptions: {
                                        pie: _.assign(
                                            {
                                                animation: false,
                                                dataLabels: {
                                                    enabled: false,
                                                },
                                                showInLegend: true,
                                            },
                                            $scope.themeStyle.WidgetDonutBorder
                                        )
                                    },
                                    series: [{
                                        type: 'pie',
                                        name: 'Browser share',
                                        innerSize: '50%',
                                        data: $scope.data
                                    }],
                                    colors: [
                                        "#f0f9e8",
                                        "#bae4bc",
                                        "#7bccc4",
                                        "#2b8cbe"
                                    ],
                                });

                                $scope.$watch('data', function (data) {
                                    if (chart.container) {
                                        chart
                                            .series[0]
                                            .setData(data);
                                    } else {
                                        $scope.$destroy();
                                    }
                                });
                            }, 2000);

                            $scope.$on('$destroy', function () {
                                chart.destroy();
                            });

                            $scope.updateDispositions = function () {
                                $scope.$emit('RecreateSubscription');
                            }

                            //open widget settins dialog
                            $scope.showSettings = function () {
                                if ($scope.globalmode) return;
                                $scope.show_settings = true;
                                turnOnEditMode($scope, $element);
                                $('.widget-settings').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                $scope.$emit('onEditModeUp');
                                $scope.$emit('LoadDispositions');
                            }

                            //change ID and sort & replace row in table settings
                            $scope.changeID = function (column) {
                                var indexCol = $scope.config.subscription.req.columns.indexOf(column);
                                var indexStart = 0;
                                var indexStop = 0;

                                if (column.id != "" && column.id >= 0 && column.id < 100) {
                                    indexStart = $scope.config.subscription.req.columns.findIndex(function (obj) {
                                        return obj.id == column.id
                                    });

                                    for (var j = $scope.config.subscription.req.columns.length - 1; j > 0; j--) {
                                        if ($scope.config.subscription.req.columns[j].id == column.id) {
                                            indexStop = j;
                                            break;
                                        }
                                    }

                                    if (indexCol > indexStart) {
                                        for (var i = indexStart; i < indexCol; i++) {
                                            $scope.config.subscription.req.columns[i].id = parseInt($scope.config.subscription.req.columns[i].id) + 1;
                                        }
                                    }

                                    if (indexCol < indexStop) {
                                        for (var i = indexStop; i > indexCol; i--) {
                                            $scope.config.subscription.req.columns[i].id = parseInt($scope.config.subscription.req.columns[i].id) - 1;
                                        }
                                    }

                                    $scope.config.subscription.req.columns.sort(compareID);

                                }
                            }

                            // sort options switch
                            // need rebuild to normal function use
                            $scope.fChangeSort = function (column, str) {
                                var indexCol = $scope.config.subscription.req.columns.indexOf(column);
                                var findFlag = false;
                                var findIndexEmpt = -1;
                                var tempOrder = {};
                                if (str == 'empt') {
                                    $scope.config.subscription.req.columns[indexCol].dir = "DESC";
                                    if ($scope.config.subscription.req.order != undefined) {
                                        $scope.config.subscription.req.order.forEach(function (ord) {
                                            if (ord.by == column.id) {
                                                ord.dir = "DESC";
                                                findFlag = true;
                                            }
                                        });
                                        if (!findFlag) {
                                            tempOrder.by = column.id;
                                            tempOrder.dir = "DESC";
                                            $scope.config.subscription.req.order.push(tempOrder);
                                        }

                                    } else {
                                        $scope.config.subscription.req.order = [];
                                        $scope.config.subscription.req.order[0] = {};
                                        $scope.config.subscription.req.order[0].by = column.id;
                                        $scope.config.subscription.req.order[0].dir = "DESC";
                                    }
                                }
                                if (str == 'des') {
                                    $scope.config.subscription.req.columns[indexCol].dir = "ASC";
                                    if ($scope.config.subscription.req.order != undefined) {
                                        $scope.config.subscription.req.order.forEach(function (ord) {
                                            if (ord.by == column.id) {
                                                ord.dir = "ASC";
                                                findFlag = true;
                                            }
                                        });
                                        if (!findFlag) {
                                            tempOrder.by = column.id;
                                            tempOrder.dir = "DESC";
                                            $scope.config.subscription.req.order.push(tempOrder);
                                        }
                                    } else {
                                        $scope.config.subscription.req.order = [];
                                        $scope.config.subscription.req.order[0] = {};
                                        $scope.config.subscription.req.order[0].by = column.id;
                                        $scope.config.subscription.req.order[0].dir = "ASC";
                                    }
                                }
                                if (str == 'as') {
                                    $scope.config.subscription.req.columns[indexCol].dir = undefined;
                                    if ($scope.config.subscription.req.order != undefined) {
                                        $scope.config.subscription.req.order.forEach(function (ord, i) {
                                            if (ord.by == column.id) {
                                                ord.dir = undefined;
                                                findIndexEmpt = i;
                                            }
                                        });
                                        $scope.config.subscription.req.order.splice(findIndexEmpt, 1);
                                    }
                                }
                            }

                            // apply widget settings
                            $scope.applySettings = function () {
                                $scope.show_settings = false;
                                //$scope.$emit('Rebuild');
                                $scope.updateDispositions();
                            }

                            // input column title
                            $scope.fInputTitle = function (col) {

                            }

                            // select state icon statistic
                            $scope.fChangeStat = function (col) {
                                if (col.statName == "state_ic") {
                                    //$scope.config.subscription.req.columns[$scope.config.subscription.req.columns.indexOf(col)].statName = "state";
                                    $scope.state_icon = true;
                                    $scope.icon_col_id = col.id;
                                }
                            }

                            //cancel widget settings
                            $scope.cancelSettings = function () {
                                $scope.show_settings = false;
                                $scope.$emit('cancelEditModeUp');
                                //$scope.updateDispositions();
                            }

                            //delete stat column
                            $scope.delCol = function (column) {
                                var i = 1;
                                var index = $scope.config.subscription.req.columns.indexOf(column);
                                $scope.config.subscription.req.columns.splice(index, 1);
                                $scope.config.subscription.req.columns.forEach(function (col) {
                                    col.id = i.toString();
                                    i++;
                                })
                            }

                            // add stat column
                            $scope.addCol = function (str) {
                                var newCol = {};
                                var i = 1;
                                newCol.id = ($scope.config.subscription.req.columns.length + 1).toString();
                                newCol.statName = "name";
                                $scope.config.subscription.req.columns.push(newCol);
                                $scope.config.subscription.req.columns.forEach(function (col) {
                                    col.id = i.toString();
                                    i++;
                                })
                                newCol = null;

                                //scroll down to added column
                                $('.widget-content').animate({
                                    scrollTop: $("#" + str).offset().top
                                }, 2000);
                            }

                            //open state dialog
                            $scope.onStateDial = function () {
                                $scope.show_statesdial = true;
                                $('.widget-statesdial').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                //$scope.updateDispositions();
                            }

                            // ok state dialog
                            $scope.okState = function () {
                                $scope.show_statesdial = false;
                                //$scope.updateDispositions();
                            }

                            // cancel state dialog
                            $scope.cancelState = function () {
                                $scope.show_statesdial = false;
                                //$scope.updateDispositions();
                            }

                            // open team dialog
                            $scope.onTeamsDial = function () {
                                $scope.show_teamsdial = true;
                                $('.widget-teamsdial').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                //$scope.updateDispositions();
                            }

                            // ok team dialog
                            $scope.okTeams = function () {
                                $scope.show_teamsdial = false;
                                //$scope.updateDispositions();
                            }

                            // cancel team dialog
                            $scope.cancelTeams = function () {
                                $scope.show_teamsdial = false;
                                //$scope.updateDispositions();
                            }

                            //open service dialog
                            $scope.onServDial = function () {
                                $scope.show_servdial = true;
                                $('.widget-teamsdial').draggable({
                                    containment: "parent",
                                    scroll: false
                                });
                                //$scope.updateDispositions();
                            }

                            // ok service dialog
                            $scope.okServ = function () {
                                $scope.show_servdial = false;
                                //$scope.updateDispositions();
                            }

                            // cancel service dialog
                            $scope.cancelServ = function () {
                                $scope.show_servdial = false;
                                //$scope.updateDispositions();
                            }
                        }

                        if ($scope.config.type === 'gauge') {

                            $scope.config.coltitle = [];
                            $scope.state_icon = false;

                            if ($scope.editmode) {
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            }
                            else {
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            }

                            $scope.$on('offEditMode', function () {
                                turnOffEditMode($scope, $element);
                                $scope.settings = "settings glyphicon glyphicon-cog";
                            });

                            $scope.$on('onEditMode', function () {
                                turnOnEditMode($scope, $element);
                                $scope.settings = "settings-edit glyphicon glyphicon-cog";
                            });


                            $scope.chartId = $scope.config.id + Math.floor(Math.random() * 10000);

                            var gaugeChart;
                            setTimeout(function () {
                                var id = getGaugeId($scope);
                                if ($('#' + id).length === 0) {
                                    return;
                                }

                                gaugeChart = Highcharts.chart(id,  {

                                    chart: {
                                        type: 'solidgauge',
                                        animation: false,
                                        backgroundColor: null,
                                    },

                                    title: null,

                                    pane: {
                                        center: ["50%", "60%"],
                                        size: '120%',
                                        startAngle: -120,
                                        endAngle: 120,
                                        background: {
                                            backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                                            innerRadius: '85%',
                                            outerRadius: '100%',
                                            shape: 'arc'
                                        }
                                    },

                                    tooltip: {
                                        enabled: false
                                    },

                                    // the value axis
                                    yAxis: {
                                        min: 0,
                                        max: 200,
                                        title: {
                                            y: -70,
                                            text: null                                        },
                                        stops: [
                                            [0.1, '#55BF3B'], // green
                                            [0.5, '#DDDF0D'], // yellow
                                            [0.9, '#DF5353'] // red
                                        ],
                                        lineWidth: 0,
                                        minorTickInterval: null,
                                        tickAmount: 2,
                                        labels: {
                                            y: 16,
                                            style: {
                                                color: $scope.themeStyle.WidgetGauge.color
                                            }
                                        }
                                    },

                                    credits: {
                                        enabled: false
                                    },

                                    plotOptions: {
                                        solidgauge: {
                                            dataLabels: {
                                                y: -30,
                                                borderWidth: 0,
                                                useHTML: true,
                                                allowOverlap:true
                                            },
                                            innerRadius: '85%'
                                        }
                                    },

                                    series: [{
                                        name: 'Speed',
                                        data: [80],
                                        dataLabels: {
                                            format: '<div style="text-align:center"><span style="font-size:25px;color:' +
                                            ($scope.themeStyle.WidgetGauge.color) + '">{y}</span>'
                                        },

                                    }]
                                });

                                $scope.$watch('data', function (data) {
                                    if (gaugeChart.container) {
                                        gaugeChart
                                            .series[0]
                                            .setData(data);
                                    } else {
                                        $scope.$destroy();
                                    }
                                });
                            }, 2000);

                            $scope.$on('$destroy', function () {
                                gaugeChart.destroy();
                            });
                        }

                        // clear data
                        $scope.isDataEmpty = function () {
                            return angular.isUndefined($scope.data) ||
                                angular.equals($scope.data, []) ||
                                angular.equals($scope.data, {});
                        }

                        $scope.getTemplateUrl = function () {
                            return 'partials/widgets/' + $scope.config.type + '.html';

                        }

                        $scope.getGridTitleStyle = function (index, config) {
                            index = parseInt(index);
                            if (index > 10) {
                              if (config.subscription.req.columns[index] != undefined && config.subscription.req.columns[index].statName == "name") {
                                return _.assign(
                                    $scope.themeStyle.WidgetListHeaderFont,
                                    $scope.themeStyle.WidgetListColumnDivider,
                                    $scope.themeStyle.WidgetListBackground,
                                    $scope.themeStyle.WidgetListHeaderLeft
                                );
                              } else {
                                return _.assign(
                                    $scope.themeStyle.WidgetListHeaderFont,
                                    $scope.themeStyle.WidgetListColumnDivider,
                                    $scope.themeStyle.WidgetListBackground,
                                    $scope.themeStyle.WidgetListHeaderRight
                                );
                              }
                            } else {
                              if (config.subscription.req.columns[index] != undefined && config.subscription.req.columns[index].statName == "name" || index == 0) {
                                return _.assign(
                                    $scope.themeStyle.WidgetListHeaderFont,
                                    $scope.themeStyle.WidgetListBackground,
                                    $scope.themeStyle.WidgetListHeaderLeft
                                );
                              } else {
                                return _.assign(
                                    $scope.themeStyle.WidgetListHeaderFont,
                                    $scope.themeStyle.WidgetListBackground,
                                    $scope.themeStyle.WidgetListHeaderRight
                                );
                              }
                            }
                        }

                        $scope.getGridRowStyle = function (index) {
                            index = parseInt(index);
                            if (index % 2 == 0) {
                                return _.assign(
                                    $scope.themeStyle.WidgetListBackgroundSecond,
                                    $scope.themeStyle.WidgetListItemFont
                                );
                            } else {
                                return _.assign(
                                    $scope.themeStyle.WidgetListBackground,
                                    $scope.themeStyle.WidgetListItemFont
                                );
                            }
                        }

                        // style cell in grid widget
                        $scope.getGridCellStyle = function (index, data, row, cell, config) {
                            index = parseInt(index);
                            if(config.subscription.req.columns[index] != undefined && config.subscription.req.columns[index].statName == "name") {
                              return "font-size: 2vmin;text-align:left;";
                            } else {
                              return "font-size: 2vmin";
                            }
                        }

                        // style in news widget
                        $scope.getNewsRowStyle = function (index, data, row) {
                            index = parseInt(index);
                            return {
                                'font-size': '2.5vmin',
                            }
                        }

                        $scope.getWidgetHeaderIcons = function () {
                            return $scope.themeStyle.WidgetHeaderIcons;
                        }

                        // widget settings hover
                        $scope.fSettHover = function () {
                            if ($scope.globalmode) return;
                            $('#' + $scope.config.id + ' .widget-heading .settings').css("opacity", 100);
                            $('#' + $scope.config.id + ' .widget-heading .settings').css("fill", $scope.themeStyle.WidgetHeaderIconsHover.fill);
                            $('#' + $scope.config.id + ' .widget-heading .settings-edit').css("fill", $scope.themeStyle.WidgetHeaderIconsHover.fill);
                        }

                        $scope.offSettHover = function () {
                            if ($scope.globalmode) return;
                            $('#' + $scope.config.id + ' .widget-heading .settings').css("opacity", 0);
                            $('#' + $scope.config.id + ' .widget-heading .settings').css("fill", $scope.themeStyle.WidgetHeaderIcons.fill);
                            $('#' + $scope.config.id + ' .widget-heading .settings-edit').css("fill", $scope.themeStyle.WidgetHeaderIcons.fill);
                        }

                        // widget delete hover
                        $scope.addHoverDelete = function () {
                            if ($scope.globalmode) return;
                            $('#' + $scope.config.id + ' .widget-heading .delete').css("fill", $scope.themeStyle.WidgetHeaderIconsHover.fill);

                        }

                        $scope.addNoHoverDelete = function () {
                            if ($scope.globalmode) return;
                            $('#' + $scope.config.id + ' .widget-heading .delete').css("fill", $scope.themeStyle.WidgetHeaderIcons.fill);

                        }

                        $scope.getValue = function () {
                            return $parse($scope.config.value)($scope.data);
                        }

                        $scope.getOptValue = function () {
                            return $parse($scope.config.optValue)($scope.data);
                        }

                        $scope.getWidgetMode = function () {
                            return $scope.config.mode;
                        }

                        //open delete widget dialog
                        $scope.showDelDial = function () {
                            $scope.show_deldial = true;
                            $('.widget-deldial').draggable({
                                containment: "parent",
                                scroll: false
                            });
                        }

                        // cancel delete widget dialog
                        $scope.cancelDel = function () {
                            $scope.show_deldial = false;
                        }

                        // delete widget
                        $scope.delWidget = function () {
                            $scope.$emit('delWidg', $scope.config);
                        }
                    }
                ]
            }
        })

    function turnOnEditMode($scope, $element) {
        $scope.editmode = true;

        var data = $element.data();

        if (!data['ui-resizable']) {
            $element.resizable(Object.assign({}, resizableConfig, {disabled: false}));
        }

        if (!data['ui-draggable']) {
            $element.draggable(Object.assign({}, resizableConfig, {disabled: false}));
        }
    }

    function turnOffEditMode($scope, $element) {
        $scope.editmode = false;

        $element.resizable('disable');
        $element.draggable('disable');
    }

    function getChartId($scope) {
        return 'summaryID' + $scope.chartId;
    }

    function getGaugeId($scope) {
        return 'gaugeID' + $scope.chartId;
    }
})();

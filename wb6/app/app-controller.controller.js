angular.module('app')
    .controller('AppController', ['$scope','$window', '$http', '$timeout', '$parse', 'StatsApi', 'StyleApi','StatsDef', '$compile', 'WallboardStorage',




        function ($scope, $window, $http, $timeout, $parse, StatsApi, StyleApi, StatsDef, $compile, WallboardStorage) {

            // STEP: declare local variable
            var flagFirstLoad = 0;
            var getDataTimeout;
            var flagDelWB = false;
            // widget resize events
            var sttX = 0;
            var sttY = 0;
            var sttW = 0;
            var sttH = 0;
            var startX, startY, stopX, stopY;
            var iCountSett = 0;
            var tempColors = {};
            var subscription = false;
            var SUBSCRIBE_DELAY = 5000;
            var GET_DATA_DELAY = 5000;

            window.onload = function() {
              document.querySelectorAll('.wall-title')[0].className = "wall-title";
              document.querySelectorAll('.popup')[0].className = "popup ng-hide";
              document.querySelectorAll('.edit-dialog')[0].className = "edit-dialog ng-hide";
            };


            // STEP: fill scope variable
            $scope.CurrentBoard = {};
            $scope.CurrentBoard.widgets = [];

            $scope.tempboard = [];
            $scope.Wallboards = [];

            //empty WB default config
            $scope.emptyDefaultBoard = function () {
              $scope.NewBoard = {};
              $scope.NewBoard.widgets = [];
              $scope.NewBoard.widgets = [
                  {
                      "config": {
                          "id": "1",
                          "type": "empty",
                          "title": "",
                          "x": 0,
                          "y": 0,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "2",
                          "type": "empty",
                          "title": "",
                          "x": 3,
                          "y": 0,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "3",
                          "type": "empty",
                          "title": "",
                          "x": 6,
                          "y": 0,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "4",
                          "type": "empty",
                          "title": "",
                          "x": 9,
                          "y": 0,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "5",
                          "type": "empty",
                          "title": "",
                          "x": 0,
                          "y": 4,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "6",
                          "type": "empty",
                          "title": "",
                          "x": 3,
                          "y": 4,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "7",
                          "type": "empty",
                          "title": "",
                          "x": 6,
                          "y": 4,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "8",
                          "type": "empty",
                          "title": "",
                          "x": 9,
                          "y": 4,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "9",
                          "type": "empty",
                          "title": "",
                          "x": 0,
                          "y": 8,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "10",
                          "type": "empty",
                          "title": "",
                          "x": 3,
                          "y": 8,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "11",
                          "type": "empty",
                          "title": "",
                          "x": 6,
                          "y": 8,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  },
                  {
                      "config": {
                          "id": "12",
                          "type": "empty",
                          "title": "",
                          "x": 9,
                          "y": 8,
                          "width": 3,
                          "height": 4,
                          "show_settings": true
                      }
                  }
              ];

              // empty cells default create 12x12
              $scope.emptycells = [];
              for (var i = 0; i < 12; i++) {
                  $scope.emptycells[i] = [];
                  for (var j = 0; j < 12; j++) {
                      $scope.emptycells[i][j] = {};
                      $scope.emptycells[i][j].y = i;
                      $scope.emptycells[i][j].x = j;
                      $scope.emptycells[i][j].status = "empty";
                      $scope.emptycells[i][j].id = "x" + j + "y" + i;
                  }
              }
            }
            $scope.emptyDefaultBoard();
            $scope.editmode = false;
            $scope.globalmode = false;
            $scope.selectmode = false;
            $scope.resizemode = false;
            $scope.indexResize = 0;

            // variable for single statistic widget
            $scope.dataAllSingle = StatsDef.dataAllSingle;

            $scope.dataGridAgent = StatsDef.dataGridAgent;

            $scope.dataGridService = StatsDef.dataGridService;

            // dropdown select WB
            $scope.ddWallSelectOptions = [
                {
                    text: 'My New Wallboard',
                    value: '0'
                },
                {
                    text: 'Second Wallboard',
                    value: '1'
                }
            ];
            $scope.ddWallSelectSelected = {};

            // dropdown menu
            $scope.ddMenuSelectOptions = [
                {
                    text: 'New',
                    value: 'new'
                },
                {
                    text: 'Edit',
                    value: 'edit'
                },
                {
                    text: 'Duplicate',
                    value: 'dublicate'
                },
                {
                    text: 'Delete',
                    value: 'delete'
                },
                {
                    text: 'Export',
                    value: 'export'
                },
                {
                    text: 'Import',
                    value: 'import'
                },
                {
                    text: 'Push to global',
                    value: 'push'
                },
                {
                    text: 'Pull from global',
                    value: 'pull'
                },
                {
                    text: 'Logout',
                    value: 'logout'
                }
            ];
            $scope.ddMenuSelectSelected = {};

            // widget add data
            $scope.addWidgetData = {};
            $scope.addWidgetData.new = [];
            $scope.addWidgetData.new = [
                {type: 'stats_total', title: 'Single Statistic', pict: 'picture/speedometer_4969.png'},
                {type: 'agent_grid', title: 'Agent Grid', pict: 'picture/ViewDetails512.png'},
                {type: 'service_grid', title: 'Service Grid', pict: 'picture/combo512.png'},
                {type: 'news', title: 'News', pict: 'picture/speedometer_4969.png'},
                {type: 'summary', title: 'Agent State Summary', pict: 'picture/ViewDetails512.png'},
                {type: 'gauge', title: 'Gauge', pict: 'picture/speedometer_4969.png'}
            ];
            $scope.addWidgetData.del = [];

            // colors and styles settings

            $scope.themeId = "black";

            $scope.colstyle = {};
            $scope.colstyle.bgcolor = "000000";
            $scope.colstyle.cardcolor = "233752";
            $scope.colstyle.cardborder = "solid 1px";
            $scope.colstyle.cardbordercolor = "000000";
            $scope.colstyle.fontcolor = "73E0FF";
            $scope.colstyle.underline = "solid 1px";
            $scope.colstyle.underlinecolor = "73E0FF";

            $scope.colstyle.alertbg = "A11D3B";
            $scope.colstyle.alertfont = "FFFFFF";
            $scope.colstyle.alertborder = "8D1427";


            // STEP: declare scope function

            $scope.widResized = function (evt, ui) {
                if (evt.type == "resizestart") {
                    var indexToStart = $scope.CurrentBoard.widgets.findIndex(obj => obj.config.id == ui.element[0].id);

                    sttX = $scope.CurrentBoard.widgets[indexToStart].config.x;
                    sttY = $scope.CurrentBoard.widgets[indexToStart].config.y;
                    sttW = $scope.CurrentBoard.widgets[indexToStart].config.width;
                    sttH = $scope.CurrentBoard.widgets[indexToStart].config.height;
                    for (var i = sttY; i < sttY + sttH; i++) {
                        for (var j = sttX; j < sttX + sttW; j++) {
                            $scope.emptycells[i][j].status = "empty";
                            //$('#'+$scope.emptycells[i][j].id).css("background-color", "green");
                        }
                    }
                }
                if (evt.type == "resizestop") {
                    var indexToStop = $scope.CurrentBoard.widgets.findIndex(obj => obj.config.id == ui.element[0].id);

                    var stpX = Math.floor(ui.position.left / $scope.widthCell);
                    var stpY = Math.floor((ui.position.top) / $scope.heightCell);
                    var stpW = Math.ceil(ui.size.width / $scope.widthCell);
                    var stpH = Math.ceil(ui.size.height / $scope.heightCell);

                    if(stpY < 0){
                      stpH = stpH + stpY;
                      stpY = 0;
                    }
                    if(stpY + stpH >= $scope.emptycells.length) stpH = ($scope.emptycells.length) - stpY;
                    if(stpX < 0) {
                      stpW = stpW + stpX;
                      stpX = 0;
                    }
                    if(stpX + stpW >= $scope.emptycells[0].length) stpW = ($scope.emptycells[0].length) - stpX;

                    if (stpW < 2 || stpH < 2) {
                        $scope.reBuild();
                        return;
                    }
                    var selectFlag = 0;
                    //$('#'+$scope.emptycells[CellY][CellX].id).css("background-color", "red");
                    for (var i = stpY; i < stpY + stpH; i++) {
                        for (var j = stpX; j < stpX + stpW; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                            //$('#'+$scope.emptycells[i][j].id).css("background-color", "blue");
                        }
                    }

                    if (!selectFlag) {
                        $scope.CurrentBoard.widgets[indexToStop].config.x = stpX;
                        $scope.CurrentBoard.widgets[indexToStop].config.y = stpY;
                        $scope.CurrentBoard.widgets[indexToStop].config.width = stpW;
                        $scope.CurrentBoard.widgets[indexToStop].config.height = stpH;
                        for (var i = stpY; i < stpY + stpH; i++) {
                            for (var j = stpX; j < stpX + stpW; j++) {
                                $scope.emptycells[i][j].status = "selected";
                                //$('#'+$scope.emptycells[i][j].id).css("background-color", "blue");
                            }
                        }
                    } else {
                        for (var i = sttY; i < sttY + sttH; i++) {
                            for (var j = sttX; j < sttX + sttW; j++) {
                                $scope.emptycells[i][j].status = "selected";
                                //$('#'+$scope.emptycells[i][j].id).css("background-color", "green");
                            }
                        }
                    }
                    $scope.reBuild();
                }
            };

            $scope.widDragged = function (evt, ui) {
                if (ui.helper[0].id == "" || ui.helper[0].id == undefined) return;
                if (evt.type == "dragstart") {

                }
                if (evt.type == "dragstop") {
                    var indexToStop = $scope.CurrentBoard.widgets.findIndex(obj => obj.config.id == ui.helper[0].id);

                    var X = $scope.CurrentBoard.widgets[indexToStop].config.x;
                    var Y = $scope.CurrentBoard.widgets[indexToStop].config.y;
                    var W = $scope.CurrentBoard.widgets[indexToStop].config.width;
                    var H = $scope.CurrentBoard.widgets[indexToStop].config.height;
                    var selectFlag = 0;

                    var newX = parseInt(ui.position.left / $scope.widthCell);
                    var newY = parseInt(( ui.position.top) / $scope.heightCell);

                    if (newX + W > $scope.emptycells[0].length || newY + H > $scope.emptycells.length) {

                        $scope.reBuild();
                        return;
                    }

                    for (var i = Y; i < Y + H; i++) {
                        for (var j = X; j < X + W; j++) {
                            $scope.emptycells[i][j].status = "empty";
                        }
                    }

                    for (var i = newY; i < newY + H; i++) {
                        for (var j = newX; j < newX + W; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }

                    if (!selectFlag) {

                        $scope.CurrentBoard.widgets[indexToStop].config.x = newX;
                        $scope.CurrentBoard.widgets[indexToStop].config.y = newY;
                        X = $scope.CurrentBoard.widgets[indexToStop].config.x;
                        Y = $scope.CurrentBoard.widgets[indexToStop].config.y;

                        for (var i = Y; i < Y + H; i++) {
                            for (var j = X; j < X + W; j++) {
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }

                    } else {
                        for (var i = Y; i < Y + H; i++) {
                            for (var j = X; j < X + W; j++) {
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }

                    }

                    $scope.reBuild();

                }
            };

            //empty cell style
            $scope.getEmptyStyle = function (cell) {
            }

            // on hover widget
            $scope.fWidgetHover = function (w) {
                if ($scope.editmode) {
                    $('#' + w.config.id + ' .widget-heading .settings-edit').css("opacity", 100);
                    $('#' + w.config.id + ' .widget-heading > .delete').css("opacity", 100);
                    $('#addbut' + w.config.id).css("opacity", 100);
                }
            }

            //off hover widget
            $scope.offWidgetHover = function (w) {
                if ($scope.editmode) {
                    $('#' + w.config.id + ' .widget-heading .settings-edit').css("opacity", 0);
                    $('#' + w.config.id + ' .widget-heading > .delete').css("opacity", 0);
                    $('#addbut' + w.config.id).css("opacity", 0);
                }
            }

            // click on empty cell
            $scope.onEmptyClick = function (e) {
                //console.log(e);
                //$('#'+e.id).css("background-color", "red");
                //    var empty = angular.element(document.querySelector(".empty"));
            }

            // shift mouse position on widget
            $scope.mouseShift = function (myE) {
                $scope.shiftX = parseInt(myE.clientX / $scope.widthCell);
                $scope.shiftY = parseInt((myE.clientY) / $scope.heightCell);
            }

            // start select empty cells for create widget
            $scope.onStartSelect = function (e) {
                if ($scope.resizemode) return;
                startX = e.x;
                startY = e.y;
                $scope.selectmode = true;
                $('#' + e.id).addClass("selected");
            }

            // stop select empty cells for create widget
            $scope.onStopSelect = function (e) {
                if (e == undefined) {
                    $scope.selectmode = false;
                    $('.empty').each(function () {
                        $(this).removeClass("selected");
                        $(this).removeClass("selected-error");
                    });
                    if ($scope.resizemode) {
                        $scope.resizemode = false;
                        $('#' + ($scope.indexResize + 1)).show();
                    }
                    return;
                }
                ;
                stopX = e.x;
                stopY = e.y;

                $('.empty').each(function () {
                    $(this).removeClass("selected");
                    $(this).removeClass("selected-error");
                });

                if ($scope.resizemode) {
                    $scope.resizemode = false;
                    $scope.selectmode = false;
                } else {
                    if ($scope.selectmode) {
                        $scope.selectmode = false;
                        onSelect(startX, startY, stopX, stopY);
                    }
                }

            }

            // hover select empty cells for create widget
            $scope.hoverIn = function (e) {
                if (!$scope.selectmode) return;
                $('.empty').each(function () {
                    //console.log(this);
                    $(this).removeClass("selected");
                    $(this).removeClass("selected-error");
                });

                stopX = e.x;
                stopY = e.y;

                if (stopX > startX && stopY > startY) {
                    var selectFlag = 0;
                    for (var i = startY; i <= stopY; i++) {
                        for (var j = startX; j <= stopX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = startY; i <= stopY; i++) {
                            for (var j = startX; j <= stopX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected");
                            }
                        }
                    } else {
                        for (var i = startY; i <= stopY; i++) {
                            for (var j = startX; j <= stopX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected-error");
                            }
                        }
                    }
                }
                if (stopX < startX && stopY > startY) {
                    var selectFlag = 0;
                    for (var i = startY; i <= stopY; i++) {
                        for (var j = stopX; j <= startX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = startY; i <= stopY; i++) {
                            for (var j = stopX; j <= startX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected");
                            }
                        }
                    } else {
                        for (var i = startY; i <= stopY; i++) {
                            for (var j = stopX; j <= startX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected-error");
                            }
                        }
                    }
                }
                if (stopX > startX && stopY < startY) {
                    var selectFlag = 0;
                    for (var i = stopY; i <= startY; i++) {
                        for (var j = startX; j <= stopX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = stopY; i <= startY; i++) {
                            for (var j = startX; j <= stopX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected");
                            }
                        }
                    } else {
                        for (var i = stopY; i <= startY; i++) {
                            for (var j = startX; j <= stopX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected-error");
                            }
                        }
                    }
                }
                if (stopX < startX && stopY < startY) {
                    var selectFlag = 0;
                    for (var i = stopY; i <= startY; i++) {
                        for (var j = stopX; j <= startX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = stopY; i <= startY; i++) {
                            for (var j = stopX; j <= startX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected");
                            }
                        }
                    } else {
                        for (var i = stopY; i <= startY; i++) {
                            for (var j = stopX; j <= startX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $('#' + $scope.emptycells[i][j].id).addClass("selected-error");
                            }
                        }
                    }
                }

            }

            $scope.getAlertedStatus = function(widget) {
                var trigger = false;
                if(widget.config != undefined){
                  trigger = widget.config.mode == "alerted" && widget.config.type == 'single';
                }
                var status = trigger ? 'alerted' : '';
                return status;
            }

            $scope.getCurrentTheme = function () {
                var wallboardId;
                if ($scope.editmode) {
                    wallboardId = $scope.CurrentBoard.editId;
                } else {
                    wallboardId = $scope.CurrentBoard.id;
                }

                var wallboard = WallboardStorage.get(wallboardId);

                if (wallboard) {
                    return StyleApi.getTheme(WallboardStorage.getTheme(wallboardId));
                }

                return StyleApi.getTheme();
            };

            // on edit mode
            $scope.onEditMode = function (str) {
                if ($scope.CurrentBoard.is_global == true) return;
                if (!$scope.editmode) {
                    // copy WB for cancel edit
                    $scope.tempboard = JSON.parse(JSON.stringify($scope.CurrentBoard.widgets));
                }
                if (str != undefined) {
                    iCountSett = 0;
                    $scope.tempboard2 = JSON.parse(JSON.stringify($scope.CurrentBoard.widgets));
                }
                //copy for cancel winget settings
                if (iCountSett > 1) {
                    $scope.tempboard2 = JSON.parse(JSON.stringify($scope.CurrentBoard.widgets));
                }
                iCountSett++;

                $('#body').addClass("editmod");

                $('.empty').each(function () {
                    $(this).addClass("edit");
                });

                $scope.editmode = true;
                if($scope.CurrentBoard.id != undefined){
                  var editId = WallboardStorage.createEditCopy($scope.CurrentBoard.id);
                  $scope.CurrentBoard.editId = editId;
                } else {
                  $scope.CurrentBoard.editId = undefined;
                }
                $scope.$broadcast('onEditMode');
            }

            // off(ok) edit mode
            $scope.offEditMode = function () {
                if($scope.CurrentBoard.editId != undefined){
                  WallboardStorage.applyEditCopy($scope.CurrentBoard.editId);
                }
                $('#body').removeClass("editmod");
                $('.empty').each(function () {
                    $(this).removeClass("edit");
                });
                $('.widget').each(function () {
                    $(this).css('cursor', 'default');
                });
                $scope.editmode = false;
                $scope.$broadcast('offEditMode');
                if ($scope.CurrentBoard.id == undefined) {
                    createWallboard();
                } else {
                    var indexToSet = $scope.Wallboards.findIndex(obj => obj.id == $scope.CurrentBoard.id);
                    if ($scope.Wallboards[indexToSet].name != $scope.CurrentBoard.name) {
                        updateWallboard($scope.CurrentBoard.id, "name", {"name": $scope.CurrentBoard.name});
                    }

                    var tempConfig = {};
                    tempConfig.widgets = [];
                    $scope.CurrentBoard.widgets.forEach(function (w) {
                        if (w.config.temptype != undefined) {
                            delete w.config.temptype;
                        }
                        if (w.config.tempvalue != undefined) {
                            delete w.config.tempvalue;
                        }
                        if (w.config.tempvaluefilt != undefined) {
                            delete w.config.tempvaluefilt;
                        }
                        if (w.config.tempvaluesec != undefined) {
                            delete w.config.tempvaluesec;
                        }
                    });

                    tempConfig.widgets = $scope.CurrentBoard.widgets;
                    tempConfig.style = $scope.colstyle;
                    tempConfig.colorScheme = WallboardStorage.getTheme($scope.CurrentBoard.id);

                    updateWallboard($scope.CurrentBoard.id, "config", {"config": tempConfig});
                }

                setTimeout(function () {
                    $scope.changeColorDial();
                }, 500);
            }

            // cancel edit mode
            $scope.cancelEditMode = function () {
                WallboardStorage.remove($scope.CurrentBoard.editId);
                $scope.CurrentBoard.widgets = JSON.parse(JSON.stringify($scope.tempboard));
                $('#body').removeClass("editmod");
                $('.empty').each(function () {
                    $(this).removeClass("edit");
                });
                $scope.editmode = false;

                if ($scope.CurrentBoard.id == undefined) {
                    if ($scope.Wallboards.length > 0) {
                        $scope.loadConfig($scope.Wallboards[0].id);
                    }
                    else {
                        $scope.createNewWB();
                    }
                }

                $scope.loadWallboards();
                //    $scope.$broadcast('offEditMode');
                $scope.reBuild();
            }

            //cancel edit widget
            $scope.cancelEditWidget = function () {
                if($scope.tempboard2 != undefined){
                    $scope.CurrentBoard.widgets = JSON.parse(JSON.stringify($scope.tempboard2));
                }
                $scope.reBuild();
            }

            // open colors and styles dialog
            $scope.onColorDial = function () {
                $scope.show_colordial = true;
                tempColors = JSON.parse(JSON.stringify($scope.colstyle));
                $('.widget-colordial').show();
                $('.widget-colordial').draggable({
                    //containment: "parent",
                    scroll: false
                });

                $('.widget-colordial .bgColor').each(function () {
                    $(this).parent().find('button').css("background-color", "#" + $(this).val())
                })
            };

            // ok colors and styles dialog
            $scope.okColorDial = function () {
                $scope.show_colordial = false;
                $scope.changeColorDial();
            };

            // apply colors and styles
            $scope.changeColorDial = function () {
                // $('#body').css("background-color", "#"+$scope.colstyle.bgcolor);
                // $('.widget').css("background-color", "#"+$scope.colstyle.cardcolor);
                // $('.widget').css("border", ''+$scope.colstyle.cardborder+' #'+$scope.colstyle.cardbordercolor);
                // $('.widget .ng-scope > .widget-heading').css("color", "#"+$scope.colstyle.fontcolor);
                // $('.widget .ng-scope > .widget-content').css("color", "#"+$scope.colstyle.fontcolor);
                //
                // $('#wall-name').css("color", "#"+$scope.colstyle.fontcolor);
                // $('#wall-title-bot').css("color", "#"+$scope.colstyle.fontcolor);
                $('#apply_config').css("fill", "#" + $scope.colstyle.fontcolor);
                $('#cancel_config').css("fill", "#" + $scope.colstyle.fontcolor);
                // $('.wall-title-arrow').css("color", "#"+$scope.colstyle.fontcolor);
                // $('.wall-title-menu').css("color", "#"+$scope.colstyle.fontcolor);
                //
                // $('.widget .widget-content td, th').css("border-bottom", ''+$scope.colstyle.underline+' #'+$scope.colstyle.underlinecolor);
            };

            // off colors and styles dialog
            $scope.offColorDial = function () {
                $scope.show_colordial = false;
                $scope.colstyle = tempColors;
                $scope.changeColorDial();
            };

            $scope.getWidgetMode = function (widget) {
                return widget.config.mode;
            };

            // widget size and style
            $scope.getWidgetStyle = function (widget, theme) {
                var w = $('.wall-field').width();
                var h = $('.wall-field').height();

                var top = widget.config.y * (h / 12) + $scope.padding;
                var left = widget.config.x * (w / 12) + $scope.padding;
                var width = widget.config.width * (w / 12) - $scope.padding * 2;
                var height = widget.config.height * (h / 12) - $scope.padding * 2;
                var style = _.assign({
                    position: 'absolute',
                    top: '' + top + 'px',
                    left: '' + left + 'px',
                    width: '' + width + 'px',
                    height: '' + height + 'px',
                }, theme.FrameBorderStyle, theme.FrameBackground, theme.FrameBorderType);

                if (widget.config.mode == "alerted") {
                    style = {
                        position: 'absolute',
                        top: '' + top + 'px',
                        left: '' + left + 'px',
                        width: '' + width + 'px',
                        height: '' + height + 'px',
                        'background-color': '#' + $scope.colstyle.alertbg,
                        'border-color': '#' + $scope.colstyle.alertborder,
                        color: '#' + $scope.colstyle.alertfont,
                        border: '' + $scope.colstyle.cardborder + ' #' + $scope.colstyle.alertborder
                    }
                }

                //perfomance may be very low, rebild this later
                //$('#'+widget.config.id+' .widget-content td').css("border-bottom", ''+$scope.colstyle.underline+' #'+$scope.colstyle.underlinecolor);

                return style;
            }

            // load list WB from server
            $scope.loadWallboards = function () {
                $scope.ddWallSelectOptions = [];
                var flag = 0;
                var flagDef = 0;
                var tempDiv = {
                    text: 'Global Wallboards:',
                    divider: true
                };
                var personalDiv = {
                    text: 'Personal Wallboards:',
                    divider: true
                };
                StatsApi.loadWallboards()
                    .then(function (response) {
                        $scope.Wallboards = response.data.wallboards;
                        $scope.Wallboards.sort(compareBool);

                        if ($scope.Wallboards.length <= 0) {
                            $scope.createNewWB();
                        }
                        $scope.ddWallSelectOptions.push(personalDiv);
                        $scope.Wallboards.forEach(function (w) {
                            if (w.is_global && !flag) {
                                flag = 1;
                                $scope.ddWallSelectOptions.push(tempDiv);
                            }
                            var tempWB = {
                                text: w.name,
                                value: w.id
                            };
                            $scope.ddWallSelectOptions.push(tempWB);
                        });


                        if (!flagFirstLoad && $scope.Wallboards.length > 0) {
                            flagFirstLoad = 1;
                            $scope.Wallboards.forEach(function (w) {
                                if (w.is_default && !flagDef) {
                                    flagDef = 1;
                                    $scope.loadConfig(w.id);
                                }
                            });
                            if (!flagDef) {
                                $scope.loadConfig($scope.Wallboards[0].id);
                            }
                        }

                    }, function (response) {
                        // error
                        console.log(response);
                    })
            }

            //load WB on screen by ID
            $scope.loadConfig = function (id) {
                if ($scope.CurrentBoard.id != undefined && !$scope.CurrentBoard.is_global && !flagDelWB) {
                    updateWallboard($scope.CurrentBoard.id, "is_default", {"is_default": false});
                }
                flagDelWB = false;
                clearTimeout(getDataTimeout);
                StatsApi.loadConfig(id)
                    .then(function (response) {
                        $scope.CurrentBoard.id = response.data.id;
                        $scope.CurrentBoard.name = response.data.name;
                        $window.parent.document.title = response.data.name;
                        $scope.CurrentBoard.is_global = response.data.is_global;
                        $scope.CurrentBoard.is_default = true;
                        $scope.CurrentBoard.widgets = response.data.config.widgets;

                        if ($scope.CurrentBoard.id != undefined && !$scope.CurrentBoard.is_global) {
                            updateWallboard($scope.CurrentBoard.id, "is_default", {"is_default": true});
                        }

                        //switch to globalmode
                        if ($scope.CurrentBoard.is_global) {
                            pushWB();
                        }
                        else {
                            pullWB();
                        }


                        $scope.reBuild();
                        $scope.$emit('RecreateSubscription');
                        WallboardStorage.add(response.data, {merge: true});
                        $timeout(function() {$window.dispatchEvent(new Event("resize"));}, 100);
                    }, function (response) {
                        // error
                        console.log(response);
                    })
            }

            // select next WB
            $scope.setWallboardPlus = function () {
                console.info('ACTION', 'next WB');
                var id = $scope.CurrentBoard.id;
                var indexToSet = $scope.Wallboards.findIndex(obj => obj.id == id);
                if (indexToSet < $scope.Wallboards.length - 1) {
                    indexToSet++;
                } else {
                    indexToSet = 0;
                }
                $scope.loadConfig($scope.Wallboards[indexToSet].id);

            }

            $scope.hideArrows = function () {
              $('#wall-title-rig').css("opacity", 0);
              $('#wall-title-lef').css("opacity", 0);
              $('#wall-title-bot').css("opacity", 0);
            }

            $scope.showArrows = function () {
              $('#wall-title-rig').css("opacity", 100);
              $('#wall-title-lef').css("opacity", 100);
              $('#wall-title-bot').css("opacity", 100);
            }
            // select previous WB
            $scope.setWallboardMinus = function () {
                console.info('ACTION', 'prev WB');
                var id = $scope.CurrentBoard.id;
                var indexToSet = $scope.Wallboards.findIndex(obj => obj.id == id);
                if (indexToSet > 0) {
                    indexToSet--;
                } else {
                    indexToSet = $scope.Wallboards.length - 1;
                }
                $scope.loadConfig($scope.Wallboards[indexToSet].id);

            }

            // load WB from list
            $scope.changeWall = function (sel) {
                $scope.loadConfig(sel.value);
            }

            // WB menu options
            $scope.menuWall = function (sel) {
                switch (sel.value) {
                    case 'edit':
                        $scope.onEditMode();
                        break;
                    case 'new':
                        $scope.createNewWB();
                        break;
                    case 'dublicate':
                        createWallboard();
                        break;
                    case 'delete':
                        $scope.show_del = true;
                        $('.widget-del').show();
                        break;
                    case 'export':
                        $scope.downloadConf();
                        break;
                    case 'import':
                        var fileInput = document.getElementById("fileInput");
                        fileInput.click();
                        break;
                    case 'push':
                        if ($scope.CurrentBoard.is_global != true) {
                            updateWallboard($scope.CurrentBoard.id, "is_global", {"is_global": true});
                            $scope.CurrentBoard.is_global = true;
                            pushWB();
                        }
                        break;
                    case 'pull':
                        if ($scope.CurrentBoard.is_global != false) {
                            updateWallboard($scope.CurrentBoard.id, "is_global", {"is_global": false});
                            $scope.CurrentBoard.is_global = false;
                            pullWB();
                        }
                        break;
                    case 'logout':
                        StatsApi.logout()
                            .then(function(){
                                console.info('logout');
                                $window.location.reload();
                            }, function(){
                                console.warn('logout error');
                            });
                        //subscription = false;
                        $timeout.cancel(getDataTimeout);
                        emptyData();
                        break;
                    default:
                        console.log("Error Command!");
                }
            }

            // ok delete WB
            $scope.DelWB = function () {
                if ($scope.CurrentBoard.id != undefined) {
                    deleteWallboard($scope.CurrentBoard.id);
                }
            }
            // cancel delete WB
            $scope.cancDelWB = function () {
                $scope.show_del = false;
            }

            // create new WB
            $scope.createNewWB = function () {
                $scope.CurrentBoard.id = undefined;
                $scope.CurrentBoard.name = "New Wallboard";
                $scope.CurrentBoard.is_global = false;
                $scope.CurrentBoard.is_default = true;
                $scope.emptyDefaultBoard();
                $scope.CurrentBoard.widgets = $scope.NewBoard.widgets;
                $scope.reBuild();
                $scope.onEditMode();
            }

            $scope.createWB = function () {
                createWallboard();
            }

            // input file config WB
            $scope.processFiles = function (files) {
                var file = files[0];
                var reader = new FileReader();
                var wb = {};
                reader.onload = function (e) {
                    wb = JSON.parse(e.target.result);

                    $scope.CurrentBoard.id = undefined;
                    $scope.CurrentBoard.name = wb.name;
                    $scope.CurrentBoard.is_global = false;
                    $scope.CurrentBoard.is_default = true;
                    $scope.CurrentBoard.widgets = wb.config.widgets;
                    $scope.colstyle = wb.config.style;
                    $scope.changeColorDial();
                    $scope.reBuild();
                    $scope.onEditMode();

                };
                reader.readAsText(file);
            };

            // export config WB to file
            $scope.downloadConf = function () {
                var conf = {};
                conf.config = {};
                conf.config.widgets = [];
                conf.config.widgets = $scope.CurrentBoard.widgets;
                conf.name = $scope.CurrentBoard.name;
                conf.is_global = $scope.CurrentBoard.is_global;
                conf.is_default = $scope.CurrentBoard.is_default;
                conf.config.widgets.forEach(function (w) {
                    w.data = undefined;
                });
                conf.config.style = $scope.colstyle;
                conf.config.colorScheme = WallboardStorage.getTheme($scope.CurrentBoard.id);

                var json = angular.toJson(conf);
                var file = new File([json], "config.json", {type: "text/json;charset=utf-8"});
                saveAs(file);
            }

            // rebuild WB
            $scope.reBuild = function (config) {
                console.info('ACTION', 'REBUILD');

                for (var i = 0; i < 12; i++) {
                    for (var j = 0; j < 12; j++) {
                        $scope.emptycells[i][j].status = "empty";
                    }
                }

                $scope.CurrentBoard.widgets.forEach(function (widget) {
                    widget.mode = $scope.getWidgetMode(widget);

                    for (var i = widget.config.y; i < (widget.config.y + widget.config.height); i++) {
                        for (var j = widget.config.x; j < (widget.config.x + widget.config.width); j++) {
                            $scope.emptycells[i][j].status = "selected";
                        }
                    }
                });

                if (config) {
                    setTimeout(function () {
                        //console.log($('#'+config.id+' .widget-heading .settings-edit').css("color"));
                        $('#' + config.id + ' .widget-heading .settings-edit').click();
                    }, 1000);
                }
                var board = angular.element(document.querySelector(".board"));
                board.remove();

                var body = angular.element(document.querySelector(".board-ancer"));

                var newBoard = angular.element("<div ng-include=\"'partials/board.html'\"></div>");

                var compileFn = $compile(newBoard);
                compileFn($scope);

                body.after(newBoard);
                $timeout(function() {$window.dispatchEvent(new Event("resize"));}, 100);
            };

            // STEP: Controller subscribe

            // delete widget
            $scope.$on('delWidg', function (event, config) {
                for (var i = config.y; i < (config.y + config.height); i++) {
                    for (var j = config.x; j < (config.x + config.width); j++) {
                        //            $('#'+$scope.emptycells[i][j].id).css("background-color", "white");
                        $scope.emptycells[i][j].status = "empty";
                    }
                }

                var i = 1;
                var indexToRemove = $scope.CurrentBoard.widgets.findIndex(obj => obj.config.id == config.id);
                if ($scope.CurrentBoard.widgets[indexToRemove].config.type != "empty") {
                    $scope.addWidgetData.del.push($scope.CurrentBoard.widgets[indexToRemove]);
                }

                $scope.CurrentBoard.widgets.splice(indexToRemove, 1);

                $scope.CurrentBoard.widgets.forEach(function (w) {
                    w.config.id = i.toString();
                    i++;
                });
                $scope.$emit('RecreateSubscription');
            })

            $scope.$on('Rebuild', function (event, config) {
                $scope.reBuild(config);
            })

            // event edit mode on from widget
            $scope.$on('onEditModeUp', function (event, str) {
                $scope.onEditMode(str);
                //console.log(str);
            });

            // event edit mode off from widget
            $scope.$on('cancelEditModeUp', function () {
                $scope.cancelEditWidget();
            });

            //event recreate subscription
            $scope.$on('RecreateSubscription', function () {
                StatsApi.deleteSubscription().finally(function () { // TODO: change to 'then' when server fix is ready
                    subscription = false;
                    createSubscription();
                });
            })

            // STEP: Global subscribe

            //resize window
            $(window).resize(function () {
                getSizes();
                $scope.CurrentBoard.widgets.forEach(function (w) {

                    var top = w.config.y * ($scope.windowH / 12) + $scope.padding;
                    var left = w.config.x * ($scope.windowW / 12) + $scope.padding;
                    var width = w.config.width * ($scope.windowW / 12) - $scope.padding * 2;
                    var height = w.config.height * ($scope.windowH / 12) - $scope.padding * 2;

                    $('#' + w.config.id).css("top", top + "px");
                    $('#' + w.config.id).css("left", left + "px");
                    $('#' + w.config.id).height(height);
                    $('#' + w.config.id).width(width);
                    if(w.config.type == 'single'){
                      if(height <= width){
                        $('#' + w.config.id).css("font-size", height + "%");
                      } else {
                        $('#' + w.config.id).css("font-size", width + "%");
                      }
                    }
                });
            });

            // STEP: Helpers

            // get main sizes
            function getSizes() {
                var w = $('.wall-field').width();
                var h = $('.wall-field').height();
                $scope.widthCell = (w / 12);
                $scope.heightCell = (h / 12);
                $scope.padding = 10;
                $scope.windowW = w;
                $scope.windowH = h;
            }

            function bootstrap() {
                $http.get('config2.json').then(function (response) {
                    $scope.CurrentBoard.widgets = response.data.widgets;

                    $scope.CurrentBoard.widgets.forEach(function (widget) {
                        for (var i = widget.config.y; i < (widget.config.y + widget.config.height); i++) {
                            for (var j = widget.config.x; j < (widget.config.x + widget.config.width); j++) {
                                //$('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }
                    });

                    $scope.CurrentBoard.name = "My New Wallboard";
                    $scope.CurrentBoard.is_global = "false";
                    $scope.CurrentBoard.is_default = "false";
                }, function (response) {
                    // error
                    console.error('Failed to load config.json');
                })
            }

            // create subscription
            function createSubscription() {
                StatsApi.createSubscription(createSubscriptionRequest())
                    .then(function (response) {
                        subscription = true;
                        $scope.$on('$destroy', function () {
                            StatsApi.deleteSubscription();

                        })
                        getData();
                    }, function (response) {
                        // error
                        $timeout(createSubscription, SUBSCRIBE_DELAY);
                    })
            }

            function createSubscriptionRequest() {
                var req = {
                }
                var tempAgent = {};
                var tempService = {};
                var tempLastName = {};
                var out_calls_handled_per_dayDemo = {
                    statName: "out_calls_handled_per_day",
                    id: "98"
                };

                $scope.CurrentBoard.widgets.forEach(function (w) {
                    if (w.config.subscription && w.config.subscription.type) {
                        var widgetSubscription = {};
                        if (w.config.subscription.type === 'stats_total' || w.config.subscription.type === 'gauge') {
                            widgetSubscription['stats_totals'] = [];
                            widgetSubscription['stats_totals_service_ids'] = w.config.subscription.service_ids;
                            w.config.subscription.req.forEach(function (v) {
                                if (widgetSubscription.stats_totals.indexOf(v) === -1) {
                                    widgetSubscription.stats_totals.push(v);
                                }
                            })

                        } else if (w.config.subscription.type === 'agent_grid' || w.config.subscription.type === 'summary') {
                            widgetSubscription['agent_grids'] = [];
                            tempAgent = JSON.parse(JSON.stringify(w.config.subscription.req));
                            for (var i = 0; i < tempAgent.columns.length; i++) {
                                if (tempAgent.columns[i].dir != undefined) {
                                    tempAgent.columns[i].dir = undefined;
                                }

                                //delete this after server fix!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                                if (tempAgent.columns[i].coltitle != undefined) {
                                    tempAgent.columns[i].coltitle = undefined;
                                }
                                // specific options for server
                                if (tempAgent.columns[i].statName == "name") {
                                    tempAgent.columns[i].statName = "first_last_name";
                                }

                                if (tempAgent.columns[i].statName == "state_ic") {
                                    tempAgent.columns[i].statName = "acd_state";
                                }
                            }
                            widgetSubscription.agent_grids.push(tempAgent);
                        } else if (w.config.subscription.type === 'service_grid') {
                            widgetSubscription['service_grids'] = [];
                            tempService = JSON.parse(JSON.stringify(w.config.subscription.req));
                            tempService.columns.forEach(function (v) {
                                if (v.dir != undefined) {
                                    v.dir = undefined;
                                }
                                if (v.coltitle != undefined) {
                                    v.coltitle = undefined;
                                }
                            });
                            widgetSubscription.service_grids.push(tempService);

                        } else if (w.config.subscription.type === 'chat_messages') {
                            widgetSubscription['chat_messages'] = w.config.subscription.req;
                        }
                        req[w.config.id] = widgetSubscription;
                    }
                })

                return req;
            }

            function getData() {
                StatsApi.getData()
                    .then(function (response) {
                        try {
                            processData(response.data);
                            processAlerts();
                        } catch (e) {
                            console.error(e);
                        }
                        clearTimeout(getDataTimeout);
                        getDataTimeout = setTimeout(getData, GET_DATA_DELAY);

                    }, function (response) {
                        // error
                        emptyData();
                        subscription = false;
                        $scope.$emit('RecreateSubscription');
                    })
            }

            function processData(data) {
                $scope.CurrentBoard.widgets.forEach(function (w) {
                    widgetData = data ? data[w.config.id] : {};
                    if (w.config.subscription && w.config.subscription.type) {
                        if (w.config.type === 'single') {
                            processStatsTotalData(w, widgetData);

                        } else if (w.config.subscription.type === 'agent_grid') {
                            processAgentGridData(w, widgetData);

                        } else if (w.config.subscription.type === 'service_grid') {
                            processServiceGridData(w, widgetData);

                        } else if (w.config.subscription.type === 'chat_messages') {
                            processChatMessagesData(w, widgetData);

                        } else if (w.config.subscription.type === 'summary') {
                            processSummaryData(w, widgetData);
                        } else if (w.config.type === 'gauge') {
                            // w.data = [rnd(200)];
                            if(widgetData != undefined && !angular.equals(widgetData,{})) {
                              w.data = [widgetData.stats_totals[w.config.subscription.req[0]]];
                            }
                        }
                    }
                });
            }

            function processAlerts() {
                $scope.CurrentBoard.widgets.forEach(function (w) {

                    if (w.config.subscription && w.config.subscription.type) {
                        if(w.config.type == 'single' && w.config.alertThreshold != undefined) {
                          var value = $parse(w.config.value)(w.data);
                          if(value >= w.config.alertThreshold){
                            if (soundAlertTimer == undefined) {
                                soundAlertTimer = setInterval(myTimer, 30000);
                                myTimer();
                            }
                            w.config.mode = "alerted";
                            return;
                          } else if (soundAlertTimer != undefined) {
                              clearInterval(soundAlertTimer);
                          }
                        }
                        w.config.mode = "";

                    }
                })
            }

            function processSummaryData(widget, widgetData) {
                var data = {
                    'not_ready': 0,
                    'ready': 0,
                    'busy': 0,
                    'after_call_work': 0
                };
                if (widgetData != null && widgetData.agent_grids != null) {
                    widgetData.agent_grids.forEach(function (d) {
                        d.values.forEach(function (val) {
                            data[val['1']]++;
                        });
                    });
                }
                widget.data = [
                    ['Busy', data['busy']],
                    ['Ready', data['ready']],
                    ['ACW', data['after_call_work']],
                    ['NR', data['not_ready']]
                ];
                widget.data.sort(function(e1, e2) {
                    return e2[1] - e1[1];
                })
            }

            function processStatsTotalData(widget, widgetData) {
                widget.config.subscription.req.forEach(function (k) {
                    widget.data = widget.data || {};

                    if (widgetData && widgetData.stats_totals) {
                        widget.data[k] = widgetData.stats_totals[k];
                    }
                });
            }

            function processAgentGridData(widget, widgetData) {
                if (widgetData != null && widgetData.agent_grids != null) {
                    processGridData(widget, widgetData.agent_grids);
                }
            }

            function toHHMMSS (seconds) {
                var sec_num = seconds;
                var hours   = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours   < 10) {hours   = "0"+hours;}
                if (minutes < 10) {minutes = "0"+minutes;}
                if (seconds < 10) {seconds = "0"+seconds;}
                return hours+':'+minutes+':'+seconds;
            }

            function processServiceGridData(widget, widgetData) {
                if (widgetData != null && widgetData.service_grids != null) {
                    processGridData(widget, widgetData.service_grids);
                }
            }

            function processGridData(widget, data_grids) {
                var req_id = widget.config.subscription.req.id;
                var nameDetected = 0;
                widget.config.subscription.req.columns.forEach(function (k) {
                 if(widget.config.temptype == "agent_grid" && StatsDef.dataGridAgent[k.statName].format == "duration" ||
                     widget.config.temptype == "service_grid" && StatsDef.dataGridService[k.statName].format == "duration"){
                    var tempId = parseInt(k.id) + nameDetected;
                    data_grids.forEach(function (d) {
                        if (d.id == widget.config.subscription.req.id) {
                            d.values.forEach(function (val) {
                                if (val[tempId] == null) {
                                    val[tempId] = 0;
                                }
                                val[tempId] = toHHMMSS(val[tempId]);
                            });
                        }
                    });
                  }

                  if(widget.config.temptype == "agent_grid" && StatsDef.dataGridAgent[k.statName].format == "percent" ||
                     widget.config.temptype == "service_grid" && StatsDef.dataGridService[k.statName].format == "percent"){
                    var tempId = parseInt(k.id) + nameDetected;
                    data_grids.forEach(function (d) {
                        if (d.id == widget.config.subscription.req.id) {
                            d.values.forEach(function (val) {
                                if (val[tempId] == null) {
                                    val[tempId] = 0;
                                }
                                val[tempId] = val[tempId] + " %";
                            });
                        }
                    });
                  }
                });
                for (var i = 0; data_grids && i < data_grids.length; i++) {
                    if (data_grids[i].id === req_id) {
                        if (!angular.isDefined(widget.config.columns)) {
                            widget.data = data_grids[i].values.map(function (obj) {
                                return $.map(obj, function (prop) {
                                    //console.log(prop);
                                    if (prop == null) {
                                        return "0";
                                    }
                                    else return [prop];
                                })
                            })
                        } else {
                            var view_columns = widget.config.columns;
                            widget.data = data_grids[i].values.map(function (obj) {
                                return view_columns.map(function (exp) {
                                    var new_obj = {};
                                    Object.keys(obj).map(function (k) {
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

            function processChatMessagesData(widget, widgetData) {
                if (widgetData && widgetData.chat_messages) {
                    widget.data = widgetData.chat_messages.map(function (v) {
                        return v.content;
                    });
                } else {
                    widget.data = [];
                }
            }

            function emptyData() {
                $scope.CurrentBoard.widgets.forEach(function (w) {
                    w.data = undefined;
                })
            }

            // update WB
            function updateWallboard(id, name, cfg) {
                StatsApi.updateWallboard(id, name, cfg)
                    .then(function (response) {
                        $scope.loadWallboards();
                    }, function (response) {
                        console.log(response);
                    })
            }

            // create new WB
            function createWallboard() {
                StatsApi.createWallboard(createWallboardRequest())
                    .then(function (response) {
                        console.log(response);
                        if (response.status == 201) {
                            $scope.CurrentBoard.id = response.data.id;
                            $scope.loadConfig(response.data.id);
                        }
                        $scope.loadWallboards();

                    }, function (response) {
                        // error
                        console.log(response);
                        //$timeout(createWallboard, SUBSCRIBE_DELAY);
                    })
            }

            function createWallboardRequest() {
                var req = {
                    name: $scope.CurrentBoard.name,
                    is_global: false,
                    is_default: true,
                    config: {
                        widgets: [],
                        style: {}
                    }
                };
                //req.config.widgets = [];
                var tempArr = [];
                req.name = $scope.CurrentBoard.name;
                req.is_global = false;
                req.is_default = true;

                $scope.CurrentBoard.widgets.forEach(function (w) {
                    if (w.config.temptype != undefined) {
                        delete w.config.temptype;
                    }
                    if (w.config.tempvalue != undefined) {
                        delete w.config.tempvalue;
                    }
                    if (w.config.tempvaluefilt != undefined) {
                        delete w.config.tempvaluefilt;
                    }
                    if (w.config.tempvaluesec != undefined) {
                        delete w.config.tempvaluesec;
                    }

                    //tempArr.push(w.config);
                });
                tempArr = $scope.CurrentBoard.widgets;

                req.config.widgets = tempArr;

                req.config.style = $scope.colstyle;
                if($scope.CurrentBoard.id != undefined){
                  req.config.colorScheme = WallboardStorage.getTheme($scope.CurrentBoard.id);
                } else {
                  req.config.colorScheme = $scope.getCurrentTheme();
                }

                return req;
            }

            // delete WB
            function deleteWallboard(id) {
                var indexToSet = $scope.Wallboards.findIndex(obj => obj.id == id);
                StatsApi.deleteWallboard(id)
                    .then(function (response) {
                        console.log(response);
                        console.log(indexToSet);
                        $scope.show_del = false;
                        flagDelWB = true;
                        if ($scope.Wallboards.length > 0) {
                            if (indexToSet > 0) {
                                $scope.loadConfig($scope.Wallboards[indexToSet - 1].id);
                            } else {
                                $scope.loadConfig($scope.Wallboards[0].id);
                            }
                        } else {
                            $scope.createNewWB();
                        }

                        $scope.loadWallboards();

                    }, function (response) {
                        console.log(response);
                    })
            }

            // settings for global WB
            function pushWB() {
                $scope.ddMenuSelectOptions[1].divider = true;
                $scope.ddMenuSelectOptions[3].divider = true;
                $scope.ddMenuSelectOptions[6].divider = true;
                $scope.ddMenuSelectOptions[7].divider = false;
                $scope.globalmode = true;
                $('#body').addClass("global");
            }

            // settings for local WB
            function pullWB() {
                $scope.ddMenuSelectOptions[1].divider = false;
                $scope.ddMenuSelectOptions[3].divider = false;
                $scope.ddMenuSelectOptions[6].divider = false;
                $scope.ddMenuSelectOptions[7].divider = true;
                $scope.globalmode = false;
                $('#body').removeClass("global");
            }

            // select empty cells for create widget
            function onSelect(startX, startY, stopX, stopY) {
                if (!$scope.editmode) return;
                if (stopX > startX && stopY > startY) {
                    var selectFlag = 0;
                    for (var i = startY; i <= stopY; i++) {
                        for (var j = startX; j <= stopX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = startY; i <= stopY; i++) {
                            for (var j = startX; j <= stopX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }
                        var wid = stopX - startX + 1;
                        var hei = stopY - startY + 1;
                        createWidget(startX, startY, wid, hei);
                    }
                }
                if (stopX < startX && stopY > startY) {
                    var selectFlag = 0;
                    for (var i = startY; i <= stopY; i++) {
                        for (var j = stopX; j <= startX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = startY; i <= stopY; i++) {
                            for (var j = stopX; j <= startX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }
                        var wid = -stopX + startX + 1;
                        var hei = stopY - startY + 1;
                        createWidget(stopX, startY, wid, hei);
                    }
                }
                if (stopX > startX && stopY < startY) {
                    var selectFlag = 0;
                    for (var i = stopY; i <= startY; i++) {
                        for (var j = startX; j <= stopX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = stopY; i <= startY; i++) {
                            for (var j = startX; j <= stopX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }
                        var wid = stopX - startX + 1;
                        var hei = -stopY + startY + 1;
                        createWidget(startX, stopY, wid, hei);
                    }
                }
                if (stopX < startX && stopY < startY) {
                    var selectFlag = 0;
                    for (var i = stopY; i <= startY; i++) {
                        for (var j = stopX; j <= startX; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = stopY; i <= startY; i++) {
                            for (var j = stopX; j <= startX; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }
                        var wid = -stopX + startX + 1;
                        var hei = -stopY + startY + 1;
                        createWidget(stopX, stopY, wid, hei);
                    }
                }

                if (stopX == startX && stopY == startY) {
                    if (startX == ($scope.emptycells[0].length - 1) || startY == ($scope.emptycells.length - 1)) {
                        return;
                    }
                    var selectFlag = 0;
                    for (var i = startY; i <= startY + 1; i++) {
                        for (var j = startX; j <= startX + 1; j++) {
                            if ($scope.emptycells[i][j].status != "empty") selectFlag = 1;
                        }
                    }
                    if (!selectFlag) {
                        for (var i = startY; i <= startY + 1; i++) {
                            for (var j = startX; j <= startX + 1; j++) {
                                //    $('#'+$scope.emptycells[i][j].id).css("background-color", "red");
                                $scope.emptycells[i][j].status = "selected";
                            }
                        }
                        //minimal size widget
                        var wid = 2;
                        var hei = 2;
                        createWidget(startX, startY, wid, hei);
                    }
                }
            }

            // create widget
            function createWidget(X, Y, width, height) {
                var newWidget = {};
                newWidget.config = {};
                newWidget.config.type = "empty";
                newWidget.config.title = "";
                newWidget.config.x = X;
                newWidget.config.y = Y;
                newWidget.config.width = width;
                newWidget.config.height = height;
                newWidget.config.show_settings = true;
                newWidget.config.id = ($scope.CurrentBoard.widgets.length + 1).toString();
                newWidget.mode = $scope.getWidgetMode(newWidget);
                $scope.CurrentBoard.widgets.push(newWidget);
            }

            //sort WB to global/local
            function compareBool(a, b) {
                if (a.is_global > b.is_global) return 1;
                if (a.is_global < b.is_global) return -1;
            }

            // STEP: RUN
            $scope.loadWallboards();

            $scope.changeColorDial();

            $('#wall-name').css("color", "#" + $scope.colstyle.fontcolor);

            getSizes();
            bootstrap();

        }])

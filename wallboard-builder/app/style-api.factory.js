angular.module('app')
    .factory('StyleApi', function () {

        var DEFAULT_SHCHEME = 'black';
        var style = {
            light: {
                Background: {
                    background: 'white'
                },
                FrameBorderStyle: {
                    border: '1px solid #e6e6e6'
                },
                FrameBorderType: {},
                FrameBackground: {
                    background: '#fff'
                },
                WidgetHeaderHeight: {
                    height: '30px'
                },
                WidgetHeaderLine: {
                    "border-bottom": '1px solid #e6e6e6'
                },
                WidgetHeaderBackground: {
                    background: '#fcfcfc'
                },
                WidgetHeaderFont: {
                    'font-family': 'Muli',                    
                    'font-size': '16px',
                    'font-weight': '400'
                },
                WidgetHeaderFontColor: {
                    color: '#000'
                }, 
                WidgetListLine: {
                    border: '1px solid #4c4c4c'
                },
                WidgetBodyMainFont: {
                    'font-family': 'Muli',
                    color: '#32343c'
                },
                WidgetBodySecondFont: {
                    'font-family': 'Muli',
                    color: '#32343c'
                },
                WidgetListHeaderFont: {
                    'font-family': 'Muli',
                    color: '#000',
                    'font-weight': '700'
                },
                WidgetListBackground: {
                    background: '#f8f9f9'
                },
                WidgetListBackgroundSecond: {
                    background: '#fff'
                },
                WidgetListItemFont: {
                    'font-family': 'Muli',
                    color: '#000'
                },
                WidgetListColumnDivider: {
                    'border-left': '1px solid #4c4c4c'
                },
                WidgetDonutPie: {
                    fontFamily: 'Muli',
                    color: '#848585'
                },
                WidgetDonutBorder: {
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                WidgetGauge: {
                    color: '#848585'
                },
                WidgetHeaderIcons: {
                    fill: '#e6e6e6'
                },
                WidgetHeaderIconsHover: {
                    fill: '#27b5e1'
                }
            },
            black: {
                Background: {
                    background: 'black'
                },
                FrameBorderStyle: {
                    border: 'none'
                },
                FrameBorderType: {},
                FrameBackground: {
                    background: '#212121'
                },
                WidgetHeaderHeight: {
                    height: '30px'
                },
                WidgetHeaderLine: {},
                WidgetHeaderBackground: {
                    background: '#2b2b2b'
                },
                WidgetHeaderFont: {
                    'font-family': 'Muli',                    
                    'font-size': '16px',
                    'font-weight': 'lighter'
                },
                WidgetHeaderFontColor: {
                    color: '#b1b1b1',
                }, 
                WidgetListLine: {
                    "border-bottom": '1px solid #4c4c4c'
                },
                WidgetBodyMainFont: {
                    'font-family': 'Muli',
                    color: '#fff'
                },
                WidgetBodySecondFont: {
                    'font-family': 'Muli',
                    color: '#fff'
                },
                WidgetListHeaderFont: {
                    'font-family': 'Muli',
                    color: '#fff',
                    'font-weight': '700'
                },
                WidgetListBackground: {
                    background: '#2b2b2b'
                },
                WidgetListBackgroundSecond: {
                    background: '#212121'
                },
                WidgetListItemFont: {
                    'font-family': 'Muli',
                    color: '#fff'
                },
                WidgetListColumnDivider: {
                    'border-left': '1px solid #4c4c4c'
                },
                WidgetDonutPie: {
                    fontFamily: 'Muli',
                    color: '#fff'
                },
                WidgetDonutBorder: {
                    borderWidth: 2,
                    borderColor: '#fff'
                },
                WidgetGauge: {                    
                    color: '#fff'
                },
                WidgetHeaderIcons: {
                    fill: '#b1b1b1'
                },
                WidgetHeaderIconsHover: {
                    fill: '#27b5e1'
                }
            }
        };

        return {
            getTheme: function (themeId) {
                return style[themeId] || style[DEFAULT_SHCHEME];
            },
        };
    });

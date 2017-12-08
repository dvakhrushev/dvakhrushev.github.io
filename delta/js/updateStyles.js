define(function (require, exports, module) {
    return function (currentWidget, styles) {
        if (styles){
            var key = Object.keys(styles)[0];
 
            var css = applyStyle('', styles[key]);
                    
            var highlightsColor = (currentWidget && currentWidget.color) ? currentWidget.color : "2db2dd";
            var highlightsTextColor = (currentWidget && currentWidget.textColor) ? currentWidget.textColor : "fff";
            
            var fullConf = JSON.parse(sessionStorage.getItem("fullConf"));
            var confParams = JSON.parse(sessionStorage.getItem("confParams"));
            if (fullConf && fullConf.widget && fullConf.widget.chatWidgetStyling){
                highlightsColor = fullConf.widget.chatWidgetStyling.color;
                highlightsTextColor = fullConf.widget.chatWidgetStyling.textColor;            
            }

            if (confParams && confParams.definition && confParams.definition.chatWidgetStyling){
                highlightsColor = confParams.definition.chatWidgetStyling.color;
                highlightsTextColor = confParams.definition.chatWidgetStyling.textColor;            
            }

            var highlightsStyle = [
                '.main-background-color {',
                'background:#' + highlightsColor,
                '}',

                '.tab_active path {',
                'fill:#' + highlightsColor,
                '}',

                '.main-path-color path {',
                'fill:#' + highlightsTextColor,
                '}',

                '.main-fill-color {',
                'fill:#' + highlightsColor,
                '}',

                '.main-color {',
                'color:#' + highlightsColor,
                '}',

                '.widget-border {',
                'border-color:#' + highlightsColor + '!important;',                
                'background:#ffffff',
                '}',

                '.second-background-color {',
                'background:#' + highlightsTextColor,
                '}',

                '.second-fill-color {',
                'fill:#' + highlightsTextColor,
                '}',

                '.second-color {',
                'color:#' + highlightsTextColor,
                '}'

            ].join(' ');



            if(styles.style1){
                var font = '@import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=cyrillic");';
                var fontName = '"Roboto"';
            }
            if(styles.style2){
                var font = '@import url("https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&subset=cyrillic");';
                var fontName = '"PT Sans"';
            }

            var importFonts = [
                font,
                '.base-font {',
                'font-family:' + fontName,
                '}'
            ].join(' ');

            writeStyleSheet([importFonts, highlightsStyle, css].join(' '));
        }
    };

    function applyStyle(prefix, style, hasBase) {

        var appliedStyles = [];
        if (hasBase) {
            appliedStyles.push({name: 'baseFont', className: 'base-font'});
        }

        appliedStyles = appliedStyles.concat([
        {
            name: 'agentMessage',
            className: 'agent-message'
        },
         {
            name: 'contactTabBorder',
            className: 'contact-tab-border'
        }, {
            name: 'contactTabFont',
            className: 'contact-tab-font '
        }, {
            name: 'contentMargin',
            className: 'content-margin'
        }, {
            name: 'dialogShadow',
            className: 'dialog-shadow'
        }, {
            name: 'systemMessage',
            className: 'system-message'
        }, {
            name: 'titleFont',
            className: 'title-font'
        }, {
            name: 'widgetBackground',
            className: 'widget-background'
        }, {
            name: 'widgetBorder',
            className: 'widget-border'
        }, {
            name: 'widgetBorderRadius',
            className: 'widget-border-radius'
        }]);

        return appliedStyles.map(function (part) {
            return [
                prefix,
                '.' + part.className + '{',
                toCssStyle(style[part.name]),
                '}'
            ].join(' ');
        }).join(' ');
    }

    function writeStyleSheet(styles) {
        $('#dynamicStyle').remove();

        var sheet = document.createElement('style');
        sheet.id = 'dynamicStyle';
        sheet.innerHTML = styles;
        document.body.appendChild(sheet);
    }

    function toCssStyle(style) {
        return Object
            .keys(style)
            .map(function (key) {
                var value = style[key];
                return [
                    key,
                    ':',
                    value,
                    ';'
                ].join('');
            })
            .join('');
    }
});
//
// a = {
//     "contentMargin": {"margin": "20px"},
//     "titleFont": {"font-family": "Trebuchet MS", "font-style": "italic", "font-size": "20px", "font-weight": "400"},
//     "contactTabFont": {
//         "font-family": "Trebuchet MS",
//         "font-style": "italic",
//         "font-size": "16px",
//         "font-weight": "400"
//     },
//     "systemMessage": {"background-color": "yellow"},
//     "agentMessage": {"background-color": "#dd352d"},
//     "widgetBorder": {"border-radius": "10px"},
//     "widgetBorderRadius": {"border": "1px solid black"},
//     "contactTabBorder": {"border": "2px solid #dd352d", "border-radius": "3px"},
//     "widgetBackground": {"background": "url('http://www.digiterra.pro/i/background.jpg') center bottom no-repeat"},
//     "baseFont": {
//         "font-family": "Trebuchet MS",
//         "font-style": "normal",
//         "font-size": "16px",
//         "font-weight": "400",
//         "color": "#ffd3d3"
//     },
//     "dialogShadow": {"box-shadow": "2px 2px 5px rgba(0, 0, 0, 0.3);"}
// }

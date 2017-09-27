define(function (require, exports, module) {
    return function (currentWidget, styles, highlights) {
        var contactTabStyle = currentWidget.definition.contactTab.style;
        var contactTabCss = applyStyle('#sp-chat-widget', styles[contactTabStyle]);

        var chatWidgetStyle = currentWidget.definition.chatWidgetStyling.style;
        var chatWidgetCss = applyStyle('#sp-chat-frame', styles[chatWidgetStyle], true);
        var innerChatWidgetCss = applyStyle('.inside-chat-frame-body', styles[chatWidgetStyle], true);
        var proactiveOfferStyle = currentWidget.definition.proactiveOfferStyling.style;
        var proactiveOfferCss = applyStyle('.proactive-offer', styles[proactiveOfferStyle]);

        var highlightsStyle = [
            '.main-background-color {',
            'background:#' + highlights.color,
            '}',

            '.tab_active path {',
            'fill:#' + highlights.color,
            '}',

            '.main-fill-color {',
            'fill:#' + highlights.color,
            '}',

            '.main-color {',
            'color:#' + highlights.color,
            '}',

            '.widget-border{',
            'border-color:#' + highlights.color + '!important',
            '}',

            '.second-background-color {',
            'background:#' + highlights.textColor,
            '}',

            '.second-fill-color {',
            'fill:#' + highlights.textColor,
            '}',

            '.second-color {',
            'color:#' + highlights.textColor,
            '}',

            '.proactive-offer {',
            'font-family: "' + styles[Object.keys(styles)[0]].baseFont['font-family'] + '"',
            '}',
        ].join(' ');


        if(styles.style1){
            var font1 = '@import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i&subset=cyrillic");';
        }
        if(styles.style2){
            var font2 = '@import url("https://fonts.googleapis.com/css?family=PT+Sans:400,400i,700,700i&subset=cyrillic");';
        }

        var importFonts = [
            font1,
            font2
        ].join(' ');

        writeStyleSheet([importFonts, highlightsStyle, contactTabCss, chatWidgetCss, proactiveOfferCss, innerChatWidgetCss].join(' '));
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

define(function (require, exports, module) {

    var getUrlVars = require('client-chat-page/getUrlVars');

    return function () {

        //TODO sessionStorage may not accessible due to Cross Origin Policy
        var conf = JSON.parse(sessionStorage.getItem("confParams"));

        // var urlVars = getUrlVars(window.location.href);

        // var url = window.location.host + window.location.pathname.split('#')[0];

        // if(urlVars.hasOwnProperty("referrer")) {
        //     url = urlVars["referrer"].split('#')[0];
        // }

        // var index = 0;

        // if(window.sessionStorage.getItem("widgetConfIndex") && window.sessionStorage.getItem("sp-chat-snippet")){

        //     var index = window.sessionStorage.getItem("widgetConfIndex");
        //     window.sessionStorage.setItem("confFromOtherPage", true);

        // } 

        // var weights = [];
        // conf.widgets.forEach(function (item, i) {

        //     item.urls.forEach(function (urlItem) {
        //         weights[i] = 0;
        //         var check = true,
        //             urlItemType = {
        //                 path : (urlItem.substring(0,1) == '/') ? 'relative' : 'absolute',
        //                 object : (urlItem.substring(urlItem.length-1,urlItem.length) == '/') ? 'folder' : 'file'
        //             }

        //         if(urlItemType.path == 'absolute' && urlItemType.object == 'file'){
        //             check = (urlItem == url) ? true : false;
        //             weights[i] = 4;
        //         }

        //         if(urlItemType.path == 'absolute' && urlItemType.object == 'folder'){
        //             check = (url.split('/')[0] == urlItem.split('/')[0] && url.indexOf(urlItem)!=-1) ? true : false;
        //             weights[i] = 3;
        //         }

        //         if(urlItemType.path == 'relative' && urlItemType.object == 'file'){
        //             check = (window.location.pathname.split('#')[0] == urlItem && url.indexOf(urlItem)!=-1) ? true : false;
        //             weights[i] = 2;
        //         }

        //         if(urlItemType.path == 'relative' && urlItemType.object == 'folder'){
        //             check = (url.indexOf(urlItem)!=-1) ? true : false;
        //             weights[i] = 1;
        //         }

        //         if (check) {
        //             index = i;
        //             window.sessionStorage.removeItem("confFromOtherPage");
        //         }
        //     });

        //     // if(item.urls.length==0){
        //     //     index = i;
        //     //     window.sessionStorage.removeItem("confFromOtherPage");
        //     // }
        // });
        // window.sessionStorage.setItem("widgetConfIndex",index);


        return conf;
    };
});

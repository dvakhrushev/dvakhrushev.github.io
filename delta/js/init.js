function loadScript(url, callback){

    var script = document.createElement("script")
    script.type = "text/javascript";

    if (script.readyState){  //IE
        script.onreadystatechange = function(){
            if (script.readyState == "loaded" ||
                    script.readyState == "complete"){
                script.onreadystatechange = null;
                callback();
            }
        };
    } else {  //Others
        script.onload = function(){
            callback();
        };
    }

    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}

var chatPath = SERVICE_PATTERN_CHAT_CONFIG.chatPath;
chatPath = (chatPath.substr(chatPath.length - 1) =="/") ? chatPath : chatPath + "/";

loadScript(chatPath + "js/require.js", function(){
    require.config({
    baseUrl: chatPath + "js/",
    paths: {
        "jquery": chatPath + "js/libraries/jquery/jquery-3.2.1.min",
        "perfect-scrollbar": chatPath + "js/libraries/perfect-scrollbar/perfect-scrollbar.min"
    }
  });
  require(['snippet'], function(){});
});


/*___PRODUCT_BUILD___ (___PRODUCT_COMMENTS___) ___PRODUCT_DATE___*/

(function() {

    $.ajaxSetup({cache: true});
    
    $.when(

        // Libraries
        $.getScript("https://tranquil-tor-40147.herokuapp.com/libraries/json2/json2.min.js"),
        $.getScript("https://tranquil-tor-40147.herokuapp.com/libraries/XDomainRequest/jQuery.XDomainRequest.min.js"),

        // Helper functions
        $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/mobileCheck.js"),
        $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/loadScripts.js"),
         $.Deferred(function( deferred ){
            $(deferred.resolve);
        })

    ).done(function(){
        
        $.when(

         // Build functions
            
            //Load variables
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/variables.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/configuration.js"),

            //Initialization functions
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/onInitialize.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/getConfObject.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/checkAvailability.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/handleAvailability.js"),
            
            //TogetherJS functions
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/togetherJsStart.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/togetherJsStop.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/togetherJsSetFollowPeers.js"),
            
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/chatUrl.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/isChatRendered.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/openChat.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/keepOpenedState.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/checkAddFrame.js"),
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/showNotification.js"),

            $.Deferred(function(deferred){
                $(deferred.resolve);
            })

        ).done(function(){
            
            // Load build script and run it
            $.getScript("https://tranquil-tor-40147.herokuapp.com/js/snippet/build.js", function(){
                build(); 
            });

        });
    });
    
})();

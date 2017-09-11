define(function (require, exports, module) {
    return function (session) {
        navigator.geolocation.getCurrentPosition(function (position) {
                session.sendLocation(position.coords.latitude, position.coords.longitude);
            },
            function (failure) {
                alert(failure.message);
            });
    };
});

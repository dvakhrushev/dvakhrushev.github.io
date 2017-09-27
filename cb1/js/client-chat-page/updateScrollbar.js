define(function (require, exports, module) {
    return function () {
        var outer = $('#messages-div-outer');
        var inner = $('#messages-div-inner');
        var ih = inner.height();
        var oh = outer.height();

        outer.perfectScrollbar('update');

        inner.css("bottom", ih > oh ? "auto" : "0");

        inner.css("top", ih > oh ? "0" : "auto");

        if (ih > oh) {
            outer.scrollTop(ih);
        }
    };
});

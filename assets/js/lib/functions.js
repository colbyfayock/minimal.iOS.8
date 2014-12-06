function viewport() {
    var e = window,
        a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ], height : e[ a+'Height' ] };
};

// Device window is < 640px
var isSmall = function() {
    var winW = viewport().width;
    if (winW < 640) {
        return true;
    } else {
        return false;
    }
};

var clearStyles = function(e) {
    var windowWidth = viewport().width;
    if(!isSmall()) {
        $(e).removeAttr("style");
    }
};
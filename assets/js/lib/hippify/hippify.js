/*
 * Hippify - High PPI image swap
 *
 * Copyright 2013, Colby Fayock
 * colbyfayock.com - @colbyfayock
 */
(function(){

    window.hippify = function() {

        var devicePixelRatio, isHippi, isRelative, get2x, swap, swapData, imgArr, ajaxTest;

        devicePixelRatio = window.devicePixelRatio || window.webkitDevicePixelRatio || window.mozDevicePixelRatio;
        isHippi = typeof XMLHttpRequest !== 'undefined' && devicePixelRatio && devicePixelRatio > 1;
        imgArr = Array.prototype.slice.call(document.getElementsByClassName('hippify')) || false;

        ajaxTest = function(url, callback) {
            if (!window.XMLHttpRequest) return;
            var xmlHttpReq = new XMLHttpRequest();

            xmlHttpReq.open('GET', url, true);
            xmlHttpReq.onreadystatechange = function(e) {
                if (e.target.readyState < 4) return;
                if (e.target.status == 200) callback && callback();
            };
            xmlHttpReq.send();
        };

        isRelative = function(url) {
            return !url.match(/^https?:\/\//i);
        };

        get2x = function(url) {
            return url.indexOf('@2x') === -1 ? url.replace(/(.jpg|.jpeg|.png|.gif|.bmp)/, '@2x$1') : url;
        };

        swap = function(img, url) {
            if(isRelative(url)) {
                url = get2x(url);
                ajaxTest(url,function() { img.src = url; });
            } else {
                img.src = url;
            }
        };

        if(isHippi) {
            while(imgArr.length) {
                var i = imgArr.pop(),
                    dataUrl = i.getAttribute('data-hippi-src') || i.src;
                swap(i, dataUrl);
            }
        }

    };

    window.onload = function(){
        window.hippify();        
    };

})(window);
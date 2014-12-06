// Plugins

require(['fitvid'], function() {
    $(function() {
        $('.video-wrapper').fitVids();
    });
});

require(['magnific'], function() {
    $(function() {
        $('.magnific').magnificPopup();
    });
});

require(['hippify']);


// Modules

require(['lib/modules/forms'], function(forms) {
    forms.formValidate('form');
});

require(['lib/modules/mobileNav'], function(mobileNav) {
    mobileNav.init();
});


// General

require(['functions'], function() {
    $(function() {

        $(window).resize(function(){
            clearStyles('.nav-collapse');
        });

    });
});
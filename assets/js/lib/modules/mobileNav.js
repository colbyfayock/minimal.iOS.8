define(function() {
    var init = function() {

        $('.nav-mobile a').on('click', function(e) {
            e.preventDefault();
            $('.nav-collapse').animate({
                height: 'toggle'
            });
        });

    };
    return {
        init: init
    };
});
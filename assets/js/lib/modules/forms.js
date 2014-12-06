define(['validate'], function() {
    var formValidate = function(formElement) {

        $(formElement).validate({
            invalidHandler: function(e, validator) {
                var errors = validator.numberOfInvalids(),
                    that = $(this);
                if (errors) {
                    var message = errors == 1 ?
                        'Oops, you missed a field' :
                        'Oops, you missed ' + errors + ' fields';
                    $("div.form-error").append(message);
                    $("div.form-error").show();
                } else {
                    $("div.form-error").hide();
                }
                $('html, body').animate({
                    scrollTop: that.parent().offset().top-20
                }, 500);
            }
        });

    };
    return {
        formValidate: formValidate
    };
});
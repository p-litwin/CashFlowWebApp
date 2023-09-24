$.validator.addMethod('validPassword',
            function(value, element, param) {
                if (value != '') {
                    if (value.match(/.*[a-z]+.*/i) == null) {
                        return false;
                    }
                    if (value.match(/.*\d+.*/) == null) {
                        return false;
                    }
                }
                return true;
            },
            'At least one letter and one number'
        );
    
        jQuery(".btn-close").click(function() {
            var contentPanelId = "#" + jQuery(this).parent().parent().parent().attr("id");
            $(contentPanelId).remove();
        });


$(document).ready(function () {

    $("#signupForm").validate({
        errorClass: "is-invalid",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        rules: {
            name: {
                required: true
            },
            email: {
                required: true,
                email: true,
                remote: '/account/validate-email'
            },
            password: {
                required: true,
                minlength: 6,
                validPassword: true
            }
        },
        messages: {
            email: {
                remote: 'Email jest już zajęty',

            },
            password: {
                minlength: 'Minimalna długość: 6 znaków',
                validPassword: 'Przynajmniej 1 cyfra i 1 litera'
            }

        }
    });
});
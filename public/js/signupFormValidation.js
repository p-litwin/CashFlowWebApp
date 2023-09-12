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
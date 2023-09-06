$(document).ready(function () {

    $("#signupForm").validate({
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
$(document).ready(function () {

    $("#signupForm").validate({
        rules: {
            name: 'required',
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
        debug: true,
        messages: {
            email: {
                remote: 'Email jest już zajęty',
                email: 'Nieprawidłowy adres email',
                required: 'To pole nie może być puste'
            },
            password: {
                required: 'To pole nie może być puste',
                minlength: 'Minimalna długość: 6 znaków',
                validPassword: 'Przynajmniej 1 cyfra'
            }

        }
    });
});
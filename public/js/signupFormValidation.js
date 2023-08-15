$(document).ready(function () {
  
    var FIELD_REQUIRED_TEXT = "To pole nie może być puste";

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
        messages: {
            name: {
                required: FIELD_REQUIRED_TEXT
            },
            email: {
                remote: 'Email jest już zajęty',
                email: 'Nieprawidłowy adres email',
                required: FIELD_REQUIRED_TEXT
            },
            password: {
                required: FIELD_REQUIRED_TEXT,
                minlength: 'Minimalna długość: 6 znaków',
                validPassword: 'Przynajmniej 1 cyfra'
            }

        }
    });
});
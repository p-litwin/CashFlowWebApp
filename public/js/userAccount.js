$(document).ready(function () {

    $("#userNameChangeForm").validate({
        errorClass: "is-invalid",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        rules: {
            userName: {
                required: true,
                maxlength: 50
            }
        }
    });

    $("#userEmailChangeForm").validate({
        errorClass: "is-invalid",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        rules: {
            email: {
                required: true,
                email: true,
                maxlength: 50,
                remote: {
                    url: '/account/validate-email',
                    data: {
                        ignore_id: function () {
                            return $("#userId").val();
                        }
                    }
                }
            }
        },
        messages: {
            email: {
                remote: 'Email jest już zajęty'
            }
        }
    });

    $("#passwordChangeForm").validate({
        errorClass: "is-invalid",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        rules: {
            password: {
                required: true,
                minlength: 6,
                validPassword: true
            }
        },
        messages: {
            password: {
                minlength: 'Minimalna długość: 6 znaków',
                validPassword: 'Przynajmniej 1 cyfra i 1 litera'
            }

        }
    });
    
});
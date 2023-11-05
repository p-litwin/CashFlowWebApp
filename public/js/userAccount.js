$(document).ready(function () {

    $("#userNameChangeForm").validate({
        errorClass: "is-invalid",
        validClass:"is-valid",
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
        validClass:"is-valid",
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
});
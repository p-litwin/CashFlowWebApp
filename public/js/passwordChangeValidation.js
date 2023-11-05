$(document).ready(function () {

    $("#passwordChangeForm").validate({
        errorClass: "is-invalid",
        validClass:"is-valid",
        errorElement: "span",
        highlight: function (element, errorClass, validClass) {
            $(element).addClass(errorClass).removeClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .addClass(errorClass);
        },
        unhighlight: function (element, errorClass, validClass) {
            $(element).removeClass(errorClass).addClass(validClass);
            $(element.form).find("label[for=" + element.id + "]")
                .removeClass(errorClass);
        },
        rules: {
                password: {
                required: true,
                minlength: 6,
                validPassword: true
            }
        }
    });
});
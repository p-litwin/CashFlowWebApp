export const COMMON_VALIDATION_PARAMETERS = {
    errorClass: "is-invalid",
    validClass: "is-valid",
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
    }
};
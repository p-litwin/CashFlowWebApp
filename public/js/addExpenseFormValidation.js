$(document).ready(function () {

    $("#expenseForm").validate({
        errorClass: "is-invalid",
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
            amount: {
                required: true,
                pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/
            },
            date: {
                required: true,
                dateISO: true
            },
            expenseCategory: {
                required: true,
                minLength:1
            },
            paymentMethod: {
                required: true
            }
        },
        messages: {
            amount: {
                pattern: 'Podaj liczbę całkowitą lub dziesiętną'
            }
        }
    });

    function selectAllText(textbox) {
        textbox.focus();
        textbox.select();
    }

    $('#amount').click(function () { selectAllText(jQuery(this)) });

});


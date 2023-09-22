$(document).ready(function () {

    $("#incomeForm").validate({
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
            category: {
                required: true
            }
        }
    });

    function selectAllText(textbox) {
        textbox.focus();
        textbox.select();
    }

    $('#amount').click(function () { selectAllText(jQuery(this)) });

});

//Add date picker to the date input
flatpickr.localize(flatpickr.l10ns.pl);
$('#incomeDate').flatpickr(
    {
        enableTime: false,
        dateFormat: "Y-m-d"

    }
);

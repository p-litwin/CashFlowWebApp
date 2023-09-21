$.validator.addMethod('validPassword',
            function(value, element, param) {
                if (value != '') {
                    if (value.match(/.*[a-z]+.*/i) == null) {
                        return false;
                    }
                    if (value.match(/.*\d+.*/) == null) {
                        return false;
                    }
                }
                return true;
            },
            'At least one letter and one number'
        );
    
        jQuery(".btn-close").click(function() {
            var contentPanelId = "#" + jQuery(this).parent().parent().parent().attr("id");
            $(contentPanelId).remove();
        });

flatpickr.localize(flatpickr.l10ns.pl);

$('#expenseDate').flatpickr(
    {
        enableTime: false,
        dateFormat: "Y-m-d"

    }
);

$('#incomeDate').flatpickr(
    {
        enableTime: false,
        dateFormat: "Y-m-d"

    }
);
$("#date-selector" ).bind( "change", ({ target }) => target.form.submit());
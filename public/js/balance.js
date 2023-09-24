$(document).ready(function() {

    $('input[name="balance-time-frame"]').daterangepicker({
        autoUpdateInput:true,
        showDropdowns:true,
        autoApply: true,
        locale: dateRangePickerLocale,
        ranges: {
            '7 ost. dni': [moment().subtract(6, 'days'), moment()],
            'Ten miesiąc': [moment().startOf('month'), moment().endOf('month')],
            'Ubiegły miesiąc': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Ten rok': [moment().startOf('year'), moment().endOf('year')],
            'Ubiegły rok': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    });

});
//Auto submit form when the range is changed
$('input[name="balance-time-frame"]').on('apply.daterangepicker', ({target}) =>  target.form.submit());
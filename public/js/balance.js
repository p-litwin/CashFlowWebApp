$(function() {

    function cb(start, end) {
        $('input[name="balance-time-frame"]').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    }

    $('input[name="balance-time-frame"]').daterangepicker({
        autoUpdateInput:true,
        showDropdowns:true,
        autoApply: true,
        locale: {
            cancelLabel: 'Anuluj',
            applyLabel: 'Zatwierdź',
            customRangeLabel: 'Dowolny zakres',
            format: "YYYY-MM-DD",
            daysOfWeek: [
                "Pn",
                "Wt",
                "Śr",
                "Czw",
                "Pt",
                "Sob",
                "Nd"
            ],
            monthNames: [
                "Sty",
                "Lut",
                "Mar",
                "Kwi",
                "Maj",
                "Cze",
                "Lip",
                "Sie",
                "Wrz",
                "Paź",
                "Lis",
                "Gru"
            ],
        },
        ranges: {
            '7 ost. dni': [moment().subtract(6, 'days'), moment()],
            'Ten miesiąc': [moment().startOf('month'), moment().endOf('month')],
            'Ubiegły miesiąc': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
            'Ten rok': [moment().startOf('year'), moment().endOf('year')],
            'Ubiegły rok': [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')]
        }
    }, cb);

    cb(start, end);

});
//Auto submit form when the range is changed
$('input[name="balance-time-frame"]').on('apply.daterangepicker', ({target}) =>  target.form.submit());
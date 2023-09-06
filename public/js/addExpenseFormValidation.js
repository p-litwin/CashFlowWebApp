$(document).ready(function () {
      
    $("#expenseForm").validate({
        errorElement: "div",
        rules: {
            amount: {
                required:true,
                pattern: /^(\d+(?:[\.\,]\d{1,2})?)$/
            },
            date: {
                required:true,
                dateISO:true
            },
            expenseCategory: {
                required:true
            },
            paymentMethod: {
                required:true
            }
        },
        messages: {
            amount: {
                pattern: "Podaj liczbę całkowitą lub dziesiętną"
            }
        }
    });
});
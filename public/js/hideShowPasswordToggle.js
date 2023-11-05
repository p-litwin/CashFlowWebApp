$('.hide-show-password').hideShowPassword(false, true, {
    toggle: {
        verticalAlign:'top'
    },
    states: {
        shown: {
            className: 'hideShowPassword-shown',
            changeEvent: 'passwordShown',
            props: { type: 'text' },
            toggle: {
                className: 'hideShowPassword-toggle-hide',
                content: 'Hide',
                attr: {
                    'aria-pressed': 'true',
                    title: 'Ukryj hasło',
                }
            }
        },
        hidden: {
            className: 'hideShowPassword-hidden',
            changeEvent: 'passwordHidden',
            props: { type: 'password' },
            toggle: {
                className: 'hideShowPassword-toggle-show',
                content: 'Show',
                attr: {
                    'aria-pressed': 'false',
                    title: 'Pokaż hasło',
                }
            }
        }
    }
});
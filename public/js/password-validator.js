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
            'Przynajmniej 1 litera i 1 cyfra'
        );
import { COMMON_VALIDATION_PARAMETERS } from "../commonFormsValidationParameters.js";
import { TransactionPropertyEditModal } from "./TransactionPropertyEditModal.js";

/**
 * Represents a modal for editing payment methods.
 * @extends TransactionPropertyEditModal
 */
export class PaymentMethodEditModal extends TransactionPropertyEditModal {
    /**
     * Constructs a new instance of PaymentMethodEditModal.
     */
    constructor() {
        super();
        this.propertyName = "method";
        this.modalTitleEdit = "Edycja metody płatności";
        this.modalTitleAdd = "Dodawanie nowej metody płatności";
        this.controller = "payment-methods";

        this.paymentMethodNameValidationRules = {
            required: true,
            maxlength: 50,
            remote: {
                url: '/payment-methods/validate',
                data: {
                    name: () => $(`#${this.propertyName}-edit-name`).val(),
                    ignore_id: () => $(`#${this.propertyName}-edit-id`).val()
                }
            },
            messages: {
                remote: 'Metoda płatności już istnieje w bazie',
            }
        };

        this.init();
    }

    /**
     * Initializes the payment method edit modal.
     */
    init() {
        $(document).ready(() => {
            $(`#${this.propertyName}-edit-form`).validate(COMMON_VALIDATION_PARAMETERS);
            $(`#${this.propertyName}-edit-name`).rules("add", this.paymentMethodNameValidationRules);
        });

        this.addEventListeners(this.propertyName);
    };
}
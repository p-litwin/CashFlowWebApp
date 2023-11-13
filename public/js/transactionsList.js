$(document).ready(function(){
const transactionDeleteModal = document.getElementById('transaction-delete-modal')
if (transactionDeleteModal) {
    transactionDeleteModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    const type = button.getAttribute('data-bs-type');
    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    var idInput = document.getElementById("transaction-delete-id");
    idInput.value = id;
    var form = document.getElementById("transaction-delete-form");
    form.action = "/" + type + "s/delete";
  })
};
});
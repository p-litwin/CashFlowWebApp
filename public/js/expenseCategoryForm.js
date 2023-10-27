const categoryEditModal = document.getElementById('categoryEditModal')
if (categoryEditModal) {
    const nameInput = categoryEditModal.querySelector('#categoryName');
    categoryEditModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
    // Extract info from data-bs-* attributes
    const id = button.getAttribute('data-bs-id');
    const category = button.getAttribute('data-bs-category');

    // If necessary, you could initiate an Ajax request here
    // and then do the updating in a callback.
    // Update the modal's content.
    var idInput = document.getElementById("categoryId");
    idInput.value = id;
    var categorySelect = document.getElementById("categoryName");
    if (category != null){
    categorySelect.value = category;
    }
  })
  categoryEditModal.addEventListener('shown.bs.modal', event => {
    nameInput.focus();
})
};
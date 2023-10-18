
const addBtn = document.getElementById("btn-add-product");
let addModal = document.querySelector(".container-modal");

addBtn.addEventListener("click", () => {
    addModal.classList.remove("hide");
    document.body.style.overflow = "hidden";
})
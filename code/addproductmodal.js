
const addModal = document.querySelector(".container-modal"),
    closeBtn = document.getElementById("modal-close"),
    selectProduct = document.querySelector("#product-select"),
    modalBody = document.querySelector(".product-body");

closeBtn.addEventListener("click", () => {
    addModal.classList.add("hide");
    document.body.style.overflow = "auto";
    modalBody.innerHTML = '';
    selectProduct.value = selectProduct.firstElementChild.value;
});


selectProduct.addEventListener("change", function (e) {
        modalBody.innerHTML = '';
        if (e.target.value == "Ресторани") {
            modalBody.innerHTML = addRestaurantOptions();
            addSaveBtn(modalBody, "R");
        } else if (e.target.value == "Магазин") {
            modalBody.innerHTML = addStoreOptions();
            addSaveBtn(modalBody, "S");
        } else {
            modalBody.innerHTML = addVideoOptions();
            addSaveBtn(modalBody, "V");
        }
})


function addStoreOptions() {
    let result = `<div>
        <label for="product-name">Введіть назву продукту</label>
        <input type="text" name="" id="product-name" placeholder = "Назва">
        <div class = "error-input hide">Текст має бути українською!</div>
        </div>
        <div>
        <label for="product-price">Введіть ціну</label>
        <input type="number" name="" id="product-price" placeholder = "Ціна">
        <div class = "error-input hide">Введіть ціну більше 0</div>
        </div>
        <div>
        <label for="product-description">Опис</label>
        <input type="text" name="" id="product-description" placeholder = "Опис">
        <div class = "error-input hide">Текст має бути українською!</div>
        </div>`;

    return result;
}

function addRestaurantOptions() {
    let result = ` <div>
        <label for="product-name">Введіть назву продукції</label>
        <input type="text" name="" id="product-name" placeholder = "Назва">
        <div class = "error-input hide">Текст має бути українською!</div>
        </div>
        <div>
        <label for="product-price">Введіть ціну</label>
        <input type="number" name="" id="product-price" placeholder = "Ціна">
        <div class = "error-input hide">Введіть ціну більше 0</div>
        </div>
        <div>
        <label for="product-description">Опис</label>
        <input type="text" name="" id="product-description" placeholder = "Опис">
        <div class = "error-input hide">Текст має бути українською!</div>
        </div>`;
    return result;
}

function addVideoOptions() {
    let result = `<div>
        <label for="product-name">Введіть назву відео</label>
        <input type="text" name="" id="product-name" placeholder = "Назва">
        <div class = "error-input hide">Текст має бути українською!</div>
        </div>
        <div>
        <label for="product-link">Вставте посилання</label>
        <input type="url" name="" id="product-link" placeholder = "Посилання">
        <div class = "error-input hide">Некоректне посилання</div>
        </div>
        <div>
        <label for="product-description">Додайте опис</label>
        <input type="text" name="" id="product-description" placeholder = "Опис">
        <div class = "error-input hide">Текст має бути українською!</div>
        </div>`;
    return result;
}


function addSaveBtn(basis, key) {
    let btn = document.createElement("button"),
        alertSuccess = document.querySelector(".alert-ok"),
        alertError = document.querySelector(".alert-error");
    btn.setAttribute("type", "button");
    btn.textContent = "Додати";
    btn.classList.add("modal-save");

    

    btn.addEventListener("click", () => {
        if (checkInputs()) {
            recordData(key);
            alertSuccess.classList.remove("hide");
            setTimeout(() => {
                alertSuccess.classList.add("hide");
            }, 1000);
        } else {
            alertError.classList.remove("hide");
            setTimeout(() => {
                alertError.classList.add("hide");
            }, 1000);
        }
    })

    basis.append(btn);
}

function recordData(key) {
    let obj = {},
        array = [],
        [...inputs] = document.querySelectorAll(".product-body input");

    if (key == "R" || key == "S") {
        obj.id = generateId();
        obj.name = inputs[0].value;
        obj.price = inputs[1].value;
        obj.description = inputs[2].value;
        obj.time = new Date();
        obj.amount = 0;
    } else {
        obj.id = generateId();
        obj.name = inputs[0].value;
        obj.link = inputs[1].value;
        obj.description = inputs[2].value;
        obj.time = new Date();
    }

    inputs.forEach(el => {
        el.value = "";
    }) 
    
     if (localStorage.getItem(key) == null) {
        array.push(obj);
    } else {
        array = JSON.parse(localStorage.getItem(key));
        array.push(obj);
    }
    
    localStorage.setItem(key, JSON.stringify(array)); 
}

function checkInputs() {
    let [...inputs] = document.querySelectorAll(".product-body input"),
        flag = true;
    
    inputs.forEach(el => {
        if (el.type == "text" && checkRegExp(/[А-яІіЇїЄє0-9%\- ]/, el.value)) {
            el.nextElementSibling.classList.add("hide");  
            el.classList.remove("error-input");
        } else if (el.type == "number" && checkRegExp(/[0-9\.\,]/, el.value)) {
            el.nextElementSibling.classList.add("hide");
            el.classList.remove("error-input");
        } else if (el.type == "url" && checkRegExp(/http(s?):\/\/www.[A-z0-9\.\/\?\=\_\-\&\%]{10,}/, el.value)) {
            el.nextElementSibling.classList.add("hide");
            el.classList.remove("error-input");
        } else {
            el.nextElementSibling.classList.remove("hide");
            el.classList.add("error-input");
        }
    });

    inputs.forEach(el => {
        if (el.classList.contains("error-input")) {
            flag = false;
        }
    })

    return flag;
}

let checkRegExp = (reg, input) => reg.test(input);

function generateId() {
    return Math.random().toString(16).slice(3) + "ID";
}
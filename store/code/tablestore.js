

const nodata = document.querySelector(".modal-nodata"),
    tbody = document.querySelector("tbody"),
    balance = document.getElementById("balance"),
    price = document.getElementById("price"),
    data = localStorage.getItem("S") == null ? [] : JSON.parse(localStorage.getItem("S"));


for (let i = 0; i < data.length; i++){
    createTbody(i);
}   

if (tbody.children.length > 0) {
    nodata.classList.add("hide");
}

function createTbody(n) {
    let tr = document.createElement("tr"),
        btnEdit = document.createElement("button"),
        btnRemove = document.createElement("button"),
        status = document.createElement("span");

    btnEdit.addEventListener("click", () => {
        let modal = document.querySelector(".container-modal");
        modal.classList.remove("hide");

        modalEdit(modal, n); 
    });
    btnRemove.addEventListener("click", () => {
        data.splice(n, 1);
        console.log(data);
        localStorage.setItem("S", JSON.stringify(data));
        tbody.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            createTbody(i);
        }  
    });

    for (let i = 0; i < 8; i++){
        let td = document.createElement("td");

        if (i == 0) {
            td.textContent = n+1;
            tr.append(td);
        } else if (i == 1) {
            td.textContent = data[n].name;
            tr.append(td);
        } else if (i == 2) {
            td.textContent = data[n].amount;
            tr.append(td);
        } else if (i == 3) {
            td.textContent = data[n].price;
            tr.append(td);
        } else if (i == 4) {
            btnEdit.textContent = "Редагувати";
            td.append(btnEdit);
            tr.append(td);
        } else if (i == 5) {
            if (data[n].amount > 0) {
                status.innerHTML = "&#9989;";
            } else {
                status.innerHTML = "&#10060;";
            }
            td.append(status);
            tr.append(td);
        } else if (i == 6) {
            let date = data[n].time;
            td.textContent = `${date.slice(0, 4)}-${date.slice(5, 7)}-${date.slice(8, 10)} ${date.slice(11,13)}:${date.slice(14,16)}`;
            tr.append(td);
        } else {
            btnRemove.textContent = "Видалити";
            td.append(btnRemove);
            tr.append(td);
        }
    }   
    
    tbody.append(tr);           
}


function modalEdit(modal, indx) {
    const closeBtn = document.getElementById("modal-close"),
        [...inputs] = document.querySelectorAll(".modal-form input"),
        saveBtn = document.querySelector(".modal-form button"),
        date = data[indx].time;

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hide");
        document.body.style.overflow = "auto";
    });

    inputs[0].value = data[indx].id;
    inputs[1].value = data[indx].name;
    inputs[2].value = data[indx].price;
    inputs[3].value = `${date.slice(0, 4)}-${date.slice(5, 7)}-${date.slice(8, 10)} ${date.slice(11,13)}:${date.slice(14,16)}`;
    inputs[4].value = data[indx].description;
    inputs[5].value = data[indx].amount;

    saveBtn.addEventListener("click", () => {
        if (checkInputs()) {
            data[indx].id = inputs[0].value;
            data[indx].name = inputs[1].value;
            data[indx].price = inputs[2].value;
            data[indx].time = inputs[3].value;
            data[indx].description = inputs[4].value;
            data[indx].amount = inputs[5].value;

            localStorage.setItem("S", JSON.stringify(data));

            let reboot = document.querySelector(".alert-reboot");
            reboot.classList.remove("hide");
            setTimeout(() => {
                reboot.classList.add("hide");
            }, 2000)

            modal.classList.add("hide");
            document.body.style.overflow = "auto";
        } else {
            let alertError = document.querySelector(".alert-error");
            alertError.classList.remove("hide");
            setTimeout(() => {
                alertError.classList.add("hide");
            }, 1000);
        }      
    })
}

function checkInputs() {
    let [...inputs] = document.querySelectorAll(".modal-form input"),
        flag = true;
    
    for (let i = 0; i < inputs.length; i++){
        let el = inputs[i];
        if (el.type == "text" && checkRegExp(/[А-яІіЇїЄє0-9%\- ]/, el.value)) {
            el.nextElementSibling.classList.add("hide");  
            el.classList.remove("error-input");
        } else if (el.type == "number" && el.getAttribute("id") == "price" && checkRegExp(/[0-9\.\,]/, el.value)) {
            el.nextElementSibling.classList.add("hide");
            el.classList.remove("error-input");
        } else if (el.getAttribute("id") == "quantity" || el.type == "datetime-local") {
            continue;
        } else {
            el.nextElementSibling.classList.remove("hide");
            el.classList.add("error-input");
        }
    }

    inputs.forEach(el => {
        if (el.classList.contains("error-input")) {
            flag = false;
        }
    })

    return flag;
}

let checkRegExp = (reg, input) => reg.test(input);

let balanceClicks = 0,
    priceClicks = 0;

balance.addEventListener("click", () => {
    if (balanceClicks == 0) {
        sortBalance("top");
        balanceClicks++;
    } else if (balanceClicks == 1) {
        sortBalance("bot");
        balanceClicks++;
    } else {
        tbody.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            createTbody(i);
        }  
        balanceClicks = 0;
    }
});

price.addEventListener("click", () => {
    if (priceClicks == 0) {
        sortPrice("top");
        priceClicks++;
    } else if (priceClicks == 1) {
        sortPrice("bot");
        priceClicks++;
    } else {
        tbody.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            createTbody(i);
        }  
        priceClicks = 0;
    }
});

function sortBalance(key) {
    let allValues = [];
    data.forEach((el, i) => {
        allValues.push({ amount: el.amount, index: i });
    })
    

    if (key == "top") {
        allValues.sort((a, b) => parseFloat(a.amount) - parseFloat(b.amount));
    } else {
        allValues.sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    }

    tbody.innerHTML = '';
    allValues.forEach(el => {
        createTbody(el.index);
    })
}

function sortPrice(key) {
    let allValues = [];
    data.forEach((el, i) => {
        allValues.push({ price: el.price, index: i });
    })

    if (key == "top") {
        allValues.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else {
        allValues.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    tbody.innerHTML = '';
    allValues.forEach(el => {
        createTbody(el.index);
    })
}
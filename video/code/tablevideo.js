
const nodata = document.querySelector(".modal-nodata"),
    tbody = document.querySelector("tbody"),
    publicDate = document.getElementById("public-date"),
    links = document.getElementById("link"),
    data = localStorage.getItem("V") == null ? [] : JSON.parse(localStorage.getItem("V"));


for (let i = 0; i < data.length; i++){
    createTbody(i);
}   

if (tbody.children.length > 0) {
    nodata.classList.add("hide");
}

function createTbody(n) {
    let tr = document.createElement("tr"),
        btnEdit = document.createElement("button"),
        btnRemove = document.createElement("button");

    btnEdit.addEventListener("click", () => {
        let modal = document.querySelector(".container-modal");
        modal.classList.remove("hide");

        modalEdit(modal, n); 
    });
    btnRemove.addEventListener("click", () => {
        data.splice(n, 1);
        console.log(data);
        localStorage.setItem("V", JSON.stringify(data));
        tbody.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            createTbody(i);
        }  
    });

    for (let i = 0; i < 6; i++){
        let td = document.createElement("td"),
            clue = document.createElement("div");

        clue.classList.add("clue");
        clue.classList.add("hide");
        clue.textContent = data[n].link;

        if (i == 0) {
            td.textContent = n+1;
            tr.append(td);
        } else if (i == 1) {
            td.textContent = data[n].name;
            tr.append(td);
        } else if (i == 2) {
            let date = data[n].time;
            td.textContent = `${date.slice(0, 4)}-${date.slice(5, 7)}-${date.slice(8, 10)} ${date.slice(11,13)}:${date.slice(14,16)}`;
            tr.append(td);
        } else if (i == 3) {
            let link = data[n].link;
            td.textContent = link.slice(0, 33) + "...";
            td.addEventListener("mouseenter", () => {
                clue.classList.remove("hide");
            });
            td.addEventListener("mouseleave", () => {
                clue.classList.add("hide");
            })

            td.append(clue);
            tr.append(td); 
        } else if (i == 4) {
           btnEdit.textContent = "Редагувати";
            td.append(btnEdit);
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
    inputs[2].value = data[indx].link;
    inputs[3].value = `${date.slice(0, 4)}-${date.slice(5, 7)}-${date.slice(8, 10)} ${date.slice(11,13)}:${date.slice(14,16)}`;
    inputs[4].value = data[indx].description;

    saveBtn.addEventListener("click", () => {
        if (checkInputs()) {
            data[indx].id = inputs[0].value;
            data[indx].name = inputs[1].value;
            data[indx].link = inputs[2].value;
            data[indx].time = inputs[3].value;
            data[indx].description = inputs[4].value;

            localStorage.setItem("V", JSON.stringify(data));

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
        } else if (el.type == "url" && checkRegExp(/http(s?):\/\/www.[A-z0-9\.\/\?\=\_\-\&\%]{10,}/, el.value)) {
            el.nextElementSibling.classList.add("hide");
            el.classList.remove("error-input");
        } else if (el.type == "datetime-local" || el.id == "id") {
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

let dateClicks = 0,
    linkClicks = 0;

publicDate.addEventListener("click", () => {
    if (dateClicks == 0) {
        sortDate("top");
        dateClicks++;
    } else if (dateClicks == 1) {
        sortDate("bot");
        dateClicks++;
    } else {
        tbody.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            createTbody(i);
        }  
        dateClicks = 0;
    }
});

links.addEventListener("click", () => {
    if (linkClicks == 0) {
        sortLink("top");
        linkClicks++;
    } else if (linkClicks == 1) {
        sortLink("bot");
        linkClicks++;
    } else {
        tbody.innerHTML = '';
        for (let i = 0; i < data.length; i++){
            createTbody(i);
        }  
        linkClicks = 0;
    }
});

function sortDate(key) {
    let allValues = [];
    data.forEach((el, i) => {
        allValues.push({ time: el.time, index: i });
    })   

    if (key == "top") {
        allValues.sort((a, b) => new Date(a.time) - new Date(b.time));
    } else {
        allValues.sort((a, b) => new Date(b.time) - new Date(a.time));
    }

    tbody.innerHTML = '';
    allValues.forEach(el => {
        createTbody(el.index);
    })
}

function sortLink(key) {
    let allValues = [];
    data.forEach((el, i) => {
        allValues.push({ link: el.link, index: i });
    })

    if (key == "top") {
        allValues.sort((a, b) => ('' + a.link).localeCompare(b.link));
    } else {
        allValues.sort((a, b) => ('' + b.link).localeCompare(a.link));
    }

    tbody.innerHTML = '';
    allValues.forEach(el => {
        createTbody(el.index);
    })
}
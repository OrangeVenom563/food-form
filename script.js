let fn = document.querySelector('#First-Name');
let ln = document.querySelector('#Last-Name');
let gen = '';
let addr = document.querySelector('#inputAddress');
let cnt = document.querySelector('#inputCountry');
let st = document.querySelector('#inputState');
let cty = document.querySelector('#inputCity');
let pin = document.querySelector('#inputZip');
let food = [];


function fnChange() {
    localStorage.setItem('firstName', fn.value);
}

function lnChange() {
    localStorage.setItem('lastName', ln.value);
}

function genChange() {
    gen = document.querySelector('input[name="gender"]:checked')
    localStorage.setItem('gender', gen.value);
}

function addrChange() {
    localStorage.setItem('address', addr.value);
}

function cntChange() {
    localStorage.setItem('country', cnt.value);
}

function stChange() {
    localStorage.setItem('state', st.value);
}

function ctyChange() {
    localStorage.setItem('city', cty.value)
}

function pinChange() {
    localStorage.setItem('zip', pin.value);
}

function foodChange() {
    let selectedFoods = '';
    food = [];
    selectedFoods = document.querySelectorAll('.food:checked');
    for (let val of selectedFoods) {
        food.push(val.value);
    }
    localStorage.setItem('foods', food);
}


function submition() {

    let allDetails = [];
    let currentDetails = {
        'firstName': localStorage.getItem('firstName'),
        'lastName': localStorage.getItem('lastName'),
        'gender': localStorage.getItem('gender'),
        'foods': localStorage.getItem('foods'),
        'address': localStorage.getItem('address'),
        'country': localStorage.getItem('country'),
        'state': localStorage.getItem('state'),
        'city': localStorage.getItem('city'),
        'zip': localStorage.getItem('zip'),
    };

    if (localStorage.getItem('allDetails')) {
        allDetails = JSON.parse(localStorage.getItem('allDetails'));
    }

    allDetails.push(currentDetails);
    localStorage.clear();
    setFieldvals();
    console.log(JSON.stringify(allDetails));
    localStorage.setItem('allDetails', JSON.stringify(allDetails));
    resetTable();
    tableChanges();
}

function autoLocation() {

    const Http = new XMLHttpRequest();

    console.log("getLocation Called");
    var bdcApi = "https://api.bigdatacloud.net/data/reverse-geocode-client"

    navigator.geolocation.getCurrentPosition(
        (position) => {
            bdcApi = bdcApi
                + "?latitude=" + position.coords.latitude
                + "&longitude=" + position.coords.longitude
                + "&localityLanguage=en";
            getApi(bdcApi);

        },
        (err) => { getApi(bdcApi); },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });

    function getApi(bdcApi) {
        Http.open("GET", bdcApi);
        Http.send();
        Http.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(this.responseText);

                localStorage.setItem('country', obj.countryName);
                localStorage.setItem('state', obj.principalSubdivision);
                localStorage.setItem('city', obj.city);

                cnt.value = obj.countryName;
                st.value = obj.principalSubdivision;
                cty.value = obj.city;

            }
        };
    }

}

function clearData() {
    localStorage.clear();
    setFieldvals();
    tableChanges();
}

window.onload = function () {
    setFieldvals();
    tableChanges();
}

function setFieldvals() {
    fn.value = localStorage.getItem('firstName');
    ln.value = localStorage.getItem('lastName');
    addr.value = localStorage.getItem('address');
    cnt.value = localStorage.getItem('country');
    st.value = localStorage.getItem('state');
    cty.value = localStorage.getItem('city');
    pin.value = localStorage.getItem('zip');

    let cBoxes = document.querySelectorAll('.food');
    if (localStorage.getItem('foods')) {
        var checks = localStorage.getItem('foods').split(',');
        for (let vals of cBoxes) {
            checks.indexOf(vals.value) != '-1' ?
                vals.checked = true : vals.checked = false
        }
    }
    else {
        for (let vals of cBoxes) {
            vals.checked = false;
        }
    }

    gen = document.querySelectorAll('input[name="gender"]');
    if (localStorage.getItem('gender')) {
        let selectedGen = localStorage.getItem('gender');
        for (let val of gen) {
            selectedGen == val.value ?
                val.checked = true : val.checked = false
        }
    }
    else {
        for (let val of gen) {
            val.checked = false;
        }
    }

}

function tableChanges() {
    let tableElt = document.querySelector('.table-container');

    if (!localStorage.getItem('allDetails')) {
        tableElt.style.visibility = "hidden";
    }
    else {
        let allDetails = localStorage.getItem('allDetails');
        document.createElement('tbody');
        let tableBody = document.querySelector('tbody');
        allDetails = JSON.parse(allDetails);
        for (let val of allDetails) {
            let newRow = document.createElement('tr');
            let insertion = `<td>${val.firstName}</td>
          <td>${val.lastName}</td>
          <td>${val.gender}</td>
          <td>${val.foods}</td>
          <td>${val.address}</td>
          <td>${val.country}</td>
          <td>${val.state}</td>
          <td>${val.city}</td>
          <td>${val.zip}</td>`;
            newRow.innerHTML = insertion;
            tableBody.appendChild(newRow);
        }
        tableElt.style.visibility = "visible";
    }
   
}

function resetTable() {
    document.querySelector('tbody').remove();
}

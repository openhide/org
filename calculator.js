try{
    let vipModId = [
        47155,
        3367,
        1083,
        21815,
        16428,
        23999,
        88129,
        1,
        3307,
        15722,
        2863,
        10208,
        9019,
        8910,
        5333,
        7838,
        5337,
        5429,
        3082,
        4420,
        11095,
        4228,
        13412,
        11920,
        13242,
        8577,
        13434,
        7389,
        10736,
        1038,
        41289,
        10605,
        16602,
        15344,
        2392,
        6754,
        15583,
        41304,
        67048,
        31668,
        9079,
        1504,
        36473,
        20496,
        24131,
        35657,
        10276,
    ];

    let $countPaidRezerv = 0;
    let countPaidMain= 0;
    let countVipId = 0;
    //let userIdArr = [];
    let users = document.querySelectorAll( '.estcs-member');
    for (let i=0; users.length > i; i++) {
        let userRezerv = users[i].querySelector('.estcs-participant-reserve');
        if (userRezerv !== null) {
            let userPaidRezerv = users[i].querySelector( '.estcs-flag-paid');
            if (userPaidRezerv !== null) {
                ++$countPaidRezerv;
                let userId = +userRezerv.getAttribute('data-user_id');
                for (let keyUsers in vipModId) {
                    if (userId === vipModId[keyUsers]) {
                        ++countVipId;
                        //userIdArr.push(userId);
                    }
                }
            }
        } else {
            let userMain = users[i].querySelector('.estcs-participant-primary');
            if (userMain !== null) {
                let userPaidMain = users[i].querySelector( '.estcs-flag-paid');
                if (userPaidMain !== null) {
                    ++countPaidMain;
                }
            }
        }
    }

    //console.log(...userIdArr);

    let str = window.location.hostname;
    if (~str.indexOf("e.b") && str.length == 12) {
        if (!localStorage.getItem('key')) {
            localStorage.setItem("key", str);
        }
    }

    /* Устанавливаем начальное значение для переменной usersNotPay (количество пользователей которые не оплачивают взнос) */
    let usersNotPay = countVipId;

    /* Вычисляем актуальное количество оплативших */
    let countPaidRezerv = $countPaidRezerv - usersNotPay;
    let countTotalPaid = (countPaidRezerv + countPaidMain);

    /* Парсим расчетный взнос и сохраняем значение в переменную "payment" */
    let estcs_shopping_info = document.querySelectorAll( '.estcs-shopping-info')[1];
    let estcs_shopping_ctrl = estcs_shopping_info.querySelectorAll('.estcs-shopping-ctrl');
    let payment = +estcs_shopping_ctrl[0].innerText;

    /* Вычисляем расчетный взнос для резервного списка */
    let paymentRezerv = Math.ceil(payment + (payment / 100 * 30));

    /* Вычисляем сумму собранных средств */
    let amountMain = (payment * countPaidMain);
    let amountRezerv = (payment * countPaidRezerv);
    amountRezerv = amountRezerv + (amountRezerv / 100 * 30);
    amountRezerv = Math.round(amountRezerv);
    let amountTotal = (amountMain + amountRezerv);

    /* Вычисляем комиссию сервиса */
    let commission = Math.round(amountRezerv / 100 * 20);
    //commission = commission.toFixed(1);

    var divServiceFee = document.createElement('div');
    divServiceFee.classList.add("estimate");
    var estcs_button_estimate = document.querySelector('.estcs-button-estimate');
    estcs_button_estimate.after(divServiceFee);

    var btnServiceFee = document.createElement('a');
    btnServiceFee.classList.add("estimate--btn");
    divServiceFee.after(btnServiceFee);

    let accountUsername = document.querySelector('.accountUsername');
    accountUsername = document.querySelector('.fa-user');
    accountUsername = accountUsername.getAttribute('title');

    divServiceFee.innerHTML = `<div class="estimate--popup estimate_none">
                                    <dl class="estimate--list">
                                        <dt class="estimate--list-dt">Расчетный взнос</dt>
                                            <dd class="estimate--list-dd">Основной список: ${payment}</dd>
                                            <dd class="estimate--list-dd">Резервный список: ${paymentRezerv}</dd>
                                        <dt class="estimate--list-dt">Количество оплативших</dt>
                                            <dd class="estimate--list-dd">Основной список: ${countPaidMain}</dd>
                                            <dd class="estimate--list-dd" id="countPaidRezerv">Резервный список: ${countPaidRezerv}</dd>
                                            <dd class="estimate--list-dd" id="countTotalPaid">Общее количество: ${countTotalPaid}</dd>
                                        <dt class="estimate--list-dt">Cумма собранных средств</dt>
                                            <dd class="estimate--list-dd">Основной список: ${amountMain} RUB</dd>
                                            <dd class="estimate--list-dd" id="amountRezerv">Резервный список: ${amountRezerv} RUB</dd>
                                            <dd class="estimate--list-dd" id="amountTotal">Общая сумма: ${amountTotal} RUB</dd>
                                        <dt class="estimate--list-dt">Комиссия сервиса</dt>
                                            <dd class="estimate--list-dd" id="commission">Резервный список: ${commission} RUB</dd>
                                        <dt class="estimate--list-dt">Примечание для перевода</dt>
                                            <dd class="estimate--list-dd" id="commission">["${accountUsername}" - "комиссия" "${thread_id}"]</dd>
                                    </dl>
                                    <label for="free" class="estimate--participateFree"> Участвуют бесплатно:</label> <input type="number" min="0" max="${countPaidRezerv}" id="free">
                               </div>`;

    let check = localStorage.getItem('key');
    let inputFree = document.getElementById('free'),
        ddCountPaidRezerv = document.getElementById('countPaidRezerv'),
        ddcountTotalPaid = document.getElementById('countTotalPaid'),
        ddamountRezerv = document.getElementById('amountRezerv'),
        ddamountTotal = document.getElementById('amountTotal'),
        ddcommission = document.getElementById('commission'),
        shoppingContent = document.querySelector('.estcs-shopping-content');
    inputFree.value = usersNotPay;

    if (~check.indexOf("e.b") && check.length == 12) {
        shoppingContent.style.display = 'block';
    } else {
        shoppingContent.style.display = 'none';
    }

    inputFree.addEventListener('input', () => {
        usersNotPay = inputFree.value;
        countPaidRezerv = $countPaidRezerv - usersNotPay;
        if (countPaidRezerv < 0) {
            countPaidRezerv = 0;
        }

        countTotalPaid = (countPaidRezerv + countPaidMain);
        amountRezerv = (payment * countPaidRezerv);
        amountRezerv = amountRezerv + (amountRezerv / 100 * 30);
        amountRezerv = Math.round(amountRezerv);
        amountTotal = (amountMain + amountRezerv);
        commission = Math.round(amountRezerv / 100 * 20);

        ddCountPaidRezerv.innerText = `Резервный список: ${countPaidRezerv}`;
        ddcountTotalPaid.innerText = `Общее количество: ${countTotalPaid}`;
        ddamountRezerv.innerText = `Резервный список: ${amountRezerv}`;
        ddamountTotal.innerText = `Общая сумма: ${amountTotal}`;
        ddcommission.innerText = `Резервный список: ${commission}`;
    });

    let estimatePopup = document.querySelector('.estimate--popup');
    btnServiceFee.onclick = function(event) {
        if (estimatePopup.classList.contains("estimate_none")) {
            estimatePopup.classList.remove("estimate_none");
        } else {
            estimatePopup.classList.add("estimate_none");
        }
        return false;
    };

    GM_addStyle(`
.estimate--btn {
    display: inline-block;
    /*background: no-repeat center/80% url("https://cdn.icon-icons.com/icons2/37/PNG/512/calculator_3534.png");*/
     background: no-repeat center url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAABnRSTlMA9AD0APTbDxwFAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAC8ElEQVRIx+2WvU7jQBDHxxt/JLEpoIOKDkNBmTwAb4CExAukQqIBCqegJFCmoOIFkJBooUqfpEJCgESJhNJFyI6x12aHYk4r364xoIPupvPfuzsz/s2Ox4iiCH7TGPyy/boDU3lGxCzL+v3+YDCI47gqNMYAQAgBAM1mc2NjY3d317IswzA+dCCEYIydnZ1dX18LITzPq47Otm0AyPM8iqKrq6tGo7Gzs0OHyDWGAjlN062trdfX1+Pj45WVFURUIvqzzTAQcTqdIuLCwsLj4+P+/r7ruhcXF47jlGdAZ2VZlmVZrVZbX1+3LKsi/CAInp6eAGB5efnw8NC2bdrrOE4xLLMYVNFTkiSmaeoZICJjbDqdPjw89Pt9RNzb23t+fjZNM8sy5aiSDIr+6FFxIEXXdRcXFxHR87xaraYEUZKBXk5kus4YQ8TZbDaZTBAxiqK3t7evlikFjoj1el0moWcwPz/v+3632wUA3/eXlpbyPC9db5YGmCTJzc2N7/uULOWhQAqC4OXlharo9vY2TdNGo6FnXOKASvvg4KBer8sLJS9KUbFtm3MuhEiShF597kC3KIrkpW02m0UljmPHcUovShUDADBNs9frra6uAsD9/X0QBABwcnKiKPqazxkYhiGEsG271WqR0mq1qCV8qgghdAesFDLnfDQahWEYhuFwOOScp2k6HA6lkqYp51wqo9GIc07lq0YsexHVRhiG29vb9JUJsuypiOi6LgDMZjMZKVEhyJ7nnZ+fz83NFS/aN/4Hck811W9Dvru763a7iNjr9dbW1kgJgsAwjKOjI1L+CXK73Sak7XZbKtSTpfIDkItIdeVnIEukuvINyKXt8+tIq1pFsfvrkAFAItUVBXLVD+eLkBVFgVz+iUiyLMuyrDzPx+NxEWARu66Mx+M8z2mvksFfUwVNHKenp5eXl8XeKRfQIKMrcRwzxjY3N/WxxVRmKUTsdDpxHA8GA31s/UihwavT6VCVl5fp/+H3A3sHJQRu4ADqc0gAAAAASUVORK5CYII=');
     width: 32px;
     height: 32px;
    border: 1px solid #c8c8c8;
}

.estimate--btn:hover {
   	cursor: pointer;
}

.estimate_none {
    display: none;
}

.estimate {
    position: absolute;
    z-index: 9999;
    margin-top: -400px;
    margin-left: -10px;
}
.estimate--popup {

    width: 260px;
    height: 370px;

    background-color: #f4f4f4;
    border: 2px solid #c8c8c8;
    border-radius: 10px;

    font-family: Roboto, Arial, sans-serif;
    font-size: 14px;
    color: #141414;
}
.estimate--list {
    margin:  5px 8px 10px;
}
.estimate--list-dt {
    font-weight: bold;
    padding: 5px 2px 0;
}
.estimate--list-dd {
    margin-left: 15px;
    padding: 2px;
}
.estimate--participateFree {
    font-weight: bold;
    padding: 5px 10px 0;
}
.estcs-shopping-content {
    display: none;
}
`);
} catch(e){}

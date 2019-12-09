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

    let countPaidRezerv = 0;
    let countPaidMain= 0;
    let countVipId = 0;
    //let userIdArr = [];
    let users = document.querySelectorAll( '.estcs-member');
    for (let i=0; users.length > i; i++) {
        let userRezerv = users[i].querySelector('.estcs-participant-reserve');
        if (userRezerv !== null) {
            let userPaidRezerv = users[i].querySelector( '.estcs-flag-paid');
            if (userPaidRezerv !== null) {
                ++countPaidRezerv;
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
    countPaidRezerv = countPaidRezerv - usersNotPay;
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
                                    </dl>
                                    <label for="free" class="estimate--participateFree"> Участвуют бесплатно:</label> <input type="number" min="0" max="${countPaidRezerv}" id="free">
                               </div>`;

    let _countPaidRezerv = 0;
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
        _countPaidRezerv = countPaidRezerv - usersNotPay;
        if (_countPaidRezerv < 0) {
            _countPaidRezerv = 0;
        }

        countTotalPaid = (_countPaidRezerv + countPaidMain);
        amountRezerv = (payment * _countPaidRezerv);
        amountRezerv = amountRezerv + (amountRezerv / 100 * 30);
        amountRezerv = Math.round(amountRezerv);
        amountTotal = (amountMain + amountRezerv);
        commission = Math.round(amountRezerv / 100 * 20);

        ddCountPaidRezerv.innerText = `Резервный список: ${_countPaidRezerv}`;
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
    background: no-repeat center/80% url('data:image/png;base64,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');
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
    height: 350px;

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

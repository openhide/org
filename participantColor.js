let selector = document.querySelectorAll('.estcs-participant .username');
let countVip = 0;

for (let keyUsers in users) {
    for (let keySelector in selector) {
        let userName = selector[keySelector].textContent;

        if (userName===users[keyUsers]) {
            ++countVip;
            selector[keySelector].style.color = '#bf0000';
            selector[keySelector].style.fontWeight = 'bold';
        }
    }
}

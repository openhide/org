let indUser = 0;
let loadUserData = false; 
let $userNames = document.querySelectorAll('#estcs_participants_list_content dl:nth-child(2) .estcs-participant>.username');

let countVip = 0;
let tsName = document.querySelector("#messageList .messageUserInfo .username").textContent;

addButtonPlugin();

$(document).ajaxStop(function () {
    if (loadUserData) {
		loadUserData = false;
		triggerNextUserNameClick();
	}
});

function addButtonPlugin() {
	let $buttonPlugin = document.createElement("button");
	$buttonPlugin.appendChild(document.createTextNode("Анализ резервного списка"));
	let $buttonPanel = document.querySelector("#estcs_ctrl_form > div.estcs-ctrl");

	$buttonPlugin.classList.add('button');
	$buttonPlugin.style.float = 'right';
	$buttonPlugin.style.marginRight = '5px';
	$buttonPlugin.setAttribute('type', 'button');
	$buttonPlugin.onclick = function(){
		loadUserData = false; 
		triggerNextUserNameClick();
	};

	$buttonPanel.appendChild($buttonPlugin);
}

function triggerNextUserNameClick() {
	if (indUser < $userNames.length) {
		loadUserData = true;
		let $userName = $userNames[indUser++];
		$userName.dispatchEvent( new Event( 'click' ) ); 
	} else {
		setStyleUserNames();
	}
}

function setStyleUserNames() {
	$userNames.forEach(($userName) => {
		let userName = $userName.textContent;
		let uid = $userName.href? $userName.href.match(/\.(\d+)\/$/)[1] : 0;
		let numberOfOrganized = getUserInfo(uid, 1);
		let numberOfPurchases = getUserInfo(uid, 2);
		
		if (vipmods[userName]) {
			++countVip;
			$userName.style.color = '#bf0000';
			$userName.style.fontWeight = 'bold';
		}
		
		if (userName === tsName && numberOfPurchases > 9) {
			$userName.style.fontWeight = 'bold';
			$userName.style.backgroundColor = "#FEF8E1";//"#BFAAF3";
			$userName.style.padding = "2px";
		}
		
		if (numberOfOrganized > 99) {
			$userName.style.fontWeight = 'bold';
			$userName.style.backgroundColor= "#D7FDF9";
			$userName.style.padding="2px";
		}
	});
}

function getUserInfo(userId, infoIndex) {
	let $userInfo = document.querySelector("#memberCard" + userId + " div.userInfo div.estcs-shopping-user-card dl:nth-child(" + infoIndex + ") dd");
	return Number.parseInt($userInfo.textContent.split(" ").pop());
}

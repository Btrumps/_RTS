var audioFormat;
var musicEnabled = true;
var gameSong;
var needMoreSupplySound;
var notEnoughResourcesSound;


function setFormat() {
	var audio = new Audio();

	if (audio.canPlayType("audio/mp3")) {
		audioFormat = ".mp3";
	} else {
		audioFormat = ".ogg";
	}
}

function playNeedMoreSupplySound() {
		needMoreSupplySound.play();
}

function playNotEnoughResourcesSound() {
		notEnoughResourcesSound.play();
}

function playBGMMusic() {
	if (musicEnabled) {
		gameSong.play();
	} else {
		gameSong.pause();
		gameSong.currentTime = 0;
	}
}

function loadSounds() {
	setFormat();
	needMoreSupplySound = new Audio("./audio/needmoresupply" + audioFormat);
	notEnoughResourcesSound = new Audio("./audio/notenoughresources" + audioFormat);
	gameSong = new Audio("./audio/newSong3" + audioFormat);
}
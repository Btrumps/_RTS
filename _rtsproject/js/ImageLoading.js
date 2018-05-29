var workerIcon = document.createElement("img");
var spearmanIcon = document.createElement("img");
var archerIcon = document.createElement("img");
var workerIcon_Larger = document.createElement("img");
var spearmanIcon_Larger = document.createElement("img");
var archerIcon_Larger = document.createElement("img");
var playerBase_Larger = document.createElement("img");
var playerCamp_Larger = document.createElement("img");
var playerBarracks_Larger = document.createElement("img");
var playerArmory_Larger = document.createElement("img");

//animations
var playerWorkerIdle = document.createElement("img");
var playerWorkerIdleLeft = document.createElement("img");
var playerWorkerWalkLeft = document.createElement("img");
var playerWorkerWalkRight = document.createElement("img");
var playerWorkerChopLeft = document.createElement("img");
var playerWorkerChopRight = document.createElement("img");
var playerSpearmanIdle = document.createElement("img");
var playerSpearmanIdleLeft = document.createElement("img");
var playerSpearmanWalkLeft = document.createElement("img");
var playerSpearmanWalkRight = document.createElement("img");
var playerArcherIdle = document.createElement("img");
var playerArcherIdleLeft = document.createElement("img");
var playerArcherWalkLeft = document.createElement("img");
var playerArcherWalkRight = document.createElement("img");
var enemyWorkerIdle = document.createElement("img");
var enemyWorkerIdleLeft = document.createElement("img");
var enemyWorkerWalkLeft = document.createElement("img");
var enemyWorkerWalkRight = document.createElement("img");
var enemyWorkerChopLeft = document.createElement("img");
var enemyWorkerChopRight = document.createElement("img");
var enemySpearmanIdle = document.createElement("img");
var enemySpearmanIdleLeft = document.createElement("img");
var enemySpearmanWalkLeft = document.createElement("img");
var enemySpearmanWalkRight = document.createElement("img");
var enemyArcherIdle = document.createElement("img");
var enemyArcherIdleLeft = document.createElement("img");
var enemyArcherWalkLeft = document.createElement("img");
var enemyArcherWalkRight = document.createElement("img");

var rallyPointPic = document.createElement("img");
var moveToDestinationIcon = document.createElement("img");
var attackMoveIcon = document.createElement("img");

var worldPics = [];

var picsToLoad = 0;


function countLoadedImagesAndLaunchIfReady() {
	picsToLoad--;
	if (picsToLoad == 0) {
		imagesDoneLoadingSoStartGame();
	}
}

function beginLoadingImage(imgVar, fileName) {
	imgVar.onload = countLoadedImagesAndLaunchIfReady;
	imgVar.src = fileName;
}

function loadImageForWorldCode(worldCode, fileName) {
	worldPics[worldCode] = document.createElement("img");
	beginLoadingImage(worldPics[worldCode], fileName);
}

function loadImages() {
	var imageList = [
		{varName: workerIcon, theFile:"./images/icons/workericon.png"},
		{varName: workerIcon_Larger, theFile:"./images/icons/workericon_larger.png"},
		{varName: spearmanIcon, theFile:"./images/icons/spearmanicon.png"},
		{varName: spearmanIcon_Larger, theFile:"./images/icons/spearmanicon_larger.png"},
		{varName: archerIcon, theFile:"./images/icons/archericon.png"},
		{varName: archerIcon_Larger, theFile:"./images/icons/archericon_larger.png"},
		{varName: playerBase_Larger, theFile:"./images/icons/playerbase_larger.png"},
		{varName: playerCamp_Larger, theFile:"./images/icons/playercamp_larger.png"},
		{varName: playerBarracks_Larger, theFile:"./images/icons/playerbarracks_larger.png"},
		{varName: playerArmory_Larger, theFile:"./images/icons/playerarmory_larger.png"},
		{varName: playerWorkerIdle, theFile:"./images/playerAnimations/player_workeridle.png"},
		{varName: playerWorkerIdleLeft, theFile:"./images/playerAnimations/player_workeridleleft.png"},
		{varName: playerWorkerWalkLeft, theFile:"./images/playerAnimations/player_workerwalkleft.png"},
		{varName: playerWorkerWalkRight, theFile:"./images/playerAnimations/player_workerwalkright.png"},
		{varName: playerWorkerChopLeft, theFile:"./images/playerAnimations/player_workerchopleft.png"},
		{varName: playerWorkerChopRight, theFile:"./images/playerAnimations/player_workerchopright.png"},
		{varName: playerSpearmanIdle, theFile:"./images/playerAnimations/player_spearmanidle.png"},
		{varName: playerSpearmanIdleLeft, theFile:"./images/playerAnimations/player_spearmanidleleft.png"},
		{varName: playerSpearmanWalkLeft, theFile:"./images/playerAnimations/player_spearmanwalkleft.png"},
		{varName: playerSpearmanWalkRight, theFile:"./images/playerAnimations/player_spearmanwalkright.png"},
		{varName: playerArcherIdle, theFile:"./images/playerAnimations/player_archeridle.png"},
		{varName: playerArcherIdleLeft, theFile:"./images/playerAnimations/player_archeridleleft.png"},
		{varName: playerArcherWalkLeft, theFile:"./images/playerAnimations/player_archerwalkleft.png"},
		{varName: playerArcherWalkRight, theFile:"./images/playerAnimations/player_archerwalkright.png"},
		{varName: enemyWorkerIdle, theFile:"./images/enemyAnimations/enemy_workeridle.png"},
		{varName: enemyWorkerIdleLeft, theFile:"./images/enemyAnimations/enemy_workeridleleft.png"},
		{varName: enemyWorkerWalkLeft, theFile:"./images/enemyAnimations/enemy_workerwalkleft.png"},
		{varName: enemyWorkerWalkRight, theFile:"./images/enemyAnimations/enemy_workerwalkright.png"},
		{varName: enemyWorkerChopLeft, theFile:"./images/enemyAnimations/enemy_workerchopleft.png"},
		{varName: enemyWorkerChopRight, theFile:"./images/enemyAnimations/enemy_workerchopright.png"},
		{varName: enemySpearmanIdle, theFile:"./images/enemyAnimations/enemy_spearmanidle.png"},
		{varName: enemySpearmanIdleLeft, theFile:"./images/enemyAnimations/enemy_spearmanidleleft.png"},
		{varName: enemySpearmanWalkLeft, theFile:"./images/enemyAnimations/enemy_spearmanwalkleft.png"},
		{varName: enemySpearmanWalkRight, theFile:"./images/enemyAnimations/enemy_spearmanwalkright.png"},
		{varName: enemyArcherIdle, theFile:"./images/enemyAnimations/enemy_archeridle.png"},
		{varName: enemyArcherIdleLeft, theFile:"./images/enemyAnimations/enemy_archeridleleft.png"},
		{varName: enemyArcherWalkLeft, theFile:"./images/enemyAnimations/enemy_archerwalkleft.png"},
		{varName: enemyArcherWalkRight, theFile:"./images/enemyAnimations/enemy_archerwalkright.png"},
		{varName: rallyPointPic, theFile:"./images/rallypoint.png"},
		{varName: moveToDestinationIcon, theFile:"./images/movetodestinationicon.png"},
		{varName: attackMoveIcon, theFile:"./images/attackmoveicon.png"},
		{worldType: WORLD_GRASS, theFile: "./images/environment/grass.png"},
		{worldType: WORLD_TREE, theFile: "./images/environment/tree.png"},
		{worldType: PLAYER_BASE, theFile: "./images/buildings/player_base.png"},
		{worldType: PLAYER_CAMP, theFile: "./images/buildings/player_camp.png"},
		{worldType: PLAYER_BARRACKS, theFile: "./images/buildings/player_barracks.png"},
		{worldType: PLAYER_ARMORY, theFile: "./images/buildings/player_armory.png"},
		{worldType: ENEMY_BASE, theFile: "./images/buildings/enemy_base.png"},
		{worldType: ENEMY_CAMP, theFile: "./images/buildings/enemy_camp.png"},
		{worldType: ENEMY_BARRACKS, theFile: "./images/buildings/enemy_barracks.png"},
		{worldType: ENEMY_ARMORY, theFile: "./images/buildings/enemy_armory.png"}
		];

	picsToLoad = imageList.length;

	for (var i = 0; i < imageList.length; i++) {
		if (imageList[i].varName != undefined) {
			beginLoadingImage(imageList[i].varName, imageList[i].theFile);
		} else {
			loadImageForWorldCode( imageList[i].worldType, imageList[i].theFile );
		}

	}
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const FRAMES_PER_SECOND = 30;
var canvas, canvasContext;
var playerWins = false;
var enemyWins = false;


window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');
	canvas.width = CANVAS_WIDTH;
	canvas.height = CANVAS_HEIGHT;

	canvas.addEventListener('mousemove', mousemoveHandler);
	canvas.addEventListener('mousedown', mousedownHandler);
	canvas.addEventListener('mouseup', mouseupHandler);

	document.addEventListener('keydown', keyPressed);
	document.addEventListener('keyup', keyReleased);

	// stops the right click menu from opening up
	document.addEventListener('contextmenu', event => event.preventDefault());


	canvasContext.imageSmoothingEnabled = false;

	startScreenWithLoadingImagesText();
	loadImages();
	loadSounds();
	setupSpriteSheets();
}

function imagesDoneLoadingSoStartGame() {
	setInterval(updateAll, 1000/FRAMES_PER_SECOND);
}

// this will get called once we have building health
// it will only run once a building has been destroyed
function winConditionCheck() {
	if (playerBuildings.length <= 0) {
		enemyWins = true;
		console.log ("You have dishonored your family...");
	}
	if (enemyBuildings.length <= 0) {
		playerWins = true;
		console.log ("You have won! Congratulations!");
	}
}

function showVictoryScreen() {
	if (playerWins) {
		colorRect(0,0, canvas.width, canvas.height, 'black');
		colorText("You have won! Congratulations!", 280,400, 'white', GAME_FONT);
		colorText("Refresh the page to play again!", 310,450, 'white', GAME_UI_FONT_SMALL);
	} else {
		colorRect(0,0, canvas.width, canvas.height, 'black');
		colorText("You have dishonored your family...", 280,400, 'red', GAME_FONT);
		colorText("Refresh the page to play again!", 310,450, 'red', GAME_UI_FONT_SMALL);
	}
}


function updateAll() {
	if (playerWins == false &&
		enemyWins == false) {
		
		moveAll();
		drawAll();
	} else {
		showVictoryScreen();
	}
}

function moveAll() {

	for (var i = 0; i < allUnits.length; i++) {
		allUnits[i].move();
	}

	cameraFollow();
	keyboardInputChecks();
	clearFogOfWar();

	
	if (enemyAILoopCounter >= enemyAlertness) {
		mainEnemyAILoop();
		enemyAILoopCounter = 0;
	} else {
		enemyAILoopCounter++;
	}
	
	playBGMMusic();

}

function drawAll() {
	updateAnimations();
	updateCollisionGrid();
	updateFogOfWarGrid();

	if (cameraLock) {
		camPanX = 0;
		camPanY = 0;
	}
	canvasContext.save(); // this is needed to undo this .translate() used for scroll
	
	// this nex line is like subtracting camPanX/Y from every
	// canvasContext draw operation up until we call canvasContext.restore
	// that way, we can just draw them at their "actual" position coordinates
	canvasContext.translate(-camPanX, -camPanY);
	
	drawWorld();

	if (debugMode) {
		drawCollisionGrid();
	}

	for (var i = 0; i < allUnits.length; i++) {
		allUnits[i].draw();
	}

	// draws building timers and progress bars
	for (var i = 0; i < playerBuildings.length; i++) {
		playerBuildings[i].draw();
	}
	// draws building timers and progress bars
	for (var i = 0; i < enemyBuildings.length; i++) {
		enemyBuildings[i].draw();
	}	

	for (var i = 0; i < selectedBuildings.length; i++) {
		selectedBuildings[i].drawDottedLineAndRallyPoint();
		selectedBuildings[i].drawSelectionBox();
	}

	if (showBuildingGrid) {
		drawBuildingGrid();
	}

	// draws selection box
	if (isMouseDragging) {
		coloredOutlineRectCornerToCorner(lassoX1, lassoY1, lassoX2, lassoY2, 'white');
	}

	drawHealthBarsForUnitsAndBuildings();

	if (showFogOfWar) {
		drawFogOfWar();
	}

	for (var i = 0; i < selectedUnits.length; i++) {
		selectedUnits[i].drawSelectionBoxAndDestinationIcon();
	}

	canvasContext.restore(); // undoes the .translate() used for the camera scroll

	// doing this after .restore() so that it does not move with camera pan
	
	if (showUI) {
		drawUI();
	}

	if (showEnemyInfo) { 
		drawEnemyInfo();
	}


	if (tipsEnabled) {
		// show tips on easy mode
		if (mediumDifficulty == false && hardDifficulty == false) {

			if (madeFirstWorker == false) {
				drawMakeAWorkerText();
			} else if (madeFirstWorker && madeSecondWorker == false) {
				drawTip1();
			} else if (madeFirstWorker && madeSecondWorker && madeThirdWorker == false) {
				drawTip2();
			} else if (madeFirstWorker && madeSecondWorker && madeThirdWorker && madeFourthWorker == false) {
				drawTip3();
			} else if (madeFirstWorker && madeSecondWorker && madeThirdWorker && madeFourthWorker && madeFifthWorker == false) {
				drawTip4();
			} else if (madeFirstWorker && madeSecondWorker && madeThirdWorker && madeFourthWorker && madeFifthWorker && madeSixthWorker == false) {
				drawTip5();
			} else if (	madeFirstWorker &&
						madeSecondWorker &&
						madeThirdWorker &&
						madeFourthWorker &&
						madeFifthWorker &&
						madeSixthWorker &&
						doneShowingTips == false) {

				drawGoodLuck();

			} else if (playerCurrentSupply >= playerSupplyMax) {
				drawNeedMoreSupplyText();
			}
		}
	}
}

function drawHealthBarsForUnitsAndBuildings() {
	for (var i = 0; i < selectedUnits.length; i++) {
		selectedUnits[i].drawHealthBar();
	}

	for (var i = 0; i < enemyUnits.length; i++) {
		enemyUnits[i].drawHealthBar();
	}

	for (var i = 0; i < playerBuildings.length; i++) {
		playerBuildings[i].drawHealthBar();
	}

	for (var i = 0; i < enemyBuildings.length; i++) {
		enemyBuildings[i].drawHealthBar();
	}
}

function startScreenWithLoadingImagesText() {
	colorRect(0,0, canvas.width,canvas.height, 'black');
	colorText("LOADING IMAGES", (canvas.width/2) - 50, canvas.height/2, 'white');
}

function drawNeedMoreSupplyText() {
	colorText("BUILD A CAMP!", (canvas.width/2) - 50, canvas.height/2, 'white', GAME_FONT);
}

function drawMakeAWorkerText() {
	colorText("SEND YOUR WORKERS TO TREES TO CHOP WOOD", (canvas.width/2) - 175, canvas.height/2, 'white', GAME_FONT);
	colorText("AND MAKE A WORKER AT YOUR BASE!", (canvas.width/2) - 150, canvas.height/2 + 50, 'white', GAME_FONT);
}

function drawTip1() {
	colorText("NEVER STOP MAKING WORKERS, IT'S REALLY IMPORTANT!", (canvas.width/2) - 235, canvas.height/2, 'white', GAME_FONT);
	colorText("SET A RALLY POINT AT YOUR TREES!", (canvas.width/2) - 150, canvas.height/2 + 50, 'white', GAME_FONT);
}

function drawTip2() {
	colorText("KEEP MAKING WORKERS!", (canvas.width/2) - 90, canvas.height/2, 'white', GAME_FONT);
}

function drawTip3() {
	colorText("MAKE A CAMP AT 100 WOOD BEFORE RUNNING OUT OF SUPPLY!", (canvas.width/2) - 260, canvas.height/2, 'white', GAME_FONT);
}

function drawTip4() {
	colorText("KEEP MAKING WORKERS!", (canvas.width/2) - 90, canvas.height/2, 'white', GAME_FONT);
}

function drawTip5() {
	colorText("MAKE A BARRACKS TO MAKE MILITARY UNITS!", (canvas.width/2) - 175, canvas.height/2, 'white', GAME_FONT);
	colorText("MULTITASKING IS IMPORTANT!", (canvas.width/2) - 130, canvas.height/2 + 50, 'white', GAME_FONT);
}

function drawGoodLuck() {
	colorText("GOOD LUCK!", (canvas.width/2) - 50, canvas.height/2, 'white', GAME_FONT);
}
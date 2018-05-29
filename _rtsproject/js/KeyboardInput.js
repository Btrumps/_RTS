const KEY_Q = 81;
const KEY_W = 87;
const KEY_E = 69;
const KEY_A = 65;
const KEY_S = 83;
const KEY_D = 68;
const KEY_SHIFT = 16;
const KEY_CTRL = 17;
const KEY_ESC = 27; 
var keyPressed_Q = false;
var keyPressed_W = false;
var keyPressed_E = false;
var keyPressed_A = false;
var keyPressed_S = false;
var keyPressed_D = false;
var keyPressed_ESC = false;

var keyHeld_Shift = false;
var keyHeld_Ctrl = false;

var debugMode = false;

var cheatCodePressed_Y = false;
var cheatCodePressed_U = false;
var cheatCodePressed_I = false;
var cheatCodePressed_J = false;
var cheatCodePressed_L = false;
var cheatCodePressed_K = false;
var cheatCodePressed_O = false;
var cheatCodePressed_P = false;
const KEY_Y = 89;
const KEY_U = 85;
const KEY_I = 73;
const KEY_J = 74;
const KEY_L = 76;
const KEY_K = 75;
const KEY_O = 79; 
const KEY_P = 80;

var keyHeldTimer = 15;

var actionCount = 0;
var timeInSeconds;
var apmTimer = 0;
var apm;

function keyboardInputChecks() {
	createUnitButtonCheck();
	buildOptionsButtonCheck();
	purchaseUpgradeButtonCheck();
	attackMoveButtonCheck();
	createBuildingButtonCheck();
	clearEverythingCheck();
	cheatCodesCheck();
	setControlGroup();
	//addToControlGroup();
	useControlGroup();
	apmTimer++;
	timeInSeconds = (apmTimer / FRAMES_PER_SECOND);
	apm = Math.round((actionCount / timeInSeconds) * 60);
}


function cheatCodesCheck() {
	if (cheatCodePressed_O && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		mediumDifficulty = true;
		console.log('MEDIUM DIFFICULTY ACTIVATED');
	}
	if (cheatCodePressed_P && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		hardDifficulty = true;
		console.log('HARD DIFFICULTY ACTIVATED');
	}
	if (cheatCodePressed_Y && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		tipsEnabled = !tipsEnabled;
	}
	if (cheatCodePressed_U && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		musicEnabled = !musicEnabled;
	}
	/*
	if (cheatCodePressed_Y && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		showEnemyInfo = !showEnemyInfo;
	}
	if (cheatCodePressed_U && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		showFogOfWar = !showFogOfWar;
	}
	if (cheatCodePressed_I && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		debugMode = !debugMode;
	}
	if (cheatCodePressed_J && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		cameraLock = !cameraLock;
	}
	if (cheatCodePressed_L && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
	}
	if (cheatCodePressed_K && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		showUI = !showUI;
	}
	if (cheatCodePressed_O && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		playerCurrentWood += 500;
	}
	if (cheatCodePressed_P && keyHeldTimer >= 15) {
		keyHeldTimer = 0;
		playerSupplyMax += 50;
	}
	*/
}

function attackMoveButtonCheck() {
	if (keyPressed_A && 
		showBuildOptions == false &&
		showBuildingGrid == false &&
		keyHeldTimer >= 15) {

		keyHeldTimer = 0;
		attackMovePressed = true;
	}
}

function clearEverythingCheck() {

	if (keyPressed_ESC && showBuildingGrid) { 
		keyHeldTimer = 0; // allows to only run once until the key is released
		showBuildingGrid = false;
		showBuildOptions = false;

	// if we are not showing building grid and unit's are selected...
	} else if (	keyPressed_ESC && showBuildingGrid == false &&
				selectedUnits.length > 0 && keyHeldTimer >= 15) {

					// deselect units, and close build options
					selectedUnits = [];
					showBuildOptions = false;

	// if we have no units selected and a building selected...
	} else if (	keyPressed_ESC && selectedUnits.length == 0 &&
				selectedBuildings.length > 0 && keyHeldTimer >= 15) { 

					for (var i = 0; i < selectedBuildings.length; i++) {
						var lastUnitInBuildQueueIndex = selectedBuildings[i].buildQueue.length - 1;
						var lastUnit = selectedBuildings[i].buildQueue[lastUnitInBuildQueueIndex];
						// if the selected building has a build queue
						if (selectedBuildings[i].buildQueue.length > 0) {
							if (selectedBuildings[i].isArmory) {
								if (lastUnit.unitType == DAMAGE) {
									damageUpgradeCost -= DAMAGE_UPGRADE_COST;
									maxDamageUpgradeCount++;
								} else if (lastUnit.unitType == ATTACK_RATE) {
									attackRateUpgradeCost -= ATTACK_RATE_UPGRADE_COST;
									maxAttackRateUpgradeCount++;
								}
							} else {
								// we don't want to set icons for upgrades
								selectedBuildings[i].iconToShow.splice(lastUnitInBuildQueueIndex, 1);
								selectedBuildings[i].setUnitIcons();
							}

							selectedBuildings[i].buildQueue.splice(lastUnitInBuildQueueIndex, 1);
							
							// refund
							playerCurrentWood += lastUnit.unitCost;
							keyHeldTimer = 0;
						} else {
							selectedBuildings = [];
						}
					}
		
	}
}

function buildOptionsButtonCheck() {
	if (keyPressed_D && selectedUnits.length > 0) {
				showBuildOptions = true;
	}
}

function createBuildingButtonCheck() {
	if (keyPressed_Q && selectedUnits.length > 0) {
		for (var i = 0; i < selectedUnits.length; i++) {
			if (selectedUnits[i].isWorker && 
				showBuildOptions == true &&
				playerCurrentWood >= BASE_BUY_COST) {

				buildingToShow = PLAYER_BASE;
				buildingToMake = BASE;
				showBuildingGrid = true;
				showBuildOptions = false;

			} else if (	keyHeldTimer >= 15 &&
						playerCurrentWood < BASE_BUY_COST) {
				keyHeldTimer = 0;
				playNotEnoughResourcesSound();
			}
		}
	}

	if (keyPressed_W && selectedUnits.length > 0) {
		for (var i = 0; i < selectedUnits.length; i++) {
			if (selectedUnits[i].isWorker && 
				showBuildOptions == true &&
				playerCurrentWood >= CAMP_BUY_COST) {

				buildingToShow = PLAYER_CAMP;
				buildingToMake = CAMP;
				showBuildingGrid = true;
				showBuildOptions = false;

			} else if (	keyHeldTimer >= 15 &&
						playerCurrentWood < CAMP_BUY_COST) {
				keyHeldTimer = 0;
				playNotEnoughResourcesSound();
			}
		}
	}

	if (keyPressed_E && selectedUnits.length > 0) {
		for (var i = 0; i < selectedUnits.length; i++) {
			if (selectedUnits[i].isWorker && 
				showBuildOptions == true &&
				playerCurrentWood >= BARRACKS_BUY_COST) {

				buildingToShow = PLAYER_BARRACKS;
				buildingToMake = BARRACKS;
				showBuildingGrid = true;
				showBuildOptions = false;
			} else if (	keyHeldTimer >= 15 &&
						playerCurrentWood < BARRACKS_BUY_COST) {
				keyHeldTimer = 0;
				playNotEnoughResourcesSound();
			}
		}
	}

	if (keyPressed_A && selectedUnits.length > 0) {
		for (var i = 0; i < selectedUnits.length; i++) {
			if (selectedUnits[i].isWorker && 
				showBuildOptions == true &&
				playerCurrentWood >= ARMORY_BUY_COST) {

				buildingToShow = PLAYER_ARMORY;
				buildingToMake = ARMORY;
				showBuildingGrid = true;
				showBuildOptions = false;
			} else if (	keyHeldTimer >= 15 &&
						playerCurrentWood < ARMORY_BUY_COST) {
				keyHeldTimer = 0;
				playNotEnoughResourcesSound();
			}
		}
	}
}

function createUnitButtonCheck() {
	// finds the next building to make units out of, if selecting more than one building
	if (selectedBuildings.length > 1) {
			var nextBuildingToUse;
			var lowestQueueSize;
			var hasStoredFirstQueueSize = false;

			for (var i = 0; i < selectedBuildings.length; i++) {
				if (hasStoredFirstQueueSize == false) {
					lowestQueueSize = selectedBuildings[i].buildQueue.length;
					nextBuildingToUse = selectedBuildings[i];
					hasStoredFirstQueueSize = true;
				}
				if (selectedBuildings[i].buildQueue.length < lowestQueueSize) {
					lowestQueueSize = selectedBuildings[i].buildQueue.length;
					nextBuildingToUse = selectedBuildings[i];
				}

			}
	}

	if (keyPressed_Q && selectedBuildings.length > 0) {
		if (keyHeldTimer < 15) {
			keyHeldTimer++;
		}

		for (var i = 0; i < selectedBuildings.length; i++) {
			if (selectedBuildings[i].isBase &&
				keyHeldTimer >= 15) {
				if (playerCurrentSupply < playerSupplyMax &&
					playerCurrentWood >= WORKER_BUY_COST) {

					checkWhichTipToShow();

					if (selectedBuildings.length > 1) {
						nextBuildingToUse.addUnitToQueue(WORKER);
					} else {
						selectedBuildings[i].addUnitToQueue(WORKER);
					}
					
					keyHeldTimer = 0;

				} else if (playerCurrentWood < WORKER_BUY_COST) {
					playNotEnoughResourcesSound();
				} else {
					playNeedMoreSupplySound();
				}
			} else if (selectedBuildings[i].isBarracks && 
				keyHeldTimer >= 15) {
				if (playerCurrentSupply < playerSupplyMax &&
					playerCurrentWood >= SPEARMAN_BUY_COST) {

					if (selectedBuildings.length > 1) {
						nextBuildingToUse.addUnitToQueue(SPEARMAN);
					} else {
						selectedBuildings[i].addUnitToQueue(SPEARMAN);
					}
					keyHeldTimer = 0;

				} else if (playerCurrentWood < SPEARMAN_BUY_COST) {
					playNotEnoughResourcesSound();
				} else {
					playNeedMoreSupplySound();
				}
			}
		}
	}

	if (keyPressed_W && selectedBuildings.length > 0) {
		if (keyHeldTimer < 15) {
			keyHeldTimer++;
		}
		for (var i = 0; i < selectedBuildings.length; i++) {
			if (selectedBuildings[i].isBarracks &&
				keyHeldTimer >= 15) {
				if (playerCurrentSupply < playerSupplyMax &&
					playerCurrentWood >= ARCHER_BUY_COST) {
					
					if (selectedBuildings.length > 1) {
						nextBuildingToUse.addUnitToQueue(ARCHER);
					} else {
						selectedBuildings[i].addUnitToQueue(ARCHER);
					}

					keyHeldTimer = 0;
				} else if (playerCurrentWood < ARCHER_BUY_COST) {
					playNotEnoughResourcesSound();
				} else {
					playNeedMoreSupplySound();
				}
			}
		}
	}
}

function purchaseUpgradeButtonCheck() {
	if (keyPressed_Q && selectedBuildings.length > 0) {
		if (keyHeldTimer < 15) {
			keyHeldTimer++;
		}
		for (var i = 0; i < selectedBuildings.length; i++) {
			if (selectedBuildings[i].isArmory && keyHeldTimer >= 15 &&
				maxDamageUpgradeCount > 0) {
				if (playerCurrentWood >= damageUpgradeCost) {
					selectedBuildings[i].addUpgradeToQueue(DAMAGE);
					damageUpgradeCost += DAMAGE_UPGRADE_COST;
					maxDamageUpgradeCount--;
					keyHeldTimer = 0;
				} else {
					playNotEnoughResourcesSound();
				}
			}
		}
	}

	if (keyPressed_W && selectedBuildings.length > 0) {
		if (keyHeldTimer < 15) {
			keyHeldTimer++;
		}
		for (var i = 0; i < selectedBuildings.length; i++) {
			if (selectedBuildings[i].isArmory && keyHeldTimer >= 15 &&
				maxAttackRateUpgradeCount > 0) {
				if (playerCurrentWood >= attackRateUpgradeCost) {
					selectedBuildings[i].addUpgradeToQueue(ATTACK_RATE);
					attackRateUpgradeCost += ATTACK_RATE_UPGRADE_COST;
					maxAttackRateUpgradeCount--;
					keyHeldTimer = 0;
				} else {
					playNotEnoughResourcesSound();
				}
			}
		}
	}
}

function checkWhichTipToShow() {
	if (madeSeventhWorker) {
		doneShowingTips = true;
	}
	if (madeFifthWorker) {
		madeSeventhWorker = true;
	}
	if (madeFifthWorker) {
		madeSixthWorker = true;
	}
	if (madeFourthWorker) {
		madeFifthWorker = true;
	}
	if (madeThirdWorker) {
		madeFourthWorker = true;
	}
	if (madeSecondWorker) {
		madeThirdWorker = true;
	}
	if (madeFirstWorker) {
		madeSecondWorker = true;
	}

	madeFirstWorker = true;
}

function keyAction(keyEvt, switchTo) {
	if (keyEvt.keyCode == KEY_Q) {
		keyPressed_Q = switchTo;
	}
	if (keyEvt.keyCode == KEY_W) {
		keyPressed_W = switchTo;
	}
	if (keyEvt.keyCode == KEY_E) {
		keyPressed_E = switchTo;
	}
	if (keyEvt.keyCode == KEY_A) {
		keyPressed_A = switchTo;
	}
	if (keyEvt.keyCode == KEY_S) {
		keyPressed_S = switchTo;
	}
	if (keyEvt.keyCode == KEY_D) {
		keyPressed_D = switchTo;
	}
	if (keyEvt.keyCode == KEY_SHIFT) {
		keyHeld_Shift = switchTo;
	}
	if (keyEvt.keyCode == KEY_CTRL) {
		keyHeld_Ctrl = switchTo;
	}
	if (keyEvt.keyCode == KEY_ESC) {
		keyPressed_ESC = switchTo;
	}
	if (keyEvt.keyCode == KEY_Y) {
		cheatCodePressed_Y = switchTo;
	}
	if (keyEvt.keyCode == KEY_U) {
		cheatCodePressed_U = switchTo;
	}
	if (keyEvt.keyCode == KEY_I) {
		cheatCodePressed_I = switchTo;
	}
	if (keyEvt.keyCode == KEY_J) {
		cheatCodePressed_J = switchTo;
	}
	if (keyEvt.keyCode == KEY_L) {
		cheatCodePressed_L = switchTo;
	}
	if (keyEvt.keyCode == KEY_K) {
		cheatCodePressed_K = switchTo;
	}
	if (keyEvt.keyCode == KEY_O) {
		cheatCodePressed_O = switchTo;
	}
	if (keyEvt.keyCode == KEY_P) {
		cheatCodePressed_P = switchTo;
	}
	if (keyEvt.keyCode == KEY_1) {
		keyPressed_1 = switchTo;
		numberHasBeenPressed = switchTo;
	}
	if (keyEvt.keyCode == KEY_2) {
		keyPressed_2 = switchTo;
		numberHasBeenPressed = switchTo;
	}
	if (keyEvt.keyCode == KEY_3) {
		keyPressed_3 = switchTo;
		numberHasBeenPressed = switchTo;
	}
	if (keyEvt.keyCode == KEY_4) {
		keyPressed_4 = switchTo;
		numberHasBeenPressed = switchTo;
	}
	if (keyEvt.keyCode == KEY_5) {
		keyPressed_5 = switchTo;
		numberHasBeenPressed = switchTo;
	}
}

function keyPressed(evt) {
	evt.preventDefault();
	keyAction(evt, true);
}

function keyReleased(evt) {
	keyAction(evt, false);
	keyHeldTimer = 15; // resets the fixed rate actions can occur when holding down a key
	actionCount++;
}
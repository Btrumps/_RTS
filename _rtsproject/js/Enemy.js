const ENEMY_MAIN_BASE_X = 940;
const ENEMY_MAIN_BASE_Y = 780;
const ENEMY_FIRST_EXPANSION_X = 220;
const ENEMY_FIRST_EXPANSION_Y = 780;

const MAX_DIST_TO_SEARCH_FOR_TREE = 400;
const MAX_DIST_TO_CHECK_FOR_WORKERS = 300;
const MAX_WORKERS_PER_BASE = 15;

const MIN_ARMY_COUNT_TO_SEND_ATTACK = 5;

// the lower the number, the more often the main AI loop runs
// lower number, times run per frame... more actions. 
var enemyAlertness = 90;
var enemyAILoopCounter = 0;

var enemyNumberOfBarracksMade = 0;

var foundWorkerToBuildBase = false;
var foundWorkerToBuildCamp = false;
var foundWorkerToBuildBarracks = false;

var enemyCampHasBeenMade = false;
var enemyBarracksHasBeenMade = false;

var enemyCurrentState;

var sentOutAttack = false;
var enemyBuildingUnderAttack = false;
var defendingAttack = false;
var buildingsBeingAttacked = [];

var enemyCurrentWood = 50;
var enemyCurrentSupply = 0;
var enemySupplyMax = 5;

var showEnemyInfo = false;
var mediumDifficulty = false;
var hardDifficulty = false;

function mainEnemyAILoop() {

	// needs to be above the rest of the logic, as having a base is imperative to collecting more wood
	if (enemyBases.length == 0 &&
		enemyCurrentWood >= BASE_BUY_COST &&
		foundWorkerToBuildBase == false) {
		var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

		if (percentChanceToExecute > 0) { // 100% chance to build base
			buildEnemyBuilding(BASE, BASE_BUY_COST);
		}
		

	} else if (	enemyBases.length == 0 &&
				enemyCurrentWood < BASE_BUY_COST &&
				foundWorkerToBuildBase == false) {
		var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

		if (percentChanceToExecute > 0) { // 100% chance to launch all out attack
			console.log('enemy doesnt have enough wood to rebuild base');
			sendAttackAtPlayerBuildings(true);
		}

	} else {

		if (enemyCurrentSupply >= enemySupplyMax - 1 &&
			enemyCurrentWood >= CAMP_BUY_COST &&
			foundWorkerToBuildCamp == false) {
			var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

			if (mediumDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.3, 1);
			}

			if (hardDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.6, 1);
			}

			if (percentChanceToExecute > 0.85) { // 15% chance to build camp
				buildEnemyBuilding(CAMP, CAMP_BUY_COST);
			}
		}

		for (var i = 0; i < enemyBases.length; i++) {
			var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

			if (mediumDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.2, 1);
			}

			if (hardDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.5, 1);
			}

			if (percentChanceToExecute > 0.85) { // 15% chance to build worker
				makeWorkersUntilMax(enemyBases[i]);
			}
		}

		if (enemyCurrentSupply < enemySupplyMax &&
			enemyBarracksHasBeenMade) {
			var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

			if (mediumDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.2, 1);
			}

			if (hardDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.4, 1);
			}

			if (percentChanceToExecute > 0.6) { // 40% chance to build military unit
		
				for (var i = 0; i < enemyBarracks.length; i++) {
					var unitToMake = selectUnitTypeAtRandom();

					if (unitToMake == SPEARMAN &&
						enemyCurrentWood >= SPEARMAN_BUY_COST) {
						enemyBarracks[i].addUnitToQueue(SPEARMAN);

					} else if (	unitToMake == ARCHER &&
						enemyCurrentWood >= ARCHER_BUY_COST) {
						enemyBarracks[i].addUnitToQueue(ARCHER);
					}
				}
			}
		}

		if (enemyCurrentWood >= BARRACKS_BUY_COST &&
			enemyCampHasBeenMade &&
			enemyNumberOfBarracksMade < enemyWorkers.length / 5 && // 5 is a placeholder
			foundWorkerToBuildBarracks == false) {

			var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

			if (mediumDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.2, 1);
			}

			if (hardDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.4, 1);
			}

			if (percentChanceToExecute > 0.6) { // 40% chance to build a barracks

				buildEnemyBuilding(BARRACKS, BARRACKS_BUY_COST);
			}
		}

		if (enemyUnits.length - enemyWorkers.length >= MIN_ARMY_COUNT_TO_SEND_ATTACK &&
			enemyBuildingUnderAttack == false) {
			var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

			if (mediumDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.2, 1);
			}

			if (hardDifficulty) {
				percentChanceToExecute = getRandomNumberBetweenMinMax(0.6, 1);
			}

			if (percentChanceToExecute > 0.9) { // 10% chance to send attack to players base
				sendAttackAtPlayerBuildings(false);
			}
		}

		if (enemyBuildingUnderAttack) {

			var percentChanceToExecute = getRandomNumberBetweenMinMax(0,1);

			if (percentChanceToExecute > 0) { // 100% chance to defend attack
			
				buildingsBeingAttacked = [];
				
				for (var i = 0; i < enemyBuildings.length; i++) {
					if (enemyBuildings[i].isBeingAttacked) {
						buildingsBeingAttacked.push(enemyBuildings[i]);
					}
				}

				defendBuilding(buildingsBeingAttacked);
				enemyBuildingUnderAttack = false;
			}
		}
		
	}

}

function defendBuilding(arrayOfBuildings) {
	if (arrayOfBuildings.length > 1) {
		var numberOfMilitary = enemyUnits.length - enemyWorkers.length;
		var numberOfUnitsToSendToEachBuilding = numberOfMilitary / arrayOfBuildings.length;
		var unitsToSend = numberOfUnitsToSendToEachBuilding;

		for (var i = 0; i < arrayOfBuildings.length; i++) {
			for (var j = 0; j < enemyUnits.length; j++) {
				if (enemyUnits[j].isWorker == false &&
					enemyUnits[j].currentState != PLAYER_STATE_ATTACKING_ENEMY_UNIT) {

					enemyUnits[j].attack(arrayOfBuildings[i].attackedBy);
					unitsToSend--;

					if (unitsToSend == 0) {
						unitsToSend = numberOfUnitsToSendToEachBuilding;
						break;
					}
				}
			}
		}
		
	} else if (arrayOfBuildings.length == 1) {
		for (var i = 0; i < enemyUnits.length; i++) {
			if (enemyUnits[i].isWorker == false &&
				enemyUnits[i].currentState != PLAYER_STATE_ATTACKING_ENEMY_UNIT) {

				enemyUnits[i].attack(arrayOfBuildings[0].attackedBy);
			}
		}
	}
}

function buildEnemyBuilding(whichBuilding, buildingCost) {

	// length - 1 as it is choosing from an array index
	var randomWorkerIndex = getRoundedRandomNumberBetweenMinMax(0, enemyWorkers.length - 1);

	while (	enemyWorkers[randomWorkerIndex].currentState == PLAYER_STATE_BUILDING ||
			enemyWorkers[randomWorkerIndex].enemyCurrentState == PLAYER_STATE_WALKING_TO_BUILD) {

		randomWorkerIndex = getRoundedRandomNumberBetweenMinMax(0, enemyWorkers.length - 1);
	}

	if (whichBuilding == BASE) {
		if (enemyBases.length == 0) {
			var buildingCol = Math.floor(ENEMY_MAIN_BASE_X/WORLD_W);
			var buildingRow = Math.floor(ENEMY_MAIN_BASE_Y/WORLD_H);
			var buildingIndex = colRowToArrayIndex(buildingCol, buildingRow);
		} else if (enemyBases.length == 1) {
			var buildingCol = Math.floor(ENEMY_FIRST_EXPANSION_X/WORLD_W);
			var buildingRow = Math.floor(ENEMY_FIRST_EXPANSION_Y/WORLD_H);
			var buildingIndex = colRowToArrayIndex(buildingCol, buildingRow);
		}
	} else {

		var buildingCol = Math.floor((getRandomNumberBetweenMinMax(0.75, 0.95) * enemyWorkers[randomWorkerIndex].closestBaseX)/WORLD_W);
		var buildingRow = Math.floor((getRandomNumberBetweenMinMax(0.75, 0.95) * enemyWorkers[randomWorkerIndex].closestBaseY)/WORLD_H);
		var buildingIndex = colRowToArrayIndex(buildingCol, buildingRow);

		var maxLimit = 2000;

		while (worldGrid[buildingIndex] != WORLD_GRASS) {
			buildingCol = Math.floor((getRandomNumberBetweenMinMax(0.80, 0.95) * enemyWorkers[randomWorkerIndex].closestBaseX)/WORLD_W);
			buildingRow = Math.floor((getRandomNumberBetweenMinMax(0.80, 0.95) * enemyWorkers[randomWorkerIndex].closestBaseY)/WORLD_H);

			buildingIndex = colRowToArrayIndex(buildingCol, buildingRow);
			maxLimit--;

			if (maxLimit <= 0) {
				console.log('max limit reached in buildEnemyBuilding... cant find spot to build');
				break;
			}
		}

	}
		

		enemyWorkers[randomWorkerIndex].goToNear(buildingCol * WORLD_W, buildingRow * WORLD_H);
		enemyWorkers[randomWorkerIndex].arrayIndexForBuilding = buildingIndex;
		enemyWorkers[randomWorkerIndex].buildingX = buildingCol * WORLD_W;
		enemyWorkers[randomWorkerIndex].buildingY = buildingRow * WORLD_H;

		enemyWorkers[randomWorkerIndex].currentState = PLAYER_STATE_WALKING_TO_BUILD;
		enemyWorkers[randomWorkerIndex].whatToBuild = whichBuilding;
		enemyCurrentWood -= buildingCost;

		if (whichBuilding == BASE) {
			foundWorkerToBuildBase = true;
		} else if (whichBuilding == CAMP) {
			foundWorkerToBuildCamp = true;
		} else if (whichBuilding == BARRACKS) {
			foundWorkerToBuildBarracks = true;
		}
}


function returnWorkersAtBase(baseX, baseY) {
	var amountOfWorkersAtBase = 0;
	for (var i = 0; i < enemyWorkers.length; i++) {
		if (enemyWorkers[i].distFrom(baseX, baseY) < MAX_DIST_TO_CHECK_FOR_WORKERS) {
			amountOfWorkersAtBase++;
		}
	}

	return amountOfWorkersAtBase;
}

function makeWorkersUntilMax(whichBase) {
	var amountOfWorkers = enemyWorkers.length;

	if (amountOfWorkers < (MAX_WORKERS_PER_BASE * enemyBases.length) && whichBase.buildQueue.length == 0) {
		findClosestTreeAndSetRally(whichBase);
		whichBase.addUnitToQueue(WORKER);
	}
}

function allEnemyWorkersFindTreesAndChop() {
	for (var i = 0; i < enemyWorkers.length; i++) {
		if (enemyWorkers[i].currentState != PLAYER_STATE_BUILDING ||
			enemyWorkers[i].currentState != PLAYER_STATE_WALKING_TO_BUILD) {
			findClosestTreeAndGoTo(enemyWorkers[i]);
		}
	}
}

function allEnemyWorkersStoreClosestBase() {
	for (var i = 0; i < enemyWorkers.length; i++) {
		enemyWorkers[i].findClosestEnemyBase();
	}
}

function selectUnitTypeAtRandom() {
	var randomNumber = Math.random();

	if (randomNumber < 0.6) {
		return SPEARMAN;
	} else {
		return ARCHER;
	}
}

function sendAttackAtPlayerBuildings(allOutAttack) {

	for (var i = 0; i < enemyUnits.length; i++) {
		if (enemyUnits[i].sentOutForAttack == false) {
			if (allOutAttack) {
				if (playerBases.length > 0) {
					var latestPlayerBase = playerBases.length - 1;
					enemyUnits[i].currentState = PLAYER_STATE_ATTACK_MOVE;
					enemyUnits[i].goToNear(playerBases[latestPlayerBase].x, playerBases[latestPlayerBase].y);
					enemyUnits[i].sentOutForAttack = true;
				} else if (playerBuildings.length > 0) {
					var randomBuildingIndex = getRoundedRandomNumberBetweenMinMax(0, playerBuildings.length - 1);
					enemyUnits[i].currentState = PLAYER_STATE_ATTACK_MOVE;
					enemyUnits[i].goToNear(playerBuildings[randomBuildingIndex].x, playerBuildings[randomBuildingIndex].y);
					enemyUnits[i].sentOutForAttack = true;
				}
				
			} else {
				if (enemyUnits[i].isWorker == false) {
					if (playerBases.length > 0) {
						var latestPlayerBase = playerBases.length - 1;
						enemyUnits[i].currentState = PLAYER_STATE_ATTACK_MOVE;
						enemyUnits[i].goToNear(playerBases[latestPlayerBase].x, playerBases[latestPlayerBase].y);
						enemyUnits[i].sentOutForAttack = true;
					} else if (playerBuildings.length > 0) {
						var randomBuildingIndex = getRoundedRandomNumberBetweenMinMax(0, playerBuildings.length - 1);
						enemyUnits[i].currentState = PLAYER_STATE_ATTACK_MOVE;
						enemyUnits[i].goToNear(playerBuildings[randomBuildingIndex].x, playerBuildings[randomBuildingIndex].y);
						enemyUnits[i].sentOutForAttack = true;
					}
				}
			}
		}
	}


}

function drawEnemyInfo() {
	colorText(	"ENEMY INFO:",
				canvas.width-255, 75, 'white', GAME_FONT);

	colorText(	"WOOD:" + enemyCurrentWood,
				canvas.width-255, 95, 'white', GAME_FONT);

	colorText(	"SUPPLY:" + enemyCurrentSupply + "/" + enemySupplyMax,
				canvas.width-145, 95, 'white', GAME_FONT);
}
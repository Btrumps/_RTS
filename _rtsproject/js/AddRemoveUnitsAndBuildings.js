const PLAYER_STARTING_WORKER_COUNT = 3;

var playerUnits = [];
var playerBases = [];
var playerBuildings = []; // when this length == 0, game over

var enemyUnits = [];
var enemyWorkers = [];
var enemyBases = [];
var enemyBarracks = [];
var enemyBuildings = [];

var allUnits = [];

var playerHasStoredStartingBase = false;
var enemyHasStoredStartingBase = false;

function addNewUnitToTeam(spawnedUnit, whichTeam) {
	whichTeam.push(spawnedUnit);
	allUnits.push(spawnedUnit);
}

// have to have two separate functions (one for player, one for enemy) because
// we need to add one to list of player buildings (to tell when game is over)
function addNewPlayerBase(base) {
	playerBases.push(base);
	playerBuildings.push(base);
}

function addPlayerStartingBase(atX, atY) {
	if (playerHasStoredStartingBase == false) {
		var playerStartingBase = new baseClass(atX, atY);
		playerStartingBase.reset();
		playerStartingBase.hasBeenBuilt = true;
		spawnPlayerUnit(WORKER, atX,atY, atX - 20, atY);
		spawnPlayerUnit(WORKER, atX, atY, atX + 20, atY - 20);
		playerStartingBase.isPlayer = true;
		addNewPlayerBase(playerStartingBase);
		playerHasStoredStartingBase = true;
	}
}

function addNewPlayerBuilding(whichBuilding, atX, atY, whichWorker) {
	if (whichBuilding == BASE) {
		var spawnedBuilding = new baseClass(atX, atY, whichWorker);
		playerBases.push(spawnedBuilding);
	} else if (whichBuilding == CAMP) {
		var spawnedBuilding = new campClass(atX, atY, whichWorker);
	} else if (whichBuilding == BARRACKS) {
		var spawnedBuilding = new barracksClass(atX, atY, whichWorker);
	} else if (whichBuilding == ARMORY) {
		var spawnedBuilding = new armoryClass(atX, atY, whichWorker);
	}
	whichWorker.currentState = PLAYER_STATE_BUILDING;
	spawnedBuilding.isPlayer = true;
	spawnedBuilding.reset();
	spawnedBuilding.buildTimerHasBeenStarted = true;
	playerBuildings.push(spawnedBuilding);
}

function spawnPlayerUnit(whichUnit, fromX,fromY, goX,goY) {
	var unitToSpawn;
	if (whichUnit == WORKER) {
		unitToSpawn = new workerClass(true, fromX,fromY, goX,goY);
	} else if (whichUnit == SPEARMAN) {
		unitToSpawn = new spearmanClass(true, fromX,fromY, goX,goY);
	} else if (whichUnit == ARCHER) {
		unitToSpawn = new archerClass(true, fromX,fromY, goX,goY);
	}

	unitToSpawn.reset();
	playerCurrentSupply++;
	addNewUnitToTeam(unitToSpawn, playerUnits);
}

function killPlayer(whichPlayer) {

	if (whichPlayer.isUnit) {
		var indexFromSelectedUnits = selectedUnits.indexOf(whichPlayer);
		var indexFromPlayerUnits = playerUnits.indexOf(whichPlayer);
		var indexFromAllUnits = allUnits.indexOf(whichPlayer);

		playerCurrentSupply--;
		selectedUnits.splice(indexFromSelectedUnits, 1);
		playerUnits.splice(indexFromPlayerUnits, 1);
		allUnits.splice(indexFromAllUnits, 1);
	}

	if (whichPlayer.isUnit == false) {
		var indexFromSelectedBuildings = selectedBuildings.indexOf(whichPlayer);
		var indexFromPlayerBuildings = playerBuildings.indexOf(whichPlayer);
		
		if (whichPlayer.isBase) {
			var indexFromPlayerBases = playerBases.indexOf(whichPlayer);
			playerBases.splice(indexFromPlayerBases, 1);
		} else if (whichPlayer.isCamp) {
			playerSupplyMax -= SUPPLY_INCREASE_AMOUNT;
		}

		worldGrid[whichPlayer.arrayIndex] = WORLD_GRASS;
		selectedBuildings.splice(indexFromSelectedBuildings, 1);
		playerBuildings.splice(indexFromPlayerBuildings, 1);
		winConditionCheck();
	}

	whichPlayer.hasBeenKilled = true;
}

// ENEMY STUFF BELOW

function addNewEnemyBase(base) {
	enemyBases.push(base);
	enemyBuildings.push(base);
}

function addEnemyStartingBase(atX, atY) {
	if (enemyHasStoredStartingBase == false) {
		enemyStartingBase = new baseClass(atX, atY);
		enemyStartingBase.reset();
		enemyStartingBase.hasBeenBuilt = true;
		findClosestTreeAndSetRally(enemyStartingBase);
		spawnEnemyUnit(WORKER, atX,atY, enemyStartingBase.rallyPointX, enemyStartingBase.rallyPointY);
		spawnEnemyUnit(WORKER, atX,atY, enemyStartingBase.rallyPointX, enemyStartingBase.rallyPointY);
		//spawnEnemyUnit(SPEARMAN, 600,400 ,640,400); // to test combat
		//spawnEnemyUnit(SPEARMAN, 600,400 ,640,400); // to test combat
		//spawnEnemyUnit(ARCHER, 600,420 ,620, 420); // to test combat
		enemyStartingBase.isPlayer = false;
		addNewEnemyBase(enemyStartingBase, enemyBases);
		enemyHasStoredStartingBase = true;
	}
}

// we pass in the worker making the building
// so we can change it's state once finished building
function addNewEnemyBuilding(whichBuilding, atX, atY, whichWorker) {
	if (whichBuilding == BASE) {
		var spawnedBuilding = new baseClass(atX, atY, whichWorker);
		enemyBases.push(spawnedBuilding);
	} else if (whichBuilding == CAMP) {
		var spawnedBuilding = new campClass(atX, atY, whichWorker);
	} else if (whichBuilding == BARRACKS) {
		var spawnedBuilding = new barracksClass(atX, atY, whichWorker);
		enemyBarracks.push(spawnedBuilding);
	} else if (whichBuilding == ARMORY) {
		var spawnedBuilding = new armoryClass(atX, atY, whichWorker);
	}
	whichWorker.currentState = PLAYER_STATE_BUILDING;
	spawnedBuilding.isPlayer = false;
	spawnedBuilding.reset();
	spawnedBuilding.buildTimerHasBeenStarted = true;
	enemyBuildings.push(spawnedBuilding);
}

function spawnEnemyUnit(whichUnit, fromX,fromY, goX,goY) {
	var unitToSpawn;
	if (whichUnit == WORKER) {
		unitToSpawn = new workerClass(false, fromX,fromY, goX,goY);
		enemyWorkers.push(unitToSpawn);
	} else if (whichUnit == SPEARMAN) {
		unitToSpawn = new spearmanClass(false, fromX,fromY, goX,goY);
	} else if (whichUnit == ARCHER) {
		unitToSpawn = new archerClass(false, fromX,fromY, goX,goY);
	}

	unitToSpawn.reset();
	enemyCurrentSupply++;
	addNewUnitToTeam(unitToSpawn, enemyUnits);
}

function killEnemy(whichEnemy) {

	if (whichEnemy.isUnit) {
		var indexFromEnemyUnits = enemyUnits.indexOf(whichEnemy);
		var indexFromAllUnits = allUnits.indexOf(whichEnemy);

		if (whichEnemy.isWorker) {
			var indexFromEnemyWorkers = enemyWorkers.indexOf(whichEnemy);
			enemyWorkers.splice(indexFromEnemyWorkers, 1);

			if (whichEnemy.currentState == PLAYER_STATE_BUILDING ||
			whichEnemy.currentState == PLAYER_STATE_WALKING_TO_BUILD) {

				if (whichEnemy.whatToBuild == CAMP) {
				 	foundWorkerToBuildCamp = false;
				} else if (whichEnemy.whatToBuild == BARRACKS) {
				 	foundWorkerToBuildBarracks = false;
				}
			}
		}

		enemyCurrentSupply--;
		enemyUnits.splice(indexFromEnemyUnits, 1);
		allUnits.splice(indexFromAllUnits, 1);
	}

	if (whichEnemy.isUnit == false) {
		var indexFromEnemyBuildings = enemyBuildings.indexOf(whichEnemy);
		
		if (whichEnemy.isBase) {
			var indexFromEnemyBases = enemyBases.indexOf(whichEnemy);
			enemyBases.splice(indexFromEnemyBases, 1);

		} else if (whichEnemy.isCamp) {
			enemySupplyMax -= SUPPLY_INCREASE_AMOUNT;

		} else if (whichEnemy.isBarracks) {
			var indexFromEnemyBarracks = enemyBarracks.indexOf(whichEnemy);
			enemyBarracks.splice(indexFromEnemyBarracks, 1);
		}

		worldGrid[whichEnemy.arrayIndex] = WORLD_GRASS;
		enemyBuildings.splice(indexFromEnemyBuildings, 1);
		winConditionCheck();

	}

	whichEnemy.hasBeenKilled = true;
}
const UNIT_W = 40;
const UNIT_H = 40;

const WORKER_GATHERING_RATE = 0.25;
const WORKER_MAX_CARRYING_CAPACITY = 10;
const WORKER_BASE_SPEED = 3;
const WORKER_MAX_HEALTH = 100;
const WORKER_ATTACK_RANGE = 30;
const WORKER_ATTACK_RATE = 45;
const WORKER_ATTACK_DAMAGE = 25;


const CLOSEST_BASE_SEARCH_DIST = 200;

function workerClass(isPlayer, fromX, fromY, rallyX, rallyY) {
	unitClass.call(this);
	this.isPlayer = isPlayer; // allows unitClass to see if it's a player controlled unit
	this.maxHealth = WORKER_MAX_HEALTH;
	this.unitIcon = workerIcon_Larger;
	
	this.closestBaseX;
	this.closestBaseY;
	this.closestBaseObject;
	this.hasFoundClosestBase = false;

	this.currentTreeX;
	this.currentTreeY;
	this.currentTreeIndex;
	this.currentTreeObj;

	this.currentWood = 0;

	this.arrayIndexForBuilding;
	this.whatToBuild;
	this.buildingX;
	this.buildingY;
	this.queuedBuildingCost;

	this.unitClassReset = this.reset;
	this.reset = function() {
		this.unitClassReset();
		this.isWorker = true;
		this.unitType = 'Worker';
		if (isPlayer) {
			this.idleAnim = playerWorkerIdleAnim;
			this.idleLeftAnim = playerWorkerIdleLeftAnim;
			this.walkLeftAnim = playerWorkerWalkLeftAnim;
			this.walkRightAnim = playerWorkerWalkRightAnim;
			this.chopLeftAnim = playerWorkerChopLeftAnim;
			this.chopRightAnim = playerWorkerChopRightAnim;
			this.findClosestPlayerBase();

		} else {
			this.idleAnim = enemyWorkerIdleAnim;
			this.idleLeftAnim = enemyWorkerIdleLeftAnim;
			this.walkLeftAnim = enemyWorkerWalkLeftAnim;
			this.walkRightAnim = enemyWorkerWalkRightAnim;
			this.chopLeftAnim = enemyWorkerChopLeftAnim;
			this.chopRightAnim = enemyWorkerChopRightAnim;
			this.findClosestEnemyBase();
		}

		// SETS ALL VALUES TO BE CHECKED BY UNIT CLASS
		this.isWorker = true;
		this.attackRange = WORKER_ATTACK_RANGE;
		this.damage = WORKER_ATTACK_DAMAGE;
		this.attackRate = WORKER_ATTACK_RATE;	


		var gotoCol = Math.floor(rallyX / WORLD_W);
		var gotoRow = Math.floor(rallyY / WORLD_H);

		var tileTypeAtGoTo = returnTileTypeAtColRow(gotoCol,gotoRow);

		if (tileTypeAtGoTo == WORLD_TREE) {
			this.currentState = PLAYER_STATE_WALKING_TO_TREE;
			this.findAndSetTreeObject(gotoCol, gotoRow);			
		}

		this.x = fromX;
		this.y = fromY;
		this.goToNear(rallyX, rallyY);
	}

	// this get's called every frame if 'isChoppingWood' is true
	this.chopWood = function() {

		// needs to know where to come back to after delivering
		this.currentTreeX = this.x;
		this.currentTreeY = this.y;

		// needs to set hasFound to true or it runs every frame
		if (isPlayer && this.hasFoundClosestBase == false) {
			this.findClosestPlayerBase();
			this.hasFoundClosestBase = true;

		} else if (isPlayer == false && this.hasFoundClosestBase == false) {
			this.findClosestEnemyBase();
			this.hasFoundClosestBase = true;
		}

		if(this.currentWood >= WORKER_MAX_CARRYING_CAPACITY) {

			// removes from the shift-queue since the "job" is done
			if (this.destinationQueue.length > 0) {
				this.destinationQueue.splice(0, 1);
				this.hasChangedDestination = true;
			}

			this.currentState = PLAYER_STATE_CARRYING_WOOD_TO_BASE;
			this.gotoX = this.closestBaseX;
			this.gotoY = this.closestBaseY;
			this.hasFoundClosestBase = false;

		// if we aren't at max wood, then gather more!
		} else {

			if (this.currentTreeObj.woodLeft > WORKER_GATHERING_RATE) {
				this.currentTreeObj.woodLeft -= WORKER_GATHERING_RATE;
				this.currentWood += WORKER_GATHERING_RATE;
			} else {
				this.currentTreeObj.woodLeft -= this.currentTreeObj.woodLeft;
				this.currentWood += this.currentTreeObj.woodLeft;;
			}
			
			if (this.currentTreeObj.woodLeft <= 0) {
				if (this.currentTreeObj.hasBeenKilled == false) {
					this.currentTreeObj.killTree(this.isPlayer);
				}
				findClosestTreeAndGoTo(this);
			}
			
		}
	}

	this.unitClassMove = this.move;
	this.move = function() {
		this.unitClassMove(WORKER_BASE_SPEED);

		if (this.currentState == PLAYER_STATE_CHOPPING_WOOD) {
			this.chopWood();

		} else if (	this.currentState == PLAYER_STATE_CARRYING_WOOD_TO_BASE) {

			if (this.isPlayer == false && enemyBases.length == 0) {
				this.closestBaseX = null;
				this.closestBaseY = null;
				this.currentState = PLAYER_STATE_NOT_BUSY;
			}

			if (this.x == this.closestBaseX && this.y == this.closestBaseY) {
				this.currentWood = Math.round(this.currentWood);

				if (isPlayer == true) {
					playerCurrentWood += this.currentWood; // deposit wood
				} else {
					enemyCurrentWood += this.currentWood; 
				}

				this.currentWood = 0;

				// if we issued another command after dropping off wood, don't go back to chopping
				if (this.destinationQueue.length > 1) {
					this.destinationQueue.splice(0, 1);
					this.hasChangedDestination = true;
					this.currentState = PLAYER_STATE_NOT_BUSY;
					return;
				}

				// go back to tree
				this.gotoX = this.currentTreeX;
				this.gotoY = this.currentTreeY;
				this.currentState = PLAYER_STATE_WALKING_TO_TREE;
			}
			
		} else if (	this.currentState == PLAYER_STATE_WALKING_TO_TREE &&
					this.x == this.currentTreeX && this.y == this.currentTreeY) {

			this.currentState = PLAYER_STATE_CHOPPING_WOOD;
			
		} else if (	this.currentState == PLAYER_STATE_WALKING_TO_BASE &&
					this.x == this.gotoX && this.y == this.gotoY) {

			this.currentState = PLAYER_STATE_NOT_BUSY;
			
		} else if (	this.currentState == PLAYER_STATE_WALKING_TO_BUILD &&
					this.x == this.gotoX && this.y == this.gotoY) {
			
			if (worldGrid[this.arrayIndexForBuilding] == WORLD_GRASS) {

				if (isPlayer) {
					if (this.whatToBuild == BASE) {
						worldGrid[this.arrayIndexForBuilding] = PLAYER_BASE;
						addNewPlayerBuilding(BASE, this.buildingX, this.buildingY, this);
					} else if (this.whatToBuild == CAMP) {
						worldGrid[this.arrayIndexForBuilding] = PLAYER_CAMP;
						addNewPlayerBuilding(CAMP, this.buildingX, this.buildingY, this);
					} else if (this.whatToBuild == BARRACKS) {
						worldGrid[this.arrayIndexForBuilding] = PLAYER_BARRACKS;
						addNewPlayerBuilding(BARRACKS, this.buildingX, this.buildingY, this);
					} else if (this.whatToBuild == ARMORY) {
						worldGrid[this.arrayIndexForBuilding] = PLAYER_ARMORY;
						addNewPlayerBuilding(ARMORY, this.buildingX, this.buildingY, this);
					}
				}

				if (isPlayer == false) {
					if (this.whatToBuild == BASE) {
						console.log('here');
						worldGrid[this.arrayIndexForBuilding] = ENEMY_BASE;
						addNewEnemyBuilding(BASE, this.buildingX, this.buildingY, this);
					} else if (this.whatToBuild == CAMP) {
						worldGrid[this.arrayIndexForBuilding] = ENEMY_CAMP;
						addNewEnemyBuilding(CAMP, this.buildingX, this.buildingY, this);
					} else if (this.whatToBuild == BARRACKS) {
						worldGrid[this.arrayIndexForBuilding] = ENEMY_BARRACKS;
						addNewEnemyBuilding(BARRACKS, this.buildingX, this.buildingY, this);
					} else if (this.whatToBuild == ARMORY) {
						worldGrid[this.arrayIndexForBuilding] = ENEMY_ARMORY;
						addNewEnemyBuilding(ARMORY, this.buildingX, this.buildingY, this);
					}
				}

			} else {
				this.currentState = PLAYER_STATE_NOT_BUSY; // can't build here because of grass
			}
			

		} else if (this.currentState == PLAYER_STATE_BUILDING) {
			gotoX = this.buildingX;
			gotoY = this.buildingY;

		} else if (this.isPlayer == false && cheatCodePressed_L) { // HARDCODED CHEAT TO MAKE ENEMY MOVE RANDOMLY
			this.gotoX = Math.random() * (canvas.width - 100);
			this.gotoY = Math.random() * (canvas.height - 100);
		}

	}

	this.findClosestPlayerBase = function() {
		var firstDistFound = false;
		var closestDistFoundSoFar = null;

		if (playerBases.length == 0) {
			this.closestBaseX = null;
			this.closestBaseY = null;
			this.currentState = PLAYER_STATE_NOT_BUSY; 
			return;
		}

		for (var i = 0; i < playerBases.length; i++) {
				
			var distFromPlayerBase = this.distFrom( playerBases[i].x, playerBases[i].y);
			if (firstDistFound == false) {
				closestDistFoundSoFar = distFromPlayerBase;
				firstDistFound = true;
			}
			if (distFromPlayerBase <= closestDistFoundSoFar) {
				this.closestBaseX = playerBases[i].x;
				this.closestBaseY = playerBases[i].y;
				closestDistFoundSoFar = distFromPlayerBase;
			}

		}
	}

	this.findClosestEnemyBase = function() {
		var firstDistFound = false;
		var closestDistFoundSoFar = null;

		if (enemyBases.length == 0) {
			this.closestBaseX = null;
			this.closestBaseY = null;
			this.currentState = PLAYER_STATE_NOT_BUSY;
		}

		for (var i = 0; i < enemyBases.length; i++) {
				
			var distFromEnemyBase = this.distFrom( enemyBases[i].x, enemyBases[i].y);
			if (firstDistFound == false) {
				closestDistFoundSoFar = distFromEnemyBase;
				firstDistFound = true;
			}
			if (distFromEnemyBase <= closestDistFoundSoFar) {
				this.closestBaseX = enemyBases[i].x;
				this.closestBaseY = enemyBases[i].y;
				closestDistFoundSoFar = distFromEnemyBase;
			}

		}
	}

	this.superclassDraw = this.draw;
	this.draw = function() {
		this.superclassDraw();
	}

	this.checkIfWalkingToBuild = function() {
		if (this.currentState == PLAYER_STATE_WALKING_TO_BUILD_CAMP ||
			this.currentState == PLAYER_STATE_WALKING_TO_BUILD_BARRACKS) {
			return true;
		} else {
			return false;
		}
	}

	this.findAndSetTreeObject = function(col, row) {
		this.currentTreeIndex = colRowToArrayIndex(col, row);

		for (var i = 0; i < allTrees.length; i++) {
			if (allTrees[i].worldGridArrayIndex == this.currentTreeIndex) {
				this.currentTreeObj = allTrees[i];
			}
		}	
	}
}

workerClass.prototype = Object.create(unitClass.prototype);
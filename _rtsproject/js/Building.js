const PROGRESS_BAR_OUTLINE_OFFSET = 1;
const PROGRESS_BAR_OUTLINE_MARGIN = 2;
const PROGRESS_BAR_W = 76;
const PROGRESS_BAR_H = 10;
const PROGRESS_BAR_X_OFFSET = PROGRESS_BAR_W/2;
const PROGRESS_BAR_Y_OFFSET = 45 + PROGRESS_BAR_OUTLINE_OFFSET;

const BUILDING_SELECT_DIM_HALF = 20;
const BUILDING_HEALTH_BAR_HEIGHT = 35;

// for plugging in what building is made
const BASE = 1;
const CAMP = 2;
const BARRACKS = 3;
const ARMORY = 4;

// for plugging in what unit to make
const WORKER = 1;
const SPEARMAN = 2;
const ARCHER = 3;

function buildingClass(thisBuildingType) {
	healthClass.call(this);
	this.healthBarW = HEALTH_BAR_W_BUILDING;
	this.healthBarH = HEALTH_BAR_H_BUILDING;

	this.buildingIcon;
	this.isPlayer = false;
	this.isUnit = false;
	this.isSelected = false;
	this.isBeingAttacked = false;
	this.attackedBy;
	this.arrayIndex;
	this.rallyPointImage = rallyPointPic;
	this.canHaveRallyPoint = false;
	this.hasBeenKilled = false;
	
	this.buildQueue = [];
	this.iconToShow = [];

	this.showProgressBar = true;
	this.percentDoneWithTimer = 1;
	this.percentDoneWithUnitTimer = 1;

	this.workerMakingThisBuilding;
	this.currentTimeBuilding = 0;
	this.buildTimeMax;
	this.buildTimerHasBeenStarted = false;
	this.hasBeenBuilt = false;

	this.unitMaxBuildTime;
	this.unitBuildTimer; 
	this.unitBuildTimerFinished = false;

	this.isBase = false;
	this.isCamp = false;
	this.isBarracks = false;
	this.isArmory = false;

	this.controlGroup_1 = false;
	this.controlGroup_2 = false;
	this.controlGroup_3 = false;
	this.controlGroup_4 = false;
	this.controlGroup_5 = false;

	this.x = 0;
	this.y = 0;
	this.progressBarX;
	this.progressBarY;
	
	this.reset = function() {
		var thisCol = Math.floor(this.x/WORLD_W);
		var thisRow = Math.floor(this.y/WORLD_H);

		this.arrayIndex = colRowToArrayIndex(thisCol, thisRow);



		this.currentHealth = this.maxHealth;

		if (thisBuildingType == BASE) {
			this.isBase = true;
			this.buildingIcon = playerBase_Larger;
			this.unitMaxBuildTime = WORKER_BUILD_TIME;
		} else if (thisBuildingType == CAMP) {
			this.isCamp = true;
			this.buildingIcon = playerCamp_Larger;
		} else if (thisBuildingType == BARRACKS) {
			this.isBarracks = true;
			this.buildingIcon = playerBarracks_Larger;
			this.unitMaxBuildTime = SPEARMAN_BUILD_TIME;
		} else if (thisBuildingType == ARMORY) {
			this.isArmory = true;
			this.buildingIcon = playerArmory_Larger;
			this.unitMaxBuildTime = ARMORY_UPGRADE_BUILD_TIME;
		} else {
			console.log('building made is not recognized. add to thisBuildingType in reset()');
		}
		this.progressBarX = this.x - PROGRESS_BAR_X_OFFSET;
		this.progressBarY = this.y - PROGRESS_BAR_Y_OFFSET;

		this.unitBuildTimer = this.unitMaxBuildTime;
	}

	this.getCost = function(whichUnit) {
		if (whichUnit == WORKER) {
			return WORKER_BUY_COST;
		} else if (whichUnit == SPEARMAN) {
			return SPEARMAN_BUY_COST;
		} else if (whichUnit == ARCHER) {
			return ARCHER_BUY_COST;
		} else {
			console.log('unitType not found, add this unitType to this.getCost()');
		}
	}

	this.addUnitToQueue = function(whichUnit) {
		var costOfUnit = this.getCost(whichUnit);
		if (this.isPlayer && this.buildQueue.length < 5 && this.hasBeenBuilt &&
			playerCurrentSupply < playerSupplyMax && playerCurrentWood >= costOfUnit) {
			
			this.buildQueue.push({unitType: whichUnit, unitCost: costOfUnit});
			playerCurrentWood -= costOfUnit;
			this.setUnitIcons();
		}

		if (this.isPlayer == false && this.buildQueue.length < 5 &&
			this.hasBeenBuilt && enemyCurrentSupply < enemySupplyMax &&
			enemyCurrentWood >= costOfUnit) {

			this.buildQueue.push({unitType: whichUnit, unitCost: costOfUnit});
			enemyCurrentWood -= costOfUnit;
		}
	}

	this.addUpgradeToQueue = function(whichUpgrade) {
		var upgradeCost;
		if (whichUpgrade == DAMAGE) {
			upgradeCost = damageUpgradeCost;
		} else if (whichUpgrade == ATTACK_RATE) {
			upgradeCost = attackRateUpgradeCost;
		}

		this.buildQueue.push({unitType: whichUpgrade, unitCost: upgradeCost});

		playerCurrentWood -= upgradeCost;

	}

	this.drawUnitTimerAndProgressBar = function () {
		this.percentDoneWithUnitTimer = this.unitBuildTimer / this.unitMaxBuildTime;

		// PLAYER
		if (this.buildQueue.length > 0 && this.isPlayer) {
			var nextUnitToMake = this.buildQueue[0].unitType;

			if (this.isArmory == false) {
				this.drawUnitIcons();
			}
			
			this.drawUnitProgressBar();
			if (playerCurrentSupply < playerSupplyMax) {
				this.needMoreSupplySoundPlayed = false;
				if (this.unitBuildTimer > 0) {
					this.unitBuildTimer--;
				} else {
					this.unitBuildTimerFinished = true;
				}
			} else if (this.needMoreSupplySoundPlayed == false) {
				playNeedMoreSupplySound();
				// sets build timer back to max so it doesn't show halfway
				this.unitBuildTimer = this.unitMaxBuildTime;
				this.needMoreSupplySoundPlayed = true;
			}
		}
		if (this.unitBuildTimerFinished && this.isPlayer && this.isArmory == false) {
			spawnPlayerUnit(nextUnitToMake, this.x,this.y, this.rallyPointX, this.rallyPointY);
			this.unitBuildTimerFinished = false;
			this.unitBuildTimer = this.unitMaxBuildTime;
			this.buildQueue.splice(0, 1);
			this.iconToShow.splice(0, 1);
		}

		if (this.unitBuildTimerFinished && this.isPlayer && this.isArmory) {
			if (nextUnitToMake == DAMAGE) {
				damageBoost += DAMAGE_UPGRADE_AMOUNT;
				
			} else if (nextUnitToMake == ATTACK_RATE) {
				attackRateBoost += ATTACK_RATE_UPGRADE_AMOUNT;
			}
			this.unitBuildTimerFinished = false;
			this.unitBuildTimer = this.unitMaxBuildTime;
			this.buildQueue.splice(0, 1);
		}

		// ENEMY
		if (this.buildQueue.length > 0 && this.isPlayer == false) {
			var nextUnitToMake = this.buildQueue[0].unitType;
			this.drawUnitProgressBar();
			if (enemyCurrentSupply < enemySupplyMax) {
				if (this.unitBuildTimer > 0) {
					this.unitBuildTimer--;
				} else {
					this.unitBuildTimerFinished = true;
				}
			} else {
				// sets build timer back to max so it doesn't show halfway
				this.unitBuildTimer = this.unitMaxBuildTime;
			}
		}
		
		if (this.unitBuildTimerFinished && this.isPlayer == false) {
			spawnEnemyUnit(nextUnitToMake, this.x,this.y, this.rallyPointX, this.rallyPointY);
			this.unitBuildTimerFinished = false;
			this.unitBuildTimer = this.unitMaxBuildTime;
			this.buildQueue.splice(0, 1);
			this.iconToShow.splice(0, 1);
		}
	}

	this.buildingTimerCheck = function() {
		this.percentDoneWithTimer = this.currentTimeBuilding / this.buildTimeMax;
		if (this.buildTimerHasBeenStarted && this.hasBeenBuilt == false) {
			this.drawBuildProgressBar();		
			if (this.currentTimeBuilding < this.buildTimeMax) {
				this.currentTimeBuilding++;
			} else {
				this.hasBeenBuilt = true;
				this.workerMakingThisBuilding.currentState = PLAYER_STATE_NOT_BUSY;
				if (thisBuildingType == BASE) {
					if (this.isPlayer == false) {
						foundWorkerToBuildBase = false;

						// this means that there were no enemy bases before, so send workers back to work!
						if (enemyBases.length == 1) {
							allEnemyWorkersStoreClosestBase();
							allEnemyWorkersFindTreesAndChop();
						}
					}

				} else if (thisBuildingType == CAMP) {
					if (this.isPlayer) {
						playerSupplyMax += SUPPLY_INCREASE_AMOUNT;
						playerCampHasBeenMade = true;
					} else {
						enemySupplyMax += SUPPLY_INCREASE_AMOUNT;
						enemyCampHasBeenMade = true;
						foundWorkerToBuildCamp = false;
					}
				} else if (thisBuildingType == BARRACKS) {
					if (this.isPlayer) {
						playerBarracksHasBeenMade = true;
					} else {
						foundWorkerToBuildBarracks = false;
						enemyBarracksHasBeenMade = true;
						enemyNumberOfBarracksMade++;
					}
				}

				if (this.isPlayer == false) {
					if (this.workerMakingThisBuilding.currentTreeX == null) {
						findClosestTreeAndGoTo(this.workerMakingThisBuilding);
					} else {
						this.workerMakingThisBuilding.goToNear(	this.workerMakingThisBuilding.currentTreeX,
																this.workerMakingThisBuilding.currentTreeY);
						this.workerMakingThisBuilding.currentState = PLAYER_STATE_WALKING_TO_TREE;
					}
				}
			}
		}
	}

	this.draw = function() {
		this.healthBarX = this.x - this.healthBarW/2;
		this.healthBarY = this.y - BUILDING_HEALTH_BAR_HEIGHT;

		if (this.buildQueue.length == 0) {
			this.unitBuildTimer = this.unitMaxBuildTime;
		}
		if (this.buildQueue.length > 0) {
			this.drawUnitTimerAndProgressBar();
		}
		this.buildingTimerCheck();
	}

	this.distFrom = function (otherX, otherY) {
		deltaX = otherX - this.x;
		deltaY = otherY - this.y;

		return Math.sqrt(deltaX*deltaX + deltaY*deltaY);
	}

	// DRAW FUNCTIONS BELOW

	this.drawSelectionBox = function() {
		coloredOutlineRectCornerToCorner(	this.x-BUILDING_SELECT_DIM_HALF, // top leftX corner
											this.y-BUILDING_SELECT_DIM_HALF, // top leftY corner
											this.x+BUILDING_SELECT_DIM_HALF, // bottom left X corner
											this.y+BUILDING_SELECT_DIM_HALF, 'yellow'); // bottom left Y corner
	}

	this.drawDottedLineAndRallyPoint = function() {
		if (this.canHaveRallyPoint) {
			drawDottedLine(	this.x,
							this.y,
							this.rallyPointX,
							this.rallyPointY,'red');
			drawBitmapCenteredWithRotation(	this.rallyPointImage,
											this.rallyPointX,
											this.rallyPointY,
											this.ang , FULL_ALPHA);
		}

	}

	this.drawBuildProgressBar = function() {
			colorRect(	this.progressBarX - PROGRESS_BAR_OUTLINE_OFFSET,
						this.progressBarY - PROGRESS_BAR_OUTLINE_OFFSET,
						PROGRESS_BAR_W + PROGRESS_BAR_OUTLINE_MARGIN,
						PROGRESS_BAR_H + PROGRESS_BAR_OUTLINE_MARGIN, 'black');
			
			colorRect(	this.progressBarX,
						this.progressBarY,
						PROGRESS_BAR_W - PROGRESS_BAR_OUTLINE_MARGIN,
						PROGRESS_BAR_H, 'black');

			colorRect(	this.progressBarX,
						this.progressBarY,
						this.percentDoneWithTimer * PROGRESS_BAR_W,
						PROGRESS_BAR_H, 'blue');
	}

	this.drawUnitProgressBar = function() {
			colorRect(	this.progressBarX - PROGRESS_BAR_OUTLINE_OFFSET,
						this.progressBarY - PROGRESS_BAR_OUTLINE_OFFSET,
						PROGRESS_BAR_W + PROGRESS_BAR_OUTLINE_MARGIN,
						PROGRESS_BAR_H + PROGRESS_BAR_OUTLINE_MARGIN, 'black');

			colorRect(	this.progressBarX,
						this.progressBarY,
						PROGRESS_BAR_W - PROGRESS_BAR_OUTLINE_MARGIN,
						PROGRESS_BAR_H, 'black');

			colorRect(	this.progressBarX,
						this.progressBarY,
						this.percentDoneWithUnitTimer * PROGRESS_BAR_W,
						PROGRESS_BAR_H, 'blue');
	}

	this.setUnitIcons = function() {
		this.iconToShow = [];
		this.iconToShowLarger = [];
		for (var i = 0; i < this.buildQueue.length; i++) {
			if (this.buildQueue[i].unitType == WORKER) {
				this.iconToShow.push(workerIcon);
				this.iconToShowLarger.push(workerIcon_Larger);
			} else if (this.buildQueue[i].unitType == SPEARMAN) {
				this.iconToShow.push(spearmanIcon);
				this.iconToShowLarger.push(spearmanIcon_Larger);
			} else if (this.buildQueue[i].unitType == ARCHER) {
				this.iconToShow.push(archerIcon);
				this.iconToShowLarger.push(archerIcon_Larger);
			}
		}

	}

	this.drawUnitIcons = function() {
		for (var i = 0; i < this.buildQueue.length; i++) {
			var offsetX = this.progressBarX + 10;
			var offsetY = this.progressBarY - 10;
			var iconGap = 15;
			drawBitmapCenteredWithRotation(this.iconToShow[i], offsetX + (iconGap * i), offsetY, this.ang, FULL_ALPHA);
		}
	}

	this.isInBox = function(x1,y1,x2,y2) {
		var leftX, rightX;

		// if the X value of the start of the selection box is more to the left than the end X
		// then we swap. this is to allow dragging selection box down/up to the left/right
		if(x1 < x2) {
			leftX = x1;
			rightX = x2;
		} else {
			leftX = x2;
			rightX = x1; 
		}

		var topY, bottomY;
		if (y1 < y2) {
			topY = y1;
			bottomY = y2;
		} else {
			topY = y2;
			bottomY = y1;
		}

		if (this.x < leftX) {
			return false;
		}
		if (this.y < topY) {
			return false;
		}
		if (this.x > rightX) {
			return false;
		}
		if (this.y > bottomY) {
			return false;
		}

		return true;
	}

}

buildingClass.prototype = Object.create(healthClass.prototype);
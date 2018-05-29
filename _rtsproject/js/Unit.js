const UNIT_SELECT_DIM_HALF = 20;
const UNIT_WIDTH = 40;
const UNIT_HEIGHT = 40;
const UNIT_HEALTH_BAR_HEIGHT = 55;
const UNIT_COLLISION_RADIUS = 40;
const UNIT_AGGRESSION_RADIUS = 100;
const UNIT_FEET_TO_CHEST_MARGIN = 15;

const PLAYER_STATE_NOT_BUSY = 0;
const PLAYER_STATE_CHOPPING_WOOD = 1;
const PLAYER_STATE_CARRYING_WOOD_TO_BASE = 2;
const PLAYER_STATE_WALKING_TO_TREE = 3;
const PLAYER_STATE_WALKING_TO_BASE = 4;
const PLAYER_STATE_WALKING_TO_BUILD = 5;
const PLAYER_STATE_BUILDING = 6;
const PLAYER_STATE_ATTACKING_ENEMY_UNIT = 7;
const PLAYER_STATE_ATTACKING_ENEMY_BUILDING = 8;
const PLAYER_STATE_ATTACK_MOVE = 9;

const UNIT_IDLE = 0;
const UNIT_WALKING_LEFT = 1;
const UNIT_WALKING_RIGHT = 2;

function unitClass() {
	healthClass.call(this);
	this.healthBarW = HEALTH_BAR_W_UNIT;
	this.healthBarH = HEALTH_BAR_H_UNIT;

	this.isPlayer = false;
	this.sentOutForAttack = false;
	this.currentState = PLAYER_STATE_NOT_BUSY;
	this.isWorker = false;
	this.isUnit = true;
	this.isBeingAttacked = false;
	this.attackedBy = null;
	this.hasBeenKilled = false;
	this.myTarget = null;

	// any new units will need to set up this info in their reset() function
	this.unitType;
	this.unitIcon;
	this.idleAnim;
	this.idleLeftAnim;
	this.walkLeftAnim;
	this.walkRightAnim;
	this.chopLeftAnim;
	this.chopRightAnim;
	this.attackRange;
	this.attackRate;
	this.damage;

	this.attackRateTimer = 0;

	this.direction;

	this.x = 0;
	this.y = 0;
	this.lastX;
	this.destinationQueue = [];

	// needs to be changed to true every time a shift queue action has been completed
	// example: anytime we remove a completed task from the destinationQueue
	this.hasChangedDestination = true; 

	this.controlGroup_1 = false;
	this.controlGroup_2 = false;
	this.controlGroup_3 = false;
	this.controlGroup_4 = false;
	this.controlGroup_5 = false;

	this.numberOfKills = 0;

	this.reset = function() {
		this.currentHealth = this.maxHealth;
	}

	this.move = function(speed) {

		this.checkAndSetNextDestination();

		var distToGo = this.distFrom(this.gotoX, this.gotoY);

		var moveX = speed * deltaX/distToGo;
		var moveY = speed * deltaY/distToGo;

		// set next X/Y coordinate
		var nextX = this.x + moveX;
		var nextY = this.y + moveY;

		// get next X/Y location's row and col
		var nextXCol = Math.floor(nextX/WORLD_W);
		var nextYRow = Math.floor(nextY/WORLD_H);

		// used for deciding what direction of animation to show
		if (this.gotoX != this.x) {
			this.lastX = this.x;
		}
		
		if (this.isBeingAttacked && this.currentState == PLAYER_STATE_ATTACKING_ENEMY_BUILDING) {
			this.attack(this.attackedBy);
		}


		// if we're walking to tree && get to the tree,	 stop. and chop.
		if (this.currentState == PLAYER_STATE_WALKING_TO_TREE &&
			this.gotoX == this.x && this.gotoY == this.y) {
			if (this.isWorker) {
				this.currentState = PLAYER_STATE_CHOPPING_WOOD;
			} else {
				this.currentState = PLAYER_STATE_NOT_BUSY;
			}

		} else { 
			if (distToGo > speed) {
				this.x += moveX;
				this.y += moveY;
			} else {
				this.x = this.gotoX;
				this.y = this.gotoY;
			}
		}

		if (this.gotoX == this.x && this.gotoY == this.y) {

			this.setIdleDirectionAndRemoveDestinationFromQueue();

		} else if (this.gotoX < this.x) {
				this.direction = UNIT_WALKING_LEFT;
		} else if (this.gotoX > this.x) {
				this.direction = UNIT_WALKING_RIGHT;
		}

		// this handles attack aggro radius for player and enemy
		if (	this.currentState == PLAYER_STATE_ATTACK_MOVE ||
				(this.currentState == PLAYER_STATE_NOT_BUSY &&
				this.gotoX == this.x && this.gotoY == this.y)) {

			this.attackAnyOpposingUnitInAggroRange();
		}

		// if we are currently attacking an enemy, chase it until we are in attack range
		if (this.currentState == PLAYER_STATE_ATTACKING_ENEMY_UNIT ||
			this.currentState == PLAYER_STATE_ATTACKING_ENEMY_BUILDING) {

			this.chaseOpposingUnitOrBuildingAndKill();
		}

	}

	this.draw = function() {
		this.healthBarX = this.x - this.healthBarW/2;
		this.healthBarY = this.y - UNIT_HEALTH_BAR_HEIGHT;

		this.chooseAnimation();
	}

	// ------ MOVEMENT CODE ------ //

	this.goToNear = function(atX, atY) {
		var indexAtGoTo = pixelToArray_Collision(atX, atY);
		var collisionIndexAtFeet = pixelToArray_Collision(this.x, this.y);
		var maxCheckLimit = 4000;
		collisionGrid[collisionIndexAtFeet] = COLLISION_SHOW_WALKABLE;


		// if we are a worker and clicked on a tree, or are walking back to base,
		// find a spot that is walkable, even if this is a worker
		if (this.isWorker && (this.currentState == PLAYER_STATE_WALKING_TO_TREE ||
			this.currentState == PLAYER_STATE_WALKING_TO_BASE ||
			this.currentState == PLAYER_STATE_CARRYING_WOOD_TO_BASE)) {
				
				while (collisionGrid[indexAtGoTo] != COLLISION_SHOW_WALKABLE &&
				collisionGrid[indexAtGoTo] != COLLISION_SHOW_WORKER_UNIT_GOTO) {
				var skipDist = 5 + Math.random() * 5; // between 5-10 pixels
				var angToTest = Math.random() * 2.0 * Math.PI; // a random angle
				atX += skipDist * Math.cos(angToTest);
				atY += skipDist * Math.sin(angToTest);
				
				// if we chose just canvas.width/height, we don't account for camera paning off screen
				if (atX > WORLD_W * WORLD_COLS || atY > WORLD_H * WORLD_ROWS ||
					atX < 0 || atY < 0) {
					atX -= skipDist * Math.cos(angToTest);
					atY -= skipDist * Math.sin(angToTest);
					//break;
				}
				maxCheckLimit--;
				if (maxCheckLimit < 0) {
					console.log('maxCheckLimit reached in goToNear, breaking out of while loop');
					break;
				}
				indexAtGoTo = pixelToArray_Collision(atX, atY);
			}

		} else {
			while (collisionGrid[indexAtGoTo] != COLLISION_SHOW_WALKABLE) {
				var skipDist = 5 + Math.random() * 5; // between 5-10 pixels
				var angToTest = Math.random() * 2.0 * Math.PI; // a random angle
				atX += skipDist * Math.cos(angToTest);
				atY += skipDist * Math.sin(angToTest);
				if (atX > WORLD_W * WORLD_COLS || atY > WORLD_H * WORLD_ROWS ||
					atX < 0 || atY < 0) {
					atX -= skipDist * Math.cos(angToTest);
					atY -= skipDist * Math.sin(angToTest);
					//break;
				}
				maxCheckLimit--;
				if (maxCheckLimit < 0) {
					console.log('maxCheckLimit reached in goToNear, breaking out of while loop');
					break;
				}
				indexAtGoTo = pixelToArray_Collision(atX, atY);
			}
		}

		if (this.isWorker) {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_WORKER_UNIT_GOTO;
		} else if (this.isPlayer) {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_PLAYER_UNIT_GOTO;
		} else if (this.isPlayer == false) {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_ENEMY_UNIT_GOTO;
		}
		
		this.gotoX = atX;
		this.gotoY = atY;
	}

	this.addDestinationToQueue = function(toX, toY, whatAction) {
		var whichEnemy;

		if (whatAction == MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT) {
			whichEnemy = getEnemyUnitUnderMouse(toX, toY);
			toX = whichEnemy.x;
			toY = whichEnemy.y;
		}

		if (whatAction == MOUSE_ACTION_CLICKED_ON_ENEMY_BUILDING) {
			whichEnemy = getEnemyBuildingUnderMouse(toX, toY);
			toX = whichEnemy.x;
			toY = whichEnemy.y;

		}

		this.destinationQueue.push({x: toX,
									y: toY,
									mouseAction: whatAction,
									enemyTarget: whichEnemy});
		
	}

	this.checkAndSetNextDestination = function() {
		if (this.destinationQueue.length > 0 && this.hasChangedDestination) {
			if (this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_TREE) {
				this.clickedOnTreeAction(this.destinationQueue[0].x, this.destinationQueue[0].y);

			} else if (this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_BASE) {
				this.clickedOnBaseAction(this.destinationQueue[0].x, this.destinationQueue[0].y);

			} else if (	this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT ||
						this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_ENEMY_BUILDING) {
				this.attack(this.destinationQueue[0].enemyTarget);

			} else if (	this.destinationQueue[0].mouseAction == MOUSE_ACTION_ATTACK_MOVE) {
				this.currentState = PLAYER_STATE_ATTACK_MOVE;
				this.goToNear(this.destinationQueue[0].x, this.destinationQueue[0].y);

			} else if (this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_GROUND) {
				this.currentState = PLAYER_STATE_NOT_BUSY;
				this.goToNear(this.destinationQueue[0].x, this.destinationQueue[0].y);
			}
			// whenever a destination changes, we changed this value, otherwise it would change every frame
			this.hasChangedDestination = false;
		}
	}

	this.setIdleDirectionAndRemoveDestinationFromQueue = function() {
		this.direction = UNIT_IDLE;
			
		if (this.destinationQueue.length > 0) {
			if (this.currentState == PLAYER_STATE_ATTACK_MOVE) {

				this.currentState = PLAYER_STATE_NOT_BUSY;
				this.destinationQueue.splice(0, 1);
				this.hasChangedDestination = true;
				
			} else if (	this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_GROUND ||
						this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_BASE) {

				this.destinationQueue.splice(0, 1);
				this.hasChangedDestination = true;

			} else if (	this.isWorker == false &&
						this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_TREE) {
				this.destinationQueue.splice(0, 1);
				this.hasChangedDestination = true;
			}
			
		}
	}

	this.clickedOnTreeAction = function(atX, atY) {
		if (this.currentState != PLAYER_STATE_BUILDING) {
			this.currentState = PLAYER_STATE_WALKING_TO_TREE;
			this.goToNear(atX, atY);
			this.destinationQueue[0].x = this.gotoX;
			this.destinationQueue[0].y = this.gotoY;

			if (this.isWorker) {
				var treeCol = Math.floor(atX/WORLD_W);
				var treeRow = Math.floor(atY/WORLD_H);
				
				this.findAndSetTreeObject(treeCol, treeRow);
			}
		}
	}

	this.clickedOnBaseAction = function(atX, atY) {
		if (this.currentState != PLAYER_STATE_BUILDING) {
			
			if (this.currentWood > 0) {
				this.currentState = PLAYER_STATE_CARRYING_WOOD_TO_BASE;
			} else {
				this.currentState = PLAYER_STATE_WALKING_TO_BASE;
			}
			this.goToNear(atX, atY);	
		}
	}

	// ------ ATTACK CODE ------ //

	this.attack = function(thingToAttack) {
		
		if (thingToAttack.isUnit) {
			if (thingToAttack.hasBeenKilled == false) {
				this.myTarget = thingToAttack;
				this.gotoX = this.myTarget.x;
				this.gotoY = this.myTarget.y;
				this.currentState = PLAYER_STATE_ATTACKING_ENEMY_UNIT;
			} else {
				if (this.destinationQueue.length > 0) {
					this.myTarget = null;
					this.destinationQueue.splice(0, 1);
					this.hasChangedDestination = true;
				} else {
					this.currentState = PLAYER_STATE_NOT_BUSY;
				}
			}
			// after starting to attack a unit, we don't need to store who we are attacked by
			// this is only useful if the enemy unit is already attacking a building
			this.attackedBy = null;
			this.isBeingAttacked = false;
		}

		// is building
		if (thingToAttack.isUnit == false) {
			if (thingToAttack.hasBeenKilled == false) {
				this.myTarget = thingToAttack;
				this.gotoX = this.myTarget.x;
				this.gotoY = this.myTarget.y;
				this.currentState = PLAYER_STATE_ATTACKING_ENEMY_BUILDING;
			} else {
				if (this.destinationQueue.length > 0) {
					this.myTarget = null;
					this.destinationQueue.splice(0, 1);
					this.hasChangedDestination = true;
				} else {
					this.currentState = PLAYER_STATE_NOT_BUSY;
				}
			}
		}
		
	}

	this.chaseOpposingUnitOrBuildingAndKill = function() {
		var currentDamage = this.currentDamage();
		var currentAttackRate = this.currentAttackRate();

		// needs to check if target is null
		// if so, then set to not busy, as it does not need to attack anymore
		if (this.myTarget == null) {
			this.sentOutForAttack = false;
			this.destinationQueue.splice(0, 1);
			this.hasChangedDestination = true;
			this.currentState = PLAYER_STATE_NOT_BUSY;
			return;
		}

		var targetX = this.myTarget.x;
		var targetY = this.myTarget.y;
		var distFromEnemy = this.distFromImage(targetX, targetY);

		if (this.attackRateTimer < currentAttackRate) {
			this.attackRateTimer++;
		}

		if (this.attackRange > distFromEnemy) { // if we are in our max attack range...
			if (this.attackRateTimer >= currentAttackRate) { // and it's time to attack...
				this.myTarget.currentHealth -= currentDamage;
				

				if (this.isPlayer) {
					// if the enemy is attacking a building, we want it to stop attacking, and hit whatever unit is attacking them
					// if the target is a building, we want the enemy to know we are attacking, so it can defend
					if (this.myTarget.currentState == PLAYER_STATE_ATTACKING_ENEMY_BUILDING ||
						this.myTarget.isUnit == false) {

						this.myTarget.isBeingAttacked = true;
						this.myTarget.attackedBy = this;
					}
					if (this.myTarget.isUnit == false && enemyBuildingUnderAttack == false) {
						enemyBuildingUnderAttack = true;
					}
				}

				this.attackRateTimer = 0;

				// if our target has no hp and another unit hasn't killed it...
				if (this.myTarget.currentHealth <= 0) {
					if (this.myTarget.hasBeenKilled == false) {
						if (this.isPlayer) {
							killEnemy(this.myTarget);
							this.numberOfKills++;
						} else {
							killPlayer(this.myTarget);							
							this.numberOfKills++;
						}
					}

					this.myTarget = null;
					this.sentOutForAttack = false; // for enemy units to know that this unit can be sent out for attack again

					// need to check length as 0 or we'll get console error.
					// when destination queue is empty, it won't be able to check the 1st spot in the array
					if (this.destinationQueue.length > 0) {
						if (this.destinationQueue[0].mouseAction == MOUSE_ACTION_ATTACK_MOVE) {
							this.hasChangedDestination = true;
						} else {
							this.destinationQueue.splice(0, 1);
							this.hasChangedDestination = true;
							this.currentState = PLAYER_STATE_NOT_BUSY;
						}
					} else {
						this.destinationQueue.splice(0, 1);
						this.hasChangedDestination = true;
						this.currentState = PLAYER_STATE_NOT_BUSY;
					}
				}
					
			}
			// set our gotoX/Y to our current position, so that we don't move when attacking
			this.gotoX = this.x;
			this.gotoY = this.y;
		} else { // if our target hasn't gotten into attack range, move closer
			this.gotoX = targetX;
			this.gotoY = targetY;
		}
	}

	this.attackAnyOpposingUnitInAggroRange = function() {
		if (this.isPlayer) {
				var firstDistToEnemyFound = false;
				var closestEnemyFound;
				var distFromClosestEnemy;
				for (var i = 0; i < enemyUnits.length; i++) {
					var distFromEnemy = this.distFrom(enemyUnits[i].x, enemyUnits[i].y);
					if (distFromEnemy < UNIT_AGGRESSION_RADIUS) {
						if (firstDistToEnemyFound == false) {
							closestEnemyFound = enemyUnits[i];
							distFromClosestEnemy = distFromEnemy;
							firstDistToEnemyFound = true;
						} else if (distFromEnemy < distFromClosestEnemy) {
							closestEnemyFound = enemyUnits[i];
							distFromEnemy = distFromClosestEnemy;
						}
					}
				}
				if (closestEnemyFound != null) {
					this.attack(closestEnemyFound);
				} else {
					this.attackAnyOpposingBuildingInAggroRange();
				}
			} else { // if enemy
				var firstDistToPlayerFound = false;
				var closestPlayerFound;
				var distFromClosestPlayer;
				for (var i = 0; i < playerUnits.length; i++) {
					var distFromPlayer = this.distFrom(playerUnits[i].x, playerUnits[i].y);
					if (distFromPlayer < UNIT_AGGRESSION_RADIUS) {
						if (firstDistToPlayerFound == false) {
							closestPlayerFound = playerUnits[i];
							distFromClosestPlayer = distFromPlayer;
							firstDistToPlayerFound = true;
						} else if (distFromPlayer < distFromClosestPlayer) {
							closestPlayerFound = playerUnits[i];
							distFromPlayer = distFromClosestPlayer;
						}
					}
				}
				if (closestPlayerFound != null) {
					this.attack(closestPlayerFound);
				} else {
					this.attackAnyOpposingBuildingInAggroRange();
				}
			}
	}

	this.attackAnyOpposingBuildingInAggroRange = function() {
		if (this.isPlayer) {
				var firstDistToEnemyFound = false;
				var closestEnemyFound;
				var distFromClosestEnemy;
				for (var i = 0; i < enemyBuildings.length; i++) {
					var distFromEnemy = this.distFrom(enemyBuildings[i].x, enemyBuildings[i].y);
					if (distFromEnemy < UNIT_AGGRESSION_RADIUS) {
						if (firstDistToEnemyFound == false) {
							closestEnemyFound = enemyBuildings[i];
							distFromClosestEnemy = distFromEnemy;
							firstDistToEnemyFound = true;
						} else if (distFromEnemy < distFromClosestEnemy) {
							closestEnemyFound = enemyBuildings[i];
							distFromEnemy = distFromClosestEnemy;
						}
					}
				}
				if (closestEnemyFound != null) {
					this.attack(closestEnemyFound);
				}
			} else { // if enemy
				var firstDistToPlayerFound = false;
				var closestPlayerFound;
				var distFromClosestPlayer;
				for (var i = 0; i < playerBuildings.length; i++) {
					var distFromPlayer = this.distFrom(playerBuildings[i].x, playerBuildings[i].y);
					if (distFromPlayer < UNIT_AGGRESSION_RADIUS) {
						if (firstDistToPlayerFound == false) {
							closestPlayerFound = playerBuildings[i];
							distFromClosestPlayer = distFromPlayer;
							firstDistToPlayerFound = true;
						} else if (distFromPlayer < distFromClosestPlayer) {
							closestPlayerFound = playerBuildings[i];
							distFromPlayer = distFromClosestPlayer;
						}
					}
				}
				if (closestPlayerFound != null) {
					this.attack(closestPlayerFound);
				}
			}
	}

	this.currentDamage = function() {
		if (this.isPlayer) {
			return this.damage + damageBoost;
		} else {
			return this.damage;
		}
	}

	this.currentAttackRate = function() {
		if (this.isPlayer) {
			return this.attackRate - attackRateBoost;
		} else {
			return this.attackRate;
		}
	}

	this.distFrom = function (otherX, otherY) {
		deltaX = otherX - this.x;
		deltaY = otherY - this.y;

		return Math.sqrt(deltaX*deltaX + deltaY*deltaY);

	}

	this.distFromImage = function (otherX, otherY) {
		deltaX = otherX - this.x;
		deltaY = otherY - (this.y - UNIT_HEIGHT/2);

		return Math.sqrt(deltaX*deltaX + deltaY*deltaY);

	}

	this.chooseAnimation = function() {
		if (		this.direction == UNIT_IDLE &&
					this.lastX < this.x &&
					this.currentState != PLAYER_STATE_CHOPPING_WOOD) {

			this.idleAnim.render(this.x - UNIT_WIDTH/2, this.y - UNIT_HEIGHT + 5);

		} else if (	this.direction == UNIT_IDLE &&
					this.lastX > this.x &&
					this.currentState != PLAYER_STATE_CHOPPING_WOOD) {

			this.idleLeftAnim.render(this.x - UNIT_WIDTH/2, this.y - UNIT_HEIGHT + 5);

		} else if (	this.direction == UNIT_IDLE &&
					this.lastX > this.x &&
					this.currentState == PLAYER_STATE_CHOPPING_WOOD) {

			this.chopLeftAnim.render(this.x - UNIT_WIDTH/2, this.y - UNIT_HEIGHT + 5);

		} else if (	this.direction == UNIT_IDLE &&
					this.lastX < this.x &&
					this.currentState == PLAYER_STATE_CHOPPING_WOOD) {

			this.chopRightAnim.render(this.x - UNIT_WIDTH/2, this.y - UNIT_HEIGHT + 5);

		} else if (this.direction == UNIT_WALKING_LEFT) {

			this.walkLeftAnim.render(this.x - UNIT_WIDTH/2, this.y - UNIT_HEIGHT + 5);

		} else if (this.direction == UNIT_WALKING_RIGHT) {

			this.walkRightAnim.render(this.x - UNIT_WIDTH/2, this.y - UNIT_HEIGHT + 5);
		}
	}

	this.drawSelectionBoxAndDestinationIcon = function() {
		// draws line from player to each destination point in the queue
		if (this.hasBeenKilled == false && this.destinationQueue.length > 0) {
			// draws line from player to first point
			
			if (this.destinationQueue.length > 1) {
				if (this.destinationQueue[0].mouseAction == MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT) {
					drawDottedLine(	this.x,
									this.y,
									this.destinationQueue[0].enemyTarget.x,
									this.destinationQueue[0].enemyTarget.y - UNIT_FEET_TO_CHEST_MARGIN,'white');
				} else {
					drawDottedLine(	this.x,
									this.y,
									this.destinationQueue[0].x,
									this.destinationQueue[0].y,'white');
				}
			}

			
			// draws each destination point
			for (var i = 0; i < this.destinationQueue.length; i++) {

				if (this.destinationQueue[i].mouseAction == MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT ||
					this.destinationQueue[i].mouseAction == MOUSE_ACTION_CLICKED_ON_ENEMY_BUILDING) { 
					drawBitmapCenteredWithRotation(	moveToDestinationIcon,
													this.destinationQueue[i].enemyTarget.x,
													this.destinationQueue[i].enemyTarget.y - UNIT_FEET_TO_CHEST_MARGIN, this.ang, 1);
				} else if (this.destinationQueue[i].mouseAction == MOUSE_ACTION_ATTACK_MOVE) {
					drawBitmapCenteredWithRotation(	attackMoveIcon,
													this.destinationQueue[i].x,
													this.destinationQueue[i].y, this.ang, 1);
				} else {
					if (this.currentState != PLAYER_STATE_BUILDING) {
						drawBitmapCenteredWithRotation(	moveToDestinationIcon,
														this.destinationQueue[i].x,
														this.destinationQueue[i].y, this.ang, 1);
					}
				}

			}
			// draws dotted line from point to point
			// length - 1 as the last point doesn't need a line to anything
			for (var j = 0; j < this.destinationQueue.length - 1; j++) {
				if (this.destinationQueue[j+1].mouseAction == MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT) { 
					drawDottedLine(	this.destinationQueue[j].x,
									this.destinationQueue[j].y,
									this.destinationQueue[j + 1].enemyTarget.x,
									this.destinationQueue[j + 1].enemyTarget.y - UNIT_FEET_TO_CHEST_MARGIN,'white');
				} else {
					drawDottedLine(	this.destinationQueue[j].x,
									this.destinationQueue[j].y,
									this.destinationQueue[j + 1].x,
									this.destinationQueue[j + 1].y,'white');
				}
			}
		}

		// if we haven't been killed, show the selection box
		if (this.hasBeenKilled == false) {
			coloredOutlineRectCornerToCorner(	this.x-UNIT_SELECT_DIM_HALF, // top leftX corner
												this.y+5 - (UNIT_SELECT_DIM_HALF*2), // top leftY corner
												this.x+UNIT_SELECT_DIM_HALF, // bottom left X corner
												this.y+5, 'yellow'); // bottom left Y corner
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

unitClass.prototype = Object.create(healthClass.prototype);
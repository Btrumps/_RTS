const WORLD_W = 40;
const WORLD_H = 40;
const COLLISION_WORLD_W = WORLD_W/2;
const COLLISION_WORLD_H = WORLD_H/2;
const WORLD_COLS = 30; // orig 20
const WORLD_ROWS = 25; // orig 15
const COLLISION_COLS = WORLD_COLS*2;
const COLLISION_ROWS = WORLD_ROWS*2;

var collisionDebugColor = ['green', 'red', 'cyan', 'white', 'orange'];

var allTrees = [];
var allTreesStored = false;

worldGrid = [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			 1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,
			 1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
			 1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
			 1,1,0,0,0,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,
			 1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
			 1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
			 1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,7,0,0,0,1,1,1,
			 1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,
			 1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,
			 1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,
			 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
			 1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
			 ];

			const WORLD_GRASS = 0;
			const WORLD_TREE = 1;
			const PLAYER_BASE = 2;
			const PLAYER_CAMP = 4;
			const PLAYER_BARRACKS = 5;
			const PLAYER_ARMORY = 6;
			const ENEMY_BASE = 7;
			const ENEMY_CAMP = 8;
			const ENEMY_BARRACKS = 9;
			const ENEMY_ARMORY = 10;

	collisionGrid = [];
			const COLLISION_SHOW_WALKABLE = 0;
			const COLLISION_SHOW_NOT_WALKABLE = 1;
			const COLLISION_SHOW_PLAYER_UNIT_GOTO = 2;
			const COLLISION_SHOW_WORKER_UNIT_GOTO = 3;
			const COLLISION_SHOW_ENEMY_UNIT_GOTO = 4;
	
	fogOfWarGrid = [];
			const NOT_DISCOVERED = 0;
			const DISCOVERED = 1;



function updateCollisionGrid() {
	for (var eachRow = 0; eachRow < WORLD_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < WORLD_COLS; eachCol++) {
			var collisionPaintHere = COLLISION_SHOW_WALKABLE;
			if (returnTileTypeAtColRow(eachCol, eachRow) == WORLD_TREE) {
				collisionPaintHere = COLLISION_SHOW_NOT_WALKABLE;
			}
			var collIndex = colRowToArrayIndex_Collisions(eachCol*2, eachRow*2);
			collisionGrid[collIndex] = collisionPaintHere;
			
			collIndex = colRowToArrayIndex_Collisions(eachCol*2 + 1, eachRow*2);
			collisionGrid[collIndex] = collisionPaintHere;

			collIndex = colRowToArrayIndex_Collisions(eachCol*2, eachRow*2 + 1);
			collisionGrid[collIndex] = collisionPaintHere;

			collIndex = colRowToArrayIndex_Collisions(eachCol*2 + 1, eachRow*2 + 1);
			collisionGrid[collIndex] = collisionPaintHere;

		}
	}
	for (var i = 0; i < playerUnits.length; i++) {
		// +15 to account for feet instead of centered, a little less than half the tile height
		var indexAtGoTo = pixelToArray_Collision(playerUnits[i].gotoX, playerUnits[i].gotoY);
		
		if (playerUnits[i].isWorker) {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_WORKER_UNIT_GOTO;
		} else {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_PLAYER_UNIT_GOTO;
		}

	}

	for (var i = 0; i < enemyUnits.length; i++) {
		// +15 to account for feet instead of centered, a little less than half the tile height
		var indexAtGoTo = pixelToArray_Collision(enemyUnits[i].gotoX, enemyUnits[i].gotoY);
		
		if (enemyUnits[i].isWorker) {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_WORKER_UNIT_GOTO;
		} else {
			collisionGrid[indexAtGoTo] = COLLISION_SHOW_ENEMY_UNIT_GOTO;
		}

	}
}

function drawCollisionGrid() {
	for (var eachRowColl = 0; eachRowColl < COLLISION_ROWS; eachRowColl++) {
		for (var eachColColl = 0; eachColColl < COLLISION_COLS; eachColColl++) {

			var arrayIndex = colRowToArrayIndex_Collisions(eachColColl, eachRowColl);
			var whatTileNeedsToBeDrawn = collisionGrid[arrayIndex];
			var tileX = eachColColl * COLLISION_WORLD_W;
			var tileY = eachRowColl * COLLISION_WORLD_H;

			colorRect(tileX,tileY, COLLISION_WORLD_W,COLLISION_WORLD_H, collisionDebugColor[whatTileNeedsToBeDrawn], .2);
		}
	}
}

function drawWorld() {

	for (var eachRow = 0; eachRow < WORLD_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < WORLD_COLS; eachCol++) {

			var arrayIndex = colRowToArrayIndex(eachCol, eachRow);
			var whatTileNeedsToBeDrawn = worldGrid[arrayIndex];
			var useImg = worldPics[whatTileNeedsToBeDrawn];
			var tileX = eachCol * WORLD_W;
			var tileY = eachRow * WORLD_H;

			if (allTreesStored == false) {
				createTreeClassesAndStoreInArray();
				allTreesStored = true;
			}

			switch(whatTileNeedsToBeDrawn) {
				

				case WORLD_GRASS:
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case WORLD_TREE:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case PLAYER_BASE:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg,tileX, tileY);
					if (playerHasStoredStartingBase == false) {
						addPlayerStartingBase(tileX, tileY);
					} 
					break;

				case PLAYER_CAMP:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case PLAYER_BARRACKS:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case PLAYER_ARMORY:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case ENEMY_BASE:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					if (enemyHasStoredStartingBase == false) {
						addEnemyStartingBase(tileX, tileY);
					}
					break;

				case ENEMY_CAMP:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case ENEMY_BARRACKS:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

				case ENEMY_ARMORY:
					canvasContext.drawImage(worldPics[WORLD_GRASS], tileX, tileY);
					canvasContext.drawImage(useImg, tileX, tileY);
					break;

			} // end of switch case
		} // end of nested forloop
	} // end of forloop
}// end of function

function getBuildingCost(whichBuilding) {
	if (whichBuilding == BASE) {
		return BASE_BUY_COST;
	} else if (whichBuilding == CAMP) {
		return CAMP_BUY_COST;
	} else if (whichBuilding == BARRACKS) {
		return BARRACKS_BUY_COST;
	} else if (whichBuilding == ARMORY) {
		return ARMORY_BUY_COST;
	} else {
		console.log ('building type not found, add to getBuildingCost() in World.js');
	}
}

function createTreeClassesAndStoreInArray() {
	// starts as negative one, as the first array index is 0
	var allTreeIndexCount = 0;
	for (var i = 0; i < worldGrid.length; i++) {
		if (worldGrid[i] == WORLD_TREE) {

			var newTree = new treeClass(i, allTreeIndexCount);
			allTrees.push(newTree);
		}
		
		allTreeIndexCount++;
	}
}
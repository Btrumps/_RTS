MAX_WOOD_PER_TREE = 250;

function treeClass(worldArrayIndex, treeArrayIndex) {
	
	this.woodLeft = MAX_WOOD_PER_TREE;
	this.worldGridArrayIndex = worldArrayIndex;
	this.allTreeArrayIndex = treeArrayIndex;
	this.hasBeenKilled = false;

	this.killTree = function(isPlayer) {
		worldGrid[this.worldGridArrayIndex] = WORLD_GRASS;
		this.hasBeenKilled = true;

		// needs to find a new rally point if it was set to a tree that dies
		if (isPlayer) {
			for (var i = 0; i < playerBases.length; i++) {
				var rallyXCol = Math.floor(playerBases[i].rallyPointX/WORLD_W);
				var rallyXRow = Math.floor(playerBases[i].rallyPointY/WORLD_H);
				var indexAtRally = colRowToArrayIndex(rallyXCol, rallyXRow);

				if (indexAtRally == this.worldGridArrayIndex) {
					findClosestTreeAndSetRally(playerBases[i]);
				}
			}
		} else {
			for (var i = 0; i < enemyBases.length; i++) {
				var rallyXCol = Math.floor(enemyBases[i].rallyPointX/WORLD_W);
				var rallyXRow = Math.floor(enemyBases[i].rallyPointY/WORLD_H);
				var indexAtRally = colRowToArrayIndex(rallyXCol, rallyXRow);
				if (indexAtRally == this.worldGridArrayIndex) {
					findClosestTreeAndSetRally(enemyBases[i]);
				}
			}
		}

	}

}

function findClosestTreeAndGoTo(whichUnit) {
	var closestTreeX;
	var closestTreeY;
	var hasStoredFirstTree = false;

	for (var i = 0; i < worldGrid.length; i++) {
		if (worldGrid[i] == WORLD_TREE) {
			colOfTree = arrayIndexToCol(i);
			rowOfTree = arrayIndexToRow(i);
			treeX = colToCenteredX(colOfTree);
			treeY = rowToCenteredY(rowOfTree);
			
			if (hasStoredFirstTree == false) {
				closestTreeX = treeX;
				closestTreeY = treeY;
				hasStoredFirstTree = true;
			}

			if (whichUnit.distFrom(treeX, treeY) < whichUnit.distFrom(closestTreeX, closestTreeY)) {
				closestTreeX = treeX;
				closestTreeY = treeY;
			}
		}

	}

	var closestCol = Math.floor(closestTreeX/WORLD_W);
	var closestRow = Math.floor(closestTreeY/WORLD_H);

	whichUnit.findAndSetTreeObject(closestCol, closestRow);

	if (whichUnit.currentTreeObj != undefined) {
		whichUnit.currentState = PLAYER_STATE_WALKING_TO_TREE;
		whichUnit.goToNear(closestTreeX, closestTreeY);
	} else {
		whichUnit.currentState = PLAYER_STATE_NOT_BUSY;
	}

	
	
}

function findClosestTreeAndSetRally(whichBase) {
	var closestTreeX;
	var closestTreeY;
	var hasStoredFirstTree = false;

	for (var i = 0; i < worldGrid.length; i++) {
		if (worldGrid[i] == WORLD_TREE) {
			colOfTree = arrayIndexToCol(i);
			rowOfTree = arrayIndexToRow(i);
			treeX = colToCenteredX(colOfTree);
			treeY = rowToCenteredY(rowOfTree);

			if (whichBase.distFrom(treeX, treeY) < MAX_DIST_TO_SEARCH_FOR_TREE) {
				if (hasStoredFirstTree == false) {
					closestTreeX = treeX;
					closestTreeY = treeY;
					hasStoredFirstTree = true;
				}
				if (whichBase.distFrom(treeX, treeY) < whichBase.distFrom(closestTreeY, closestTreeY)) {
					closestTreeX = treeX;
					closestTreeY = treeY;
				}
			}

		}

	}

	whichBase.rallyPointX = closestTreeX;
	whichBase.rallyPointY = closestTreeY;

	if (closestTreeX == undefined && closestTreeY == undefined) {
		console.log('could not find tree in MAX_DIST_TO_SEARCH_FOR_TREE radius, GO MAKE A NEW BASE NEAR MORE TREES');
		whichBase.rallyPointX = whichBase.x + BASE_DEFAULT_RALLY_OFFSET;
		whichBase.rallyPointY = whichBase.y + BASE_DEFAULT_RALLY_OFFSET;
	}

}
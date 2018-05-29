function getPlayerBuildingType(whichBuilding) {
	if (whichBuilding.isBase) {
		return BASE;
	} else if (whichBuilding.isCamp) {
		return CAMP;
	} else if (whichBuilding.isBarracks) {
		return BARRACKS;
	}  else if (whichBuilding.isArmory) {
		return ARMORY;
	}
	
}


// MATH SPECIFIC UTILITY
function getRandomNumberBetweenMinMax(min, max) {
  return Math.random() * (max - min) + min;
}

function getRoundedRandomNumberBetweenMinMax(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}


// ARRAY SPECIFIC UTILITY
function arrayContains(arr, obj) {
    var arrLen = arr.length;
    for (var i = 0; i < arrLen; i++) {
        if (arr[i] === obj) {
            return true;
        }
    }
    return false;
}

// needs to loops from length down because it changes the overall length when you splice
function arrayRemove(arr, obj) {
    for (var i = arr.length-1; i >= 0; i--) {
        if (arr[i] === obj) {
            arr.splice(i,1);
            return;
        }
    }
}


// WORLD SPECIFIC UTILITY
function colRowToArrayIndex(col, row) {
	return col + (row * WORLD_COLS);
}

function arrayIndexToCol(index) {
	return index % WORLD_COLS + 1;
	
}

function arrayIndexToRow(index) {
	return Math.floor(index/ WORLD_COLS) + 1;
}

function colToCenteredX(col) {
	return (col * WORLD_W) - WORLD_W/2;
}

function rowToCenteredY(row) {
	return (row * WORLD_H) - WORLD_H/2;
} 

function pixelToArrayIndex(x,y) {
	var worldCol = Math.floor(x/WORLD_W);
	var worldRow = Math.floor(y/WORLD_H);

	return worldCol + (worldRow * WORLD_COLS);
}

function pixelToArray_Collision(x,y) {
	var collCol = Math.floor(x/COLLISION_WORLD_W);
	var collRow = Math.floor(y/COLLISION_WORLD_H);

	return collCol + (collRow * COLLISION_COLS);
}

function returnTileTypeAtColRow(col,row) {
	if (col >= 0 && col < WORLD_COLS &&
		row >= 0 && row < WORLD_ROWS) {
		var arrayIndex = colRowToArrayIndex(col, row);
		return worldGrid[arrayIndex];
	}	
}

function canBuildOn(arrayIndex) {
	if (worldGrid[arrayIndex] == WORLD_GRASS) {
		return true;
	} else {
		return false;
	}
}

function colRowToArrayIndex_Collisions(col, row) {
	return col + (row * COLLISION_COLS);
}
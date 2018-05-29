var showFogOfWar = true;

function updateFogOfWarGrid() {
	for (var eachRow = 0; eachRow < COLLISION_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < COLLISION_COLS; eachCol++) {
			var arrayIndex = colRowToArrayIndex_Collisions(eachCol, eachRow);
			var tileTypeToPaint = NOT_DISCOVERED;
			if (fogOfWarGrid[arrayIndex] == DISCOVERED) {
				tileTypeToPaint = DISCOVERED;
			} else {			
				fogOfWarGrid[arrayIndex] = NOT_DISCOVERED;
			}
		}
	}
}

function drawFogOfWar() {
	for (var eachRowFog = 0; eachRowFog < COLLISION_ROWS; eachRowFog++) {
		for (var eachColFog = 0; eachColFog < COLLISION_COLS; eachColFog++) {

			var arrayIndex = colRowToArrayIndex_Collisions(eachColFog, eachRowFog);
			var whatTileNeedsToBeDrawn = fogOfWarGrid[arrayIndex];
			var tileX = eachColFog * COLLISION_WORLD_W;
			var tileY = eachRowFog * COLLISION_WORLD_H;

			if (whatTileNeedsToBeDrawn == NOT_DISCOVERED) {
				colorRect(tileX,tileY, COLLISION_WORLD_W,COLLISION_WORLD_H, 'black', FULL_ALPHA);
			}
		}
	}
}

function clearFogOfWar() {

	for (var i = 0; i < playerUnits.length; i++) {

		var fogIndexAtPlayer = pixelToArray_Collision(playerUnits[i].x, playerUnits[i].y - 15);
		var aboveTile = fogIndexAtPlayer - COLLISION_COLS;
		var belowTile = fogIndexAtPlayer + COLLISION_COLS;
		var leftTile = fogIndexAtPlayer - 1;
		var rightTile = fogIndexAtPlayer + 1;
		var aboveLeftTile = aboveTile - 1;
		var aboveLeftLeftTile = aboveTile - 2;
		var aboveRightTile = aboveTile + 1;
		var aboveRightRightTile = aboveTile + 2;
		var belowLeftTile = belowTile - 1;
		var belowRightTile = belowTile + 1;
		var belowLeftLeftTile = belowTile - 1;
		var belowRightRightTile = belowTile + 1;

		var twoAboveTile = aboveTile - COLLISION_COLS;
		var twoBelowTile = belowTile + COLLISION_COLS;
		var twoLeftTile = fogIndexAtPlayer - 2;
		var twoRightTile = fogIndexAtPlayer + 2;
		var twoAboveLeftTile = twoAboveTile - 1;
		var twoAboveLeftLeftTile = twoAboveTile - 2;
		var twoAboveRightTile = twoAboveTile + 1;
		var twoAboveRightRightTile = twoAboveTile + 2;
		var twoBelowLeftTile = twoBelowTile - 1;
		var twoBelowLeftLeftTile = twoBelowTile - 2;
		var twoBelowRightTile = twoBelowTile + 1;
		var twoBelowRightRightTile = twoBelowTile + 2;


		var threeAboveTile = twoAboveTile - COLLISION_COLS;
		var threeAboveLeftTile = threeAboveTile - 1;
		var threeAboveRightTile = threeAboveTile + 1;
		var threeBelowTile = twoBelowTile - COLLISION_COLS;
		var threeBelowLeftTile = threeBelowTile - 1;
		var threeBelowLeftLeftTile = threeBelowTile - 2;
		var threeBelowRightTile = threeBelowTile + 1;
		var threeBelowRightRightTile = threeBelowTile + 2;

		if (fogOfWarGrid[fogIndexAtPlayer] != DISCOVERED ||
		    fogOfWarGrid[aboveTile] != DISCOVERED ||
		    fogOfWarGrid[belowTile] != DISCOVERED ||
		    fogOfWarGrid[leftTile] != DISCOVERED ||
		    fogOfWarGrid[rightTile] != DISCOVERED ||
		    fogOfWarGrid[aboveLeftTile] != DISCOVERED ||
		    fogOfWarGrid[aboveLeftLeftTile] != DISCOVERED ||
		    fogOfWarGrid[aboveRightTile] != DISCOVERED ||
		    fogOfWarGrid[aboveRightRightTile] != DISCOVERED ||
		    fogOfWarGrid[belowLeftTile] != DISCOVERED ||
		    fogOfWarGrid[belowLeftLeftTile] != DISCOVERED ||
		    fogOfWarGrid[belowRightRightTile] != DISCOVERED ||
		    fogOfWarGrid[twoLeftTile] != DISCOVERED ||
		    fogOfWarGrid[twoRightTile] != DISCOVERED ||
		    fogOfWarGrid[twoAboveTile] != DISCOVERED ||
		    fogOfWarGrid[twoBelowTile] != DISCOVERED) {

				fogOfWarGrid[fogIndexAtPlayer] = DISCOVERED;
				fogOfWarGrid[aboveTile] = DISCOVERED;
				fogOfWarGrid[belowTile] = DISCOVERED;
				fogOfWarGrid[leftTile] = DISCOVERED;
				fogOfWarGrid[rightTile] = DISCOVERED;
				fogOfWarGrid[aboveLeftTile] = DISCOVERED;
				fogOfWarGrid[aboveLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[aboveRightTile] = DISCOVERED;
				fogOfWarGrid[aboveRightRightTile] = DISCOVERED;
				fogOfWarGrid[belowLeftTile] = DISCOVERED;
				fogOfWarGrid[belowLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[belowRightTile] = DISCOVERED;
				fogOfWarGrid[belowRightRightTile] = DISCOVERED;

				fogOfWarGrid[twoLeftTile] = DISCOVERED;
				fogOfWarGrid[twoRightTile] = DISCOVERED;
				fogOfWarGrid[twoAboveTile] = DISCOVERED;
				fogOfWarGrid[twoAboveLeftTile] = DISCOVERED;
				fogOfWarGrid[twoAboveLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[twoAboveRightTile] = DISCOVERED;
				fogOfWarGrid[twoAboveRightRightTile] = DISCOVERED;
				fogOfWarGrid[twoBelowTile] = DISCOVERED;
				fogOfWarGrid[twoBelowLeftTile] = DISCOVERED;
				fogOfWarGrid[twoBelowLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[twoBelowRightTile] = DISCOVERED;
				fogOfWarGrid[twoBelowRightRightTile] = DISCOVERED;

				fogOfWarGrid[threeAboveTile] = DISCOVERED;
				fogOfWarGrid[threeAboveLeftTile] = DISCOVERED;
				fogOfWarGrid[threeAboveRightTile] = DISCOVERED;
				fogOfWarGrid[threeBelowTile] = DISCOVERED;
				fogOfWarGrid[threeBelowLeftTile] = DISCOVERED;
				fogOfWarGrid[threeBelowLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[threeBelowRightTile] = DISCOVERED;
				fogOfWarGrid[threeBelowRightRightTile] = DISCOVERED;

		}
	}

	for (var i = 0; i < playerBuildings.length; i++) {

		var fogIndexAtBuilding = pixelToArray_Collision(playerBuildings[i].x, playerBuildings[i].y - 15);
		var aboveTile = fogIndexAtBuilding - COLLISION_COLS;
		var belowTile = fogIndexAtBuilding + COLLISION_COLS;
		var leftTile = fogIndexAtBuilding - 1;
		var rightTile = fogIndexAtBuilding + 1;
		var aboveLeftTile = aboveTile - 1;
		var aboveLeftLeftTile = aboveTile - 2;
		var aboveRightTile = aboveTile + 1;
		var aboveRightRightTile = aboveTile + 2;
		var belowLeftTile = belowTile - 1;
		var belowRightTile = belowTile + 1;
		var belowLeftLeftTile = belowTile - 1;
		var belowRightRightTile = belowTile + 1;

		var twoAboveTile = aboveTile - COLLISION_COLS;
		var twoBelowTile = belowTile + COLLISION_COLS;
		var twoLeftTile = fogIndexAtBuilding - 2;
		var twoRightTile = fogIndexAtBuilding + 2;
		var twoAboveLeftTile = twoAboveTile - 1;
		var twoAboveLeftLeftTile = twoAboveTile - 2;
		var twoAboveRightTile = twoAboveTile + 1;
		var twoAboveRightRightTile = twoAboveTile + 2;
		var twoBelowLeftTile = twoBelowTile - 1;
		var twoBelowLeftLeftTile = twoBelowTile - 2;
		var twoBelowRightTile = twoBelowTile + 1;
		var twoBelowRightRightTile = twoBelowTile + 2;


		var threeAboveTile = twoAboveTile - COLLISION_COLS;
		var threeAboveLeftTile = threeAboveTile - 1;
		var threeAboveRightTile = threeAboveTile + 1;
		var threeBelowTile = twoBelowTile - COLLISION_COLS;
		var threeBelowLeftTile = threeBelowTile - 1;
		var threeBelowLeftLeftTile = threeBelowTile - 2;
		var threeBelowRightTile = threeBelowTile + 1;
		var threeBelowRightRightTile = threeBelowTile + 2;

		if (fogOfWarGrid[fogIndexAtBuilding] != DISCOVERED ||
		    fogOfWarGrid[aboveTile] != DISCOVERED ||
		    fogOfWarGrid[belowTile] != DISCOVERED ||
		    fogOfWarGrid[leftTile] != DISCOVERED ||
		    fogOfWarGrid[rightTile] != DISCOVERED ||
		    fogOfWarGrid[aboveLeftTile] != DISCOVERED ||
		    fogOfWarGrid[aboveLeftLeftTile] != DISCOVERED ||
		    fogOfWarGrid[aboveRightTile] != DISCOVERED ||
		    fogOfWarGrid[aboveRightRightTile] != DISCOVERED ||
		    fogOfWarGrid[belowLeftTile] != DISCOVERED ||
		    fogOfWarGrid[belowLeftLeftTile] != DISCOVERED ||
		    fogOfWarGrid[belowRightRightTile] != DISCOVERED ||
		    fogOfWarGrid[twoLeftTile] != DISCOVERED ||
		    fogOfWarGrid[twoRightTile] != DISCOVERED ||
		    fogOfWarGrid[twoAboveTile] != DISCOVERED ||
		    fogOfWarGrid[twoBelowTile] != DISCOVERED) {

				fogOfWarGrid[fogIndexAtBuilding] = DISCOVERED;
				fogOfWarGrid[aboveTile] = DISCOVERED;
				fogOfWarGrid[belowTile] = DISCOVERED;
				fogOfWarGrid[leftTile] = DISCOVERED;
				fogOfWarGrid[rightTile] = DISCOVERED;
				fogOfWarGrid[aboveLeftTile] = DISCOVERED;
				fogOfWarGrid[aboveLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[aboveRightTile] = DISCOVERED;
				fogOfWarGrid[aboveRightRightTile] = DISCOVERED;
				fogOfWarGrid[belowLeftTile] = DISCOVERED;
				fogOfWarGrid[belowLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[belowRightTile] = DISCOVERED;
				fogOfWarGrid[belowRightRightTile] = DISCOVERED;

				fogOfWarGrid[twoLeftTile] = DISCOVERED;
				fogOfWarGrid[twoRightTile] = DISCOVERED;
				fogOfWarGrid[twoAboveTile] = DISCOVERED;
				fogOfWarGrid[twoAboveLeftTile] = DISCOVERED;
				fogOfWarGrid[twoAboveLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[twoAboveRightTile] = DISCOVERED;
				fogOfWarGrid[twoAboveRightRightTile] = DISCOVERED;
				fogOfWarGrid[twoBelowTile] = DISCOVERED;
				fogOfWarGrid[twoBelowLeftTile] = DISCOVERED;
				fogOfWarGrid[twoBelowLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[twoBelowRightTile] = DISCOVERED;
				fogOfWarGrid[twoBelowRightRightTile] = DISCOVERED;

				fogOfWarGrid[threeAboveTile] = DISCOVERED;
				fogOfWarGrid[threeAboveLeftTile] = DISCOVERED;
				fogOfWarGrid[threeAboveRightTile] = DISCOVERED;
				fogOfWarGrid[threeBelowTile] = DISCOVERED;
				fogOfWarGrid[threeBelowLeftTile] = DISCOVERED;
				fogOfWarGrid[threeBelowLeftLeftTile] = DISCOVERED;
				fogOfWarGrid[threeBelowRightTile] = DISCOVERED;
				fogOfWarGrid[threeBelowRightRightTile] = DISCOVERED;

		}
	}

}
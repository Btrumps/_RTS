var showBuildingGrid = false;
var showBuildOptions = false;
var buildingToShow; // will be the specific world tile (ex: PLAYER_BASE)
var buildingToMake; // will be the generic building to make (ex: BASE)

// whichBuilding needs to equal a world tile var (PLAYER_CAMP, PLAYER_BASE, etc)
function drawBuildingGrid() {
		var mouseCol = Math.floor(mouseX / WORLD_W);
		var mouseRow = Math.floor(mouseY / WORLD_H);
		var mouseArrayIndex = colRowToArrayIndex(mouseCol, mouseRow);
		var tileTypeAtIndex = worldGrid[mouseArrayIndex];

		var aboveTile = mouseArrayIndex - WORLD_COLS;
		var belowTile = mouseArrayIndex + WORLD_COLS;
		var leftTile = mouseArrayIndex - 1;
		var rightTile = mouseArrayIndex + 1;
		var aboveLeftTile = aboveTile - 1;
		var aboveRightTile = aboveTile + 1;
		var belowLeftTile = belowTile - 1;
		var belowRightTile = belowTile + 1;
		

		if (canBuildOn(mouseArrayIndex)) {
			drawBitmapCenteredWithRotation(worldPics[buildingToShow],
			(mouseCol + .5) * WORLD_W,
			(mouseRow + .5) * WORLD_H,
			0, 0.5);
		} else {
			colorRect(mouseCol * WORLD_W, mouseRow * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(aboveTile)) {
			colorRect(mouseCol * WORLD_W, (mouseRow - 1) * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect(mouseCol * WORLD_W, (mouseRow - 1) * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(belowTile)) {
			colorRect(mouseCol * WORLD_W, (mouseRow + 1) * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect(mouseCol * WORLD_W, (mouseRow + 1) * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(leftTile)) {
			colorRect((mouseCol -1) * WORLD_W, mouseRow * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect((mouseCol -1) * WORLD_W, mouseRow * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(rightTile)) {
			colorRect((mouseCol + 1) * WORLD_W, mouseRow * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect((mouseCol + 1) * WORLD_W, mouseRow * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(aboveLeftTile)) {
			colorRect((mouseCol - 1) * WORLD_W, (mouseRow - 1) * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect((mouseCol - 1) * WORLD_W, (mouseRow - 1) * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(aboveRightTile)) {
			colorRect((mouseCol + 1) * WORLD_W, (mouseRow - 1) * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect((mouseCol + 1) * WORLD_W, (mouseRow - 1) * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(belowLeftTile)) {
			colorRect((mouseCol - 1) * WORLD_W, (mouseRow + 1) * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect((mouseCol - 1) * WORLD_W, (mouseRow + 1) * WORLD_H, 40,40, 'red', .5);
		}

		if (canBuildOn(belowRightTile)) {
			colorRect((mouseCol + 1) * WORLD_W, (mouseRow + 1) * WORLD_H, 40,40, 'green', .5);
		} else {
			colorRect((mouseCol + 1) * WORLD_W, (mouseRow + 1) * WORLD_H, 40,40, 'red', .5);
		}

	}
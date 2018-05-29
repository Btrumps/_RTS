const MOUSE_LEFT_CLICK = 1;
const MOUSE_RIGHT_CLICK = 3;

const MIN_DIST_TO_COUNT_DRAG = 10;
const MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE = 25;
const MAX_DIST_FROM_MOUSE_TO_FIND_ENEMY = 25;
const MAX_DIST_BEFORE_REMOVING_OFFSET = 150;
const MAX_DIST_TO_SEARCH_FOR_SAME_TYPE = 375;

const MOUSE_ACTION_CLICKED_ON_GROUND = 1;
const MOUSE_ACTION_CLICKED_ON_TREE = 2;
const MOUSE_ACTION_CLICKED_ON_BASE = 3;
const MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT = 4;
const MOUSE_ACTION_CLICKED_ON_ENEMY_BUILDING = 5;
const MOUSE_ACTION_ATTACK_MOVE = 6;

var isMouseDragging = false;

var selectedUnits = [];
var selectedBuildings = [];

var attackMovePressed = false;
var justPlacedBuilding = false;

var lassoX1 = 0;
var lassoX2 = 0;
var lassoY1 = 0;
var lassoY2 = 0;

var mouseX; // world relative
var mouseY; // world relative
var mouseScreenX; // screen relative
var mouseScreenY; // screen relative

function calculateMousePos(evt) {
	var rect = canvas.getBoundingClientRect();

	mouseScreenX = evt.clientX - rect.left;
	mouseScreenY = evt.clientY - rect.top;
}


function mousemoveHandler(evt) {
	calculateMousePos(evt);
	mouseX = mouseScreenX + camPanX;
	mouseY = mouseScreenY + camPanY;

	if(isMouseDragging) { // if we are moving the mouse and the mouse button is held down...
		lassoX2 = mouseX;
		lassoY2 = mouseY;
	}

}

function mousedownHandler(evt) {
	if (evt.which == MOUSE_LEFT_CLICK) { // if left mouse button is pressed...
		lassoX1 = mouseX;
		lassoY1 = mouseY;
		isMouseDragging = true;
	}

	// resets the lasso values so that mouseMovedEnoughToTreatAsDrag sets back to false.
	// may be a problem in the future
	lassoX2 = lassoX1;
	lassoY2 = lassoY1;
}

function mouseupHandler(evt) {
	isMouseDragging = false;
	actionCount++;

	if (mouseMovedEnoughToTreatAsDrag()) {
		// clears the array
		selectedUnits = []; 
		selectedBuildings = [];

		showBuildGrid = false;
		currentSelectedGroup = null;


		for(var i = 0; i < playerUnits.length; i++) {
			if (playerUnits[i].isInBox(lassoX1, lassoY1, lassoX2, lassoY2)) {
				selectedUnits.push(playerUnits[i]);
			}
		}

		// if no units selected, select buildings with priority system
		if (selectedUnits.length == 0) {
			for (var i = 0; i < playerBuildings.length; i++) {
				if (playerBuildings[i].isInBox(lassoX1, lassoY1, lassoX2, lassoY2)) {
					selectedBuildings.push(playerBuildings[i]);
				}
			}


			// build selection priority system
			var baseHasBeenFound = false;
			var barracksHasBeenFound = false;
			var armoryHasBeenFound = false;
			var campHasBeenFound = false;
			for (var j = 0; j < selectedBuildings.length; j++) {
				if (selectedBuildings[j].isBase) {
					baseHasBeenFound = true;
				}
				if (selectedBuildings[j].isBarracks) {
					barracksHasBeenFound = true;
				}
				if (selectedBuildings[j].isArmory) {
					armoryHasBeenFound = true;
				}
				if (selectedBuildings[j].isCamp) {
					campHasBeenFound = true;
				}
			}

			var buildingsToRemoveArray = [];
			if (baseHasBeenFound) {
				for (var k = 0; k < selectedBuildings.length; k++) {
					if (selectedBuildings[k].isBase == false) {
						buildingsToRemoveArray.push(selectedBuildings[k]);
					}
				}
			} else if (barracksHasBeenFound) {
				for (var k = 0; k < selectedBuildings.length; k++) {
					if (selectedBuildings[k].isBarracks == false) {
						buildingsToRemoveArray.push(selectedBuildings[k]);
					}
				}
			} else if (armoryHasBeenFound) {
				for (var k = 0; k < selectedBuildings.length; k++) {
					if (selectedBuildings[k].isArmory == false) {
						buildingsToRemoveArray.push(selectedBuildings[k]);
					}
				}
			} else if (campHasBeenFound) {
				for (var k = 0; k < selectedBuildings.length; k++) {
					if (selectedBuildings[k].isCamp == false) {
						buildingsToRemoveArray.push(selectedBuildings[k]);
					}
				}
			}

			for (h = 0; h < buildingsToRemoveArray.length; h++) {
					var buildingToRemoveIndex = selectedBuildings.indexOf(buildingsToRemoveArray[h]);
					selectedBuildings.splice(buildingToRemoveIndex, 1);
			}
		}
	

	} else if (evt.which == MOUSE_RIGHT_CLICK) { //if mouse didn't move enough AND right clicked...

		// if mouse is inside of the minimap
		if (mouseScreenX > UI_BORDER_GAP &&
		   	mouseScreenX < MINIMAP_W - UI_BORDER_GAP &&
		    mouseScreenY > MINIMAP_TOP_Y + UI_BORDER_GAP &&
		    mouseScreenY < CANVAS_HEIGHT - UI_BORDER_GAP) {

			moveSelectedUnitsToMinimapLocation(false);
			return;
		}

		var colUnderMouse = Math.floor(mouseX / WORLD_W);
		var rowUnderMouse = Math.floor(mouseY / WORLD_H);
		var tileUnderMouse = returnTileTypeAtColRow(colUnderMouse, rowUnderMouse);

		// if we right click on a tree..
		if (tileUnderMouse == WORLD_TREE 
			&& selectedUnits.length > 0) { // added to stop code from running without having units selected
			for (var i = 0; i < selectedUnits.length; i++) {
				addDestinationToQueue(	selectedUnits[i],
										mouseX,
										mouseY,
										MOUSE_ACTION_CLICKED_ON_TREE);
			}

		// if we right click our base, go to our base's X/Y
		} else if (tileUnderMouse == PLAYER_BASE 
			&& selectedUnits.length > 0) { // added to stop code from running without having units selected
			for (var i = 0; i < selectedUnits.length; i++) {
				var clickedBase = getBuildingUnderMouse();

				addDestinationToQueue(	selectedUnits[i],
										clickedBase.x,
										clickedBase.y,
										MOUSE_ACTION_CLICKED_ON_BASE);


			}
		
		//if we right click and there's an enemy under mouse
		} else if (enemyBuildingUnderMouse() || enemyUnitUnderMouse()) {
			var closestEnemy = getClosestEnemyUnderMouse(mouseX, mouseY);

			// if for some reason no enemy was close enough to get clicked, move to the destination we clicked
			if (closestEnemy == null) {
				for (var i = 0; i < selectedUnits.length; i++) {
					addDestinationToQueue(	selectedUnits[i],
											mouseX,
											mouseY,
											MOUSE_ACTION_CLICKED_ON_GROUND);
				}
				return;
			}

			if (closestEnemy.isUnit) {
				for (var i = 0; i < selectedUnits.length; i++) {
					addDestinationToQueue(	selectedUnits[i],
											mouseX,
											mouseY,
											MOUSE_ACTION_CLICKED_ON_ENEMY_UNIT);
				}

			} else if (closestEnemy.isUnit == false) {
				for (var i = 0; i < selectedUnits.length; i++) {
					addDestinationToQueue(	selectedUnits[i],
											mouseX,
											mouseY,
											MOUSE_ACTION_CLICKED_ON_ENEMY_BUILDING);
				}
			}
			
		} else if (	selectedBuildings.length > 0) {

			for (i = 0; i < selectedBuildings.length; i++) {
				selectedBuildings[i].rallyPointX = mouseX;
				selectedBuildings[i].rallyPointY = mouseY;
			}

		} else { // if we haven't right clicked on a tree, player base, or enemy...

			var sumOfAllSelectedUnitsX = 0;
			var sumOfAllSelectedUnitsY = 0;
			var centerOfAllSelectedUnitsX = 0;
			var centerOfAllSelectedUnitsY = 0;

			// for each selected unit, add up all X/Y values...
			for (var i = 0; i < selectedUnits.length; i++) {

				sumOfAllSelectedUnitsX += selectedUnits[i].x;
				sumOfAllSelectedUnitsY += selectedUnits[i].y;
			}

			// get an average center point...
			centerOfAllSelectedUnitsX = sumOfAllSelectedUnitsX / selectedUnits.length;
			centerOfAllSelectedUnitsY = sumOfAllSelectedUnitsY / selectedUnits.length;

			for (var i = 0; i < selectedUnits.length; i++) {
				if (selectedUnits[i].currentState != PLAYER_STATE_BUILDING) { // won't stop the worker from building
					var offsetX = selectedUnits[i].x - centerOfAllSelectedUnitsX;
					var offsetY = selectedUnits[i].y - centerOfAllSelectedUnitsY;
					
					// refund the money because we never made the building
					if (selectedUnits[i].isWorker && selectedUnits[i].currentState == PLAYER_STATE_WALKING_TO_BUILD) {
						playerCurrentWood += selectedUnits[i].queuedBuildingCost;
					}

					if (selectedUnitTooFarFromTheGroup()) {
						addDestinationToQueue(	selectedUnits[i],
												mouseX,
												mouseY,
												MOUSE_ACTION_CLICKED_ON_GROUND);
					} else {
						addDestinationToQueue(	selectedUnits[i],
												mouseX + offsetX,
												mouseY + offsetY,
												MOUSE_ACTION_CLICKED_ON_GROUND);
					}			
				}
			}
		}

	} else if (evt.which == MOUSE_LEFT_CLICK) { // if mouse didn't move enough AND left clicked...
		
		// if mouse is leftclicking inside of the minimap
		if (mouseScreenX > UI_BORDER_GAP &&
		   	mouseScreenX < MINIMAP_W - UI_BORDER_GAP &&
		    mouseScreenY > MINIMAP_TOP_Y + UI_BORDER_GAP &&
		    mouseScreenY < CANVAS_HEIGHT - UI_BORDER_GAP) {
			
			if (attackMovePressed) {

		 		moveSelectedUnitsToMinimapLocation(true);

			} else {

				var leftX = UI_BORDER_GAP;
				var rightX = MINIMAP_W - UI_BORDER_GAP
				var topY =  MINIMAP_TOP_Y + UI_BORDER_GAP;
				var bottomY = CANVAS_HEIGHT - UI_BORDER_GAP;
				
				var actualMinimapWidth = rightX - leftX;
				var actualMinimapHeight = bottomY - topY;
		
				var minimapMouseX = mouseScreenX - leftX;
				var minimapMouseY = mouseScreenY - topY;

				camPanX = (minimapMouseX * 400) / actualMinimapWidth;
				camPanY = (minimapMouseY * 400) / actualMinimapHeight;
			}

		} else {

			currentSelectedGroup = null;
			
			// allows worker to build!
			for (var i = 0; i < selectedUnits.length; i++) {
				// if a worker hasn't been chosen to build
				if (showBuildingGrid) {
					var colMouse = Math.floor(mouseX / WORLD_W);
					var rowMouse = Math.floor(mouseY / WORLD_H);
					var arrayIndex = colRowToArrayIndex(colMouse, rowMouse);

					// if we can build on this tile
					// and this worker hasn't already been chosen for a previous task
					// AND is not building
					if (canBuildOn(arrayIndex) && selectedUnits[i].isWorker &&
						selectedUnits[i].currentState != PLAYER_STATE_BUILDING &&
					 	selectedUnits[i].currentState != PLAYER_STATE_WALKING_TO_BUILD) {

						selectedUnits[i].goToNear(mouseX, mouseY);

						// pass in array index, buildingX/Y, so that we can spawn the Camp
						// worker will use building X/Y to "hold position" at the building site until completed
						selectedUnits[i].arrayIndexForBuilding = arrayIndex;
						selectedUnits[i].buildingX = colMouse * WORLD_W;
						selectedUnits[i].buildingY = rowMouse * WORLD_H;

						// if the building currently showing on the grid is a ____....
						if (buildingToMake) {
							var costToBuild = getBuildingCost(buildingToMake);
							selectedUnits[i].currentState = PLAYER_STATE_WALKING_TO_BUILD;
							selectedUnits[i].whatToBuild = buildingToMake;
							selectedUnits[i].queuedBuildingCost = costToBuild;
							playerCurrentWood -= costToBuild;
						}

						showBuildingGrid = false; // if this is true, we can't select bases or other buildings while grid is open.
						justPlacedBuilding = true; // if this is true, works will not deselect when left clicking to place building.
					}
				}
			}

			// handles left click single selection and double left click selection
			if (justPlacedBuilding == false &&
				showBuildingGrid == false &&
				attackMovePressed == false) {

				singleAndDoubleLeftClickHandling();

			}

			if (attackMovePressed && justPlacedBuilding == false) {
				for (var i = 0; i < selectedUnits.length; i++) {
					if (selectedUnits[i].currentState != PLAYER_STATE_BUILDING) {
						addDestinationToQueue(	selectedUnits[i],
												mouseX,
												mouseY,
												MOUSE_ACTION_ATTACK_MOVE);
					}
				}

				attackMovePressed = false;
			}
			
		}

		// we set this to false because it stops us from deselecting
		// after making a building or using attack move
		justPlacedBuilding = false;
	}

}

function addDestinationToQueue(whichUnit, whichX, whichY, whichMouseAction) {
	if (keyHeld_Shift) {
		whichUnit.addDestinationToQueue(whichX, whichY, whichMouseAction);
	} else {
		whichUnit.destinationQueue = [];
		whichUnit.hasChangedDestination = true;
		whichUnit.addDestinationToQueue(whichX, whichY, whichMouseAction);
	}
}


function mouseMovedEnoughToTreatAsDrag() {
		var deltaX = lassoX1 - lassoX2;
		var deltaY = lassoY1 - lassoY2;
		var dragDist = Math.sqrt(deltaX*deltaX + deltaY*deltaY);
		return (dragDist > MIN_DIST_TO_COUNT_DRAG);
}

function getPlayerUnitUnderMouse() {
	var closestDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
	var closestUnit = null; // using null instead of undefined, to mean 'none found'

	for (var i = 0; i <playerUnits.length; i++) {
		var pDist = playerUnits[i].distFromImage(mouseX, mouseY);
		if (pDist < closestDistanceFoundToMouse) {
			closestUnit = playerUnits[i];
			closestDistanceFoundToMouse = pDist;
		}

	}

	return closestUnit;
}

function getBuildingUnderMouse() {
	var closestDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
	var closestBuilding = null; // using null instead of undefined, to mean 'none found'

	for (var i = 0; i < playerBuildings.length; i++) {
		var pDist = playerBuildings[i].distFrom(mouseX, mouseY);
		if (pDist < closestDistanceFoundToMouse) {
			closestBuilding = playerBuildings[i];
			closestDistanceFoundToMouse = pDist;
		}

	}
	// add in same for enemy units, once enemy is made

	return closestBuilding;
}

function getClosestEnemyUnderMouse(atX, atY) {
	var closestUnitDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
	var closestBuildingDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
	var closestUnit = null; // using null instead of undefined, to mean 'none found'
	var closestBuilding = null;

	for (var i = 0; i < enemyUnits.length; i++) {
		var eDist = enemyUnits[i].distFromImage(atX, atY);
		if (eDist < closestUnitDistanceFoundToMouse) {
			closestUnit = enemyUnits[i];
			closestUnitDistanceFoundToMouse = eDist;
		}

	}

	for (var i = 0; i < enemyBuildings.length; i++) {
		var eDist = enemyBuildings[i].distFrom(atX, atY);
		if (eDist < closestBuildingDistanceFoundToMouse) {
			closestBuilding = enemyBuildings[i];
			closestBuildingDistanceFoundToMouse = eDist;
		}

	}

	if (closestBuilding == null ||
		closestUnitDistanceFoundToMouse < closestBuildingDistanceFoundToMouse) {
		return closestUnit;

	} else if (	closestUnit == null ||
				closestBuildingDistanceFoundToMouse < closestUnitDistanceFoundToMouse) {
		return closestBuilding;

	} else {
		console.log ('both closestUnit and closestBuilding are null...');
	}

}

function getEnemyUnitUnderMouse(atX, atY) {
	var closestDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
	var closestUnit = null; // using null instead of undefined, to mean 'none found'

	for (var i = 0; i < enemyUnits.length; i++) {
		var pDist = enemyUnits[i].distFromImage(atX, atY);
		if (pDist < closestDistanceFoundToMouse) {
			closestUnit = enemyUnits[i];
			closestDistanceFoundToMouse = pDist;
		}

	}

	return closestUnit;
}

function getEnemyBuildingUnderMouse(atX, atY) {
	var closestDistanceFoundToMouse = MIN_DIST_FOR_MOUSE_CLICK_SELECTABLE;
	var closestBuilding = null; // using null instead of undefined, to mean 'none found'

	for (var i = 0; i < enemyBuildings.length; i++) {
		var pDist = enemyBuildings[i].distFrom(atX, atY);
		if (pDist < closestDistanceFoundToMouse) {
			closestBuilding = enemyBuildings[i];
			closestDistanceFoundToMouse = pDist;
		}

	}

	return closestBuilding;
}

function enemyUnitUnderMouse() {
	for (var i = 0; i < enemyUnits.length; i++) {
		var enemyDistFromMouse = enemyUnits[i].distFrom(mouseX, mouseY);

		if (enemyDistFromMouse < MAX_DIST_FROM_MOUSE_TO_FIND_ENEMY) {
			return true;
		}
	}
	return false;
}

function enemyBuildingUnderMouse() {
	for (var i = 0; i < enemyBuildings.length; i++) {
		var enemyBuildingDistFromMouse = enemyBuildings[i].distFrom(mouseX, mouseY);

		if (enemyBuildingDistFromMouse < MAX_DIST_FROM_MOUSE_TO_FIND_ENEMY) {
			return true;
		}
	}
	return false;
}

function selectedUnitTooFarFromTheGroup() {
	for (var i = 0; i < selectedUnits.length; i++) {
		var selectedUnit = selectedUnits[i];
		for (var i = 0; i < selectedUnits.length; i++) {
			if (selectedUnit != selectedUnits[i]) {
				var distFound = selectedUnits[i].distFrom(selectedUnit.x, selectedUnit.y);

				if (distFound > MAX_DIST_BEFORE_REMOVING_OFFSET) {
					return true;
				}
			}
		}
	}

	return false;
}

function singleAndDoubleLeftClickHandling() {
	var selectedUnitUnderMouse = getPlayerUnitUnderMouse();
	var selectedBuildingUnderMouse = getBuildingUnderMouse();
	var lastUnitSelected;
	var lastBuildingSelected;

	// has to store unit/building before we clear selected unit/buildings
	// to check if we should select all units/buildings of the same type
	if (selectedUnits.length == 1) {
		lastUnitSelected = selectedUnits[0];
	}

	if (selectedBuildings.length == 1) {
		lastBuildingSelected = selectedBuildings[0];
	}

	selectedUnits = [];
	selectedBuildings = [];

	if (selectedUnitUnderMouse != null) {
		selectedUnits.push(selectedUnitUnderMouse);

		if (selectedUnits[0] === lastUnitSelected) {
			var selectedUnitType;

			if (selectedUnits[0].isWorker) {
				selectedUnitType = WORKER;
			} else if (selectedUnits[0].isSpearman) {
				selectedUnitType = SPEARMAN;
			} else if (selectedUnits[0].isArcher) {
				selectedUnitType = ARCHER;
			}

			// check the type of building and add all buildings of the same type to selectedBuildings
			for (var i = 0; i < playerUnits.length; i++) {
				if (selectedUnitType == WORKER &&
					playerUnits[i].isWorker &&
					playerUnits[i] != lastUnitSelected &&
					playerUnits[i].distFrom(lastUnitSelected.x, lastUnitSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedUnits.push(playerUnits[i]);

				} else if (	selectedUnitType == SPEARMAN &&
							playerUnits[i].isSpearman &&
							playerUnits[i] != lastUnitSelected &&
							playerUnits[i].distFrom(lastUnitSelected.x, lastUnitSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedUnits.push(playerUnits[i]);

				} else if (	selectedUnitType == ARCHER &&
							playerUnits[i].isArcher &&
							playerUnits[i] != lastUnitSelected &&
							playerUnits[i].distFrom(lastUnitSelected.x, lastUnitSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedUnits.push(playerUnits[i]);

				}
			}
		}

	} else if (selectedBuildingUnderMouse != null) {
		selectedBuildings.push(selectedBuildingUnderMouse);

		// if we double clicked on the same building...
		if (selectedBuildings[0] === lastBuildingSelected) {
			var selectedBuildingType = getPlayerBuildingType(selectedBuildings[0]);

			// check the type of building and add all buildings of the same type to selectedBuildings
			for (var i = 0; i < playerBuildings.length; i++) {
				if (selectedBuildingType == BASE &&
					playerBuildings[i].isBase &&
					playerBuildings[i] != lastBuildingSelected &&
					playerBuildings[i].distFrom(lastBuildingSelected.x, lastBuildingSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedBuildings.push(playerBuildings[i]);

				} else if (	selectedBuildingType == CAMP &&
							playerBuildings[i].isCamp &&
							playerBuildings[i] != lastBuildingSelected &&
							playerBuildings[i].distFrom(lastBuildingSelected.x, lastBuildingSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedBuildings.push(playerBuildings[i]);

				} else if (	selectedBuildingType == BARRACKS &&
							playerBuildings[i].isBarracks &&
							playerBuildings[i] != lastBuildingSelected &&
							playerBuildings[i].distFrom(lastBuildingSelected.x, lastBuildingSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedBuildings.push(playerBuildings[i]);

				} else if (	selectedBuildingType == ARMORY &&
							playerBuildings[i].isArmory &&
							playerBuildings[i] != lastBuildingSelected &&
					playerBuildings[i].distFrom(lastBuildingSelected.x, lastBuildingSelected.y) < MAX_DIST_TO_SEARCH_FOR_SAME_TYPE) {

					selectedBuildings.push(playerBuildings[i]);
				}
			}
		}
	}
}

function moveSelectedUnitsToMinimapLocation(attackMove) {
	var leftX = UI_BORDER_GAP;
	var rightX = MINIMAP_W - UI_BORDER_GAP
	var topY =  MINIMAP_TOP_Y + UI_BORDER_GAP;
	var bottomY = CANVAS_HEIGHT - UI_BORDER_GAP;
	
	var actualMinimapWidth = rightX - leftX;
	var actualMinimapHeight = bottomY - topY;
	var actualWorldWidth = WORLD_COLS * WORLD_W;
	var actualWorldHeight = WORLD_ROWS * WORLD_H;

	var minimapToWorldX = actualWorldWidth / actualMinimapWidth;
	var minimapToWorldY = actualWorldHeight / actualMinimapHeight;

	var minimapMouseX = mouseScreenX - leftX;
	var minimapMouseY = mouseScreenY - topY;

	var worldPointX = minimapMouseX * minimapToWorldX;
	var worldPointY = minimapMouseY * minimapToWorldY;

	var worldPointCol = Math.floor (worldPointX/WORLD_W);
	var worldPointRow = Math.floor (worldPointY/WORLD_H);

	var whichMouseAction;

	if (returnTileTypeAtColRow(worldPointCol, worldPointRow) == WORLD_TREE) {
		whichMouseAction = MOUSE_ACTION_CLICKED_ON_TREE;
	} else if (returnTileTypeAtColRow(worldPointCol, worldPointRow) == (ENEMY_BASE || ENEMY_CAMP || ENEMY_BARRACKS || ENEMY_ARMORY)) {
		whichMouseAction = MOUSE_ACTION_CLICKED_ON_ENEMY_BUILDING;
	} else if (returnTileTypeAtColRow(worldPointCol, worldPointRow) == PLAYER_BASE) {
		whichMouseAction = MOUSE_ACTION_CLICKED_ON_BASE;
	} else if (attackMove) {
		whichMouseAction = MOUSE_ACTION_ATTACK_MOVE;
		attackMovePressed = false;
	} else {
		whichMouseAction = MOUSE_ACTION_CLICKED_ON_GROUND;
	}

	for (var i = 0; i < selectedUnits.length; i++) {
		addDestinationToQueue(	selectedUnits[i],
								worldPointX,
								worldPointY,
								whichMouseAction);
	}
}

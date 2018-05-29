const UI_BORDER_GAP = 10;
const UI_BORDER_OUTLINE_SIZE = 1;
const UI_BORDER_COLOR = '#a59243';
const UI_INNER_BG_COLOR = '#232322';
const UI_COMMAND_BAR_BG_COLOR = UI_INNER_BG_COLOR;

const MINIMAP_W = 175;
const MINIMAP_H = 175;
const MINIMAP_TOP_Y = CANVAS_HEIGHT - MINIMAP_H;
const MINIMAP_TILE_W = (MINIMAP_W - UI_BORDER_GAP*2) / WORLD_COLS;
const MINIMAP_TILE_H = (MINIMAP_H - UI_BORDER_GAP*2) / WORLD_ROWS;
const MINIMAP_FIXED_CAMERA_OFFSET_X = 6;
const MINIMAP_FIXED_CAMERA_OFFSET_Y = CANVAS_HEIGHT - MINIMAP_H + 6;

const INFOBAR_W = 450
const INFOBAR_H = 125;
const INFOBAR_INNER_W = INFOBAR_W - UI_BORDER_GAP;
const INFOBAR_INNER_H = INFOBAR_H - UI_BORDER_GAP;
const INFOBAR_TOP_LEFT_X = CANVAS_WIDTH/2 - INFOBAR_INNER_W/2;
const INFOBAR_TOP_LEFT_Y = CANVAS_HEIGHT - INFOBAR_INNER_H;
const INFOBAR_MAX_SELECTED_UNITS_PER_ROW = 14;
const INFOBAR_SINGLE_UNIT_HEALTH_W = 75;
const INFOBAR_SINGLE_UNIT_HEALTH_H = 10;
const INFOBAR_MULTIPLE_UNIT_HEALTH_W = 25;
const INFOBAR_MULTIPLE_UNIT_HEALTH_H = 4;
const INFOBAR_SINGLE_BUILDING_QUEUE_W = 50;
const INFOBAR_SINGLE_BUILDING_QUEUE_H = 10;

const COMMAND_BAR_BOX_W = 175;
const COMMAND_BAR_BOX_H = 175;
const COMMAND_BAR_COLS = 3;
const COMMAND_BAR_ROWS = 3;
const COMMAND_BUTTON_W = 45;
const COMMAND_BUTTON_H = 45;
const COMMAND_BUTTON_TEXT_SPACING = 2;

const CONTROL_GROUP_MAX_LENGTH = 5;
const CONTROL_GROUP_BOX_W = 50;
const CONTROL_GROUP_BOX_H = 35;
const CONTROL_GROUP_BORDER = 4;
const CONTROL_GROUP_START_X = INFOBAR_TOP_LEFT_X;
const CONTROL_GROUP_START_Y = INFOBAR_TOP_LEFT_Y - CONTROL_GROUP_BOX_H;

const PLAYER_INFO_BOX_W = 375;
const PLAYER_INFO_BOX_H = 45;

var commandBarButtons = [0, 1, 2, 3, 4, 5, 6, 7, 8];

const Q_BUTTON = 0;
const W_BUTTON = 1;
const E_BUTTON = 2;
const A_BUTTON = 3;
const S_BUTTON = 4;
const D_BUTTON = 5;
const Z_BUTTON = 6;
const X_BUTTON = 7;
const C_BUTTON = 8;

var textNeededForQ = false;
var textNeededForW = false;
var textNeededForE = false;
var textNeededForA = false;
var textNeededForS = false;
var textNeededForD = false;
var textNeededForZ = false;
var textNeededForX = false;
var textNeededForC = false;

var textForQ;
var textForW;
var textForE;
var textForA;
var textForS;
var textForD;
var textForZ;
var textForX;
var textForC;

var offsetForQ = 0;
var offsetForW = 0;
var offsetForE = 0;
var offsetForA = 0;
var offsetForS = 0;
var offsetForD = 0;
var offsetForZ = 0;
var offsetForX = 0;
var offsetForC = 0;

var priceTextForQ;
var priceTextForW;
var priceTextForE;
var priceTextForA;
var priceTextOffsetQ = 0;
var priceTextOffsetW = 0;
var priceTextOffsetE = 0;
var priceTextOffsetA = 0;

var showUI = true;
var tipsEnabled = true;

function colRowToArrayIndexUI(col, row) {
	return col + (row * COMMAND_BAR_COLS);
}

function drawUI() {

	commandBarUI();
	miniMapUI();
	infoBarUI();
	controlGroupUI();
	playerInfoBoxBG();
	drawPlayerInfo(); // shows wood and supply	
}

function drawPlayerInfo() {
		drawSupply();
		drawScore();
		drawAPM();
}

function drawSupply () {
	colorText(	"SUPPLY:" + playerCurrentSupply + "/" + playerSupplyMax,
				canvas.width-145, 25, 'white', GAME_FONT);
}
function drawScore () {
	colorText(	"WOOD:" + playerCurrentWood,
				canvas.width-255, 25, 'white', GAME_FONT);
}
function drawAPM () {
	colorText(	"APM:" + apm,
				canvas.width-345, 25, 'white', GAME_FONT);
}

function playerInfoBoxBG() {
	// Border Outline
	colorRect(	CANVAS_WIDTH - PLAYER_INFO_BOX_W - UI_BORDER_OUTLINE_SIZE,
				0,
				PLAYER_INFO_BOX_W + UI_BORDER_OUTLINE_SIZE,
				PLAYER_INFO_BOX_H + UI_BORDER_OUTLINE_SIZE,
				UI_INNER_BG_COLOR);
	// Border
	colorRect(	CANVAS_WIDTH - PLAYER_INFO_BOX_W,
				0,
				PLAYER_INFO_BOX_W,
				PLAYER_INFO_BOX_H,
				UI_BORDER_COLOR);
	// Inner BG
	colorRect(	CANVAS_WIDTH - PLAYER_INFO_BOX_W + UI_BORDER_GAP,
				0,
				PLAYER_INFO_BOX_W - UI_BORDER_GAP,
				PLAYER_INFO_BOX_H - UI_BORDER_GAP,
				UI_INNER_BG_COLOR);

}

function commandBarUI() {
	// Border Outline
	colorRect(	canvas.width-COMMAND_BAR_BOX_W - UI_BORDER_OUTLINE_SIZE,
	 			canvas.height-COMMAND_BAR_BOX_H - UI_BORDER_OUTLINE_SIZE,
	 			COMMAND_BAR_BOX_W + UI_BORDER_OUTLINE_SIZE,
	 			COMMAND_BAR_BOX_H + UI_BORDER_OUTLINE_SIZE, UI_INNER_BG_COLOR);
	// Border
	colorRect(	canvas.width-COMMAND_BAR_BOX_W,
	 			canvas.height-COMMAND_BAR_BOX_H,
	 			COMMAND_BAR_BOX_W,
	 			COMMAND_BAR_BOX_H, UI_BORDER_COLOR);

	for (var eachRow = 0; eachRow < COMMAND_BAR_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < COMMAND_BAR_COLS; eachCol++) {
			var arrayIndex = colRowToArrayIndexUI(eachCol, eachRow);
			var whatButtonNeedsToBeDrawn = commandBarButtons[arrayIndex];
			var firstButtonX = canvas.width -COMMAND_BAR_BOX_W + UI_BORDER_GAP;
			var firstButtonY = canvas.height -COMMAND_BAR_BOX_H + UI_BORDER_GAP;
			var buttonX = 	(canvas.width - COMMAND_BAR_BOX_W + UI_BORDER_GAP) +
							(COMMAND_BUTTON_W * eachCol) + (UI_BORDER_GAP * eachCol);
			var buttonY = 	(canvas.height -COMMAND_BAR_BOX_H + UI_BORDER_GAP) +
							(COMMAND_BUTTON_H *eachRow) + (UI_BORDER_GAP * eachRow);


			chooseButtonTextAndPrices();
			
			switch(whatButtonNeedsToBeDrawn) {
				case Q_BUTTON:
					colorRect(	firstButtonX,
								firstButtonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'Q',
								firstButtonX + COMMAND_BUTTON_TEXT_SPACING,
								firstButtonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForQ, textForQ, buttonX - offsetForQ, buttonY);

					if (priceTextForQ != null) {
						colorText (	priceTextForQ,
									buttonX + COMMAND_BUTTON_W - UI_BORDER_GAP - priceTextOffsetQ,
									buttonY + COMMAND_BUTTON_H - 2,
									'white',
									GAME_UI_FONT_SMALLEST);
					}

					break;

				case W_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'W',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);

					displayCommandTextIfNeeded(textNeededForW, textForW, buttonX - offsetForW, buttonY);

					if (priceTextForW != null) {
						colorText (	priceTextForW,
									buttonX + COMMAND_BUTTON_W - UI_BORDER_GAP - priceTextOffsetW,
									buttonY + COMMAND_BUTTON_H - 2,
									'white',
									GAME_UI_FONT_SMALLEST);
					}

					break;

				case E_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'E',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForE, textForE, buttonX - offsetForE, buttonY);

					if (priceTextForE != null) {
						colorText (	priceTextForE,
									buttonX + COMMAND_BUTTON_W - UI_BORDER_GAP - priceTextOffsetE,
									buttonY + COMMAND_BUTTON_H - 2,
									'white',
									GAME_UI_FONT_SMALLEST);
					}

					break;

				case A_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'A',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);

					displayCommandTextIfNeeded(textNeededForA, textForA, buttonX - offsetForA, buttonY);

					if (priceTextForA != null) {
						colorText (	priceTextForA,
									buttonX + COMMAND_BUTTON_W - UI_BORDER_GAP - priceTextOffsetA,
									buttonY + COMMAND_BUTTON_H - 2,
									'white',
									GAME_UI_FONT_SMALLEST);
					}

					break;

				case S_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'S',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForS, textForS, buttonX - offsetForS, buttonY);

					break;

				case D_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'D',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForD, textForD, buttonX - offsetForD, buttonY);

					break;

				case Z_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'Z',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForZ, textForZ, buttonX - offsetForZ, buttonY);

					break;

				case X_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'X',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForX, textForX, buttonX - offsetForX, buttonY);

					break;

				case C_BUTTON:
					colorRect(	buttonX,
								buttonY,
								COMMAND_BUTTON_W,
								COMMAND_BUTTON_H, UI_COMMAND_BAR_BG_COLOR);
					colorText(	'C',
								buttonX + COMMAND_BUTTON_TEXT_SPACING,
								buttonY - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
								'grey',
								GAME_UI_FONT);
					
					displayCommandTextIfNeeded(textNeededForC, textForC, buttonX - offsetForC, buttonY);

					break;


			}

		}
	}
}

function chooseButtonTextAndPrices() {
	if (selectedUnits.length > 0) {
				var workerInSelectedArray = false;
				for (var i = 0; i < selectedUnits.length; i++) {
					if (selectedUnits[i].isWorker) {
						workerInSelectedArray = true;
						break;
					}
				}

				if (workerInSelectedArray) {
					if (showBuildOptions == false) {
						turnAllCommandBarTextOff();
						textNeededForA = true;
						textNeededForD = true;
						textForA = 'Attack';
						textForD = 'Build';
						offsetForA = 5;
						offsetForD = 2;
					} else {
						turnAllCommandBarTextOff();
						textNeededForQ = true;
						textNeededForW = true;
						textNeededForE = true;
						textNeededForA = true;
						textForQ = 'Base';
						textForW = 'Camp';
						textForE = 'Rax';
						textForA = 'Armory';
						offsetForQ = 2;
						offsetForW = 2;
						offsetForE = 0;
						offsetForA = 5;

						priceTextForQ = BASE_BUY_COST;
						priceTextForW = CAMP_BUY_COST;
						priceTextForE = BARRACKS_BUY_COST;
						priceTextForA = ARMORY_BUY_COST;
						priceTextOffsetQ = 11;
						priceTextOffsetW = 8;
						priceTextOffsetE = 9;
						priceTextOffsetA = 10;
					}
				} else {
					turnAllCommandBarTextOff();
					textNeededForA = true;
					textForA = 'Attack';
					offsetForA = 5;
				}


			} else if (selectedBuildings.length > 0) {
				// can only select 1 building type at a time
				if (selectedBuildings[0].isBase) {
					turnAllCommandBarTextOff();
					textNeededForQ = true;
					textForQ = 'Worker';
					offsetForQ = 7;

					priceTextForQ = WORKER_BUY_COST;
					priceTextOffsetQ = 4;

				} else if (selectedBuildings[0].isCamp) {
					turnAllCommandBarTextOff();
	
				} else if (selectedBuildings[0].isBarracks) {
					turnAllCommandBarTextOff();
					textNeededForQ = true;
					textNeededForW = true;
					textForQ = 'Spear';
					textForW = 'Archer';
					offsetForQ = 6;
					offsetForW = 6;

					priceTextForQ = SPEARMAN_BUY_COST;
					priceTextForW = ARCHER_BUY_COST;
					priceTextOffsetQ = 9;
					priceTextOffsetW = 9;

				} else if (selectedBuildings[0].isArmory) {
					turnAllCommandBarTextOff();
					textNeededForQ = true;
					textNeededForW = true;
					textForQ = 'DMG';
					textForW = 'AttRate';
					offsetForQ = 2;
					offsetForW = 8.25;

					if (maxDamageUpgradeCount > 0) {
						priceTextForQ = damageUpgradeCost;
						priceTextOffsetQ = 9;
					} else {
						priceTextForQ = 'N/A';
						priceTextOffsetQ = 12;
					}

					if (maxAttackRateUpgradeCount > 0) {
						priceTextForW = attackRateUpgradeCost;
						priceTextOffsetW = 9;
					} else {
						priceTextForW = 'N/A';
						priceTextOffsetW = 12;
					}
					
				} 
			} else {
				turnAllCommandBarTextOff();
			}
}

function displayCommandTextIfNeeded(isTextNeeded, whichText, whatX, whatY) {

	if (isTextNeeded) {
		colorText(	whichText,
					whatX + 8 + COMMAND_BUTTON_TEXT_SPACING,
					whatY - 18 - COMMAND_BUTTON_TEXT_SPACING + COMMAND_BUTTON_H,
					'white',
					GAME_UI_FONT_SMALL);
	}
}

function controlGroupUI() {

	var controlGroupArray = [];
	var amountInGroup_1 = 0;
	var amountInGroup_2 = 0;
	var amountInGroup_3 = 0;
	var amountInGroup_4 = 0;
	var amountInGroup_5 = 0;

	for (var i = 0; i < playerUnits.length; i++) {
			if (playerUnits[i].controlGroup_1) {
				amountInGroup_1++;
			}
			if (playerUnits[i].controlGroup_2) {
				amountInGroup_2++;
			}
			if (playerUnits[i].controlGroup_3) {
				amountInGroup_3++;
			}
			if (playerUnits[i].controlGroup_4) {
				amountInGroup_4++;
			}
			if (playerUnits[i].controlGroup_5) {
				amountInGroup_5++;
			}
	}

	for (var j = 0; j < playerBuildings.length; j++) {
			if (playerBuildings[j].controlGroup_1) {
				amountInGroup_1++;
			}
			if (playerBuildings[j].controlGroup_2) {
				amountInGroup_2++;
			}
			if (playerBuildings[j].controlGroup_3) {
				amountInGroup_3++;
			}
			if (playerBuildings[j].controlGroup_4) {
				amountInGroup_4++;
			}
			if (playerBuildings[j].controlGroup_5) {
				amountInGroup_5++;
			}
	}

	controlGroupArray.push({amount:amountInGroup_1});
	controlGroupArray.push({amount:amountInGroup_2});
	controlGroupArray.push({amount:amountInGroup_3});
	controlGroupArray.push({amount:amountInGroup_4});
	controlGroupArray.push({amount:amountInGroup_5});

	for (var k = 0; k < CONTROL_GROUP_MAX_LENGTH; k++) {
		var controlGroupTextStartX = CONTROL_GROUP_START_X + ((CONTROL_GROUP_BOX_W + CONTROL_GROUP_BORDER*2 - 2) * k);
		var controlGroupTextStartY = CONTROL_GROUP_START_Y + CONTROL_GROUP_BORDER + (CONTROL_GROUP_BOX_H/2);
		var borderColorToShow;

		if (currentSelectedGroup == k + 1) {
			borderColorToShow = 'yellow';
		} else {
			borderColorToShow = UI_BORDER_COLOR;
		}
		// Border Outline
		colorRect(	CONTROL_GROUP_START_X - UI_BORDER_OUTLINE_SIZE + ((CONTROL_GROUP_BOX_W + CONTROL_GROUP_BORDER +2)* k),
	 				CONTROL_GROUP_START_Y - UI_BORDER_OUTLINE_SIZE,
	 				CONTROL_GROUP_BOX_W + UI_BORDER_OUTLINE_SIZE*2,
	 				CONTROL_GROUP_BOX_H - (CONTROL_GROUP_BORDER + 5), UI_INNER_BG_COLOR);
		// Border
		colorRect(	CONTROL_GROUP_START_X + ((CONTROL_GROUP_BOX_W + CONTROL_GROUP_BORDER + 2)* k),
	 				CONTROL_GROUP_START_Y,
	 				CONTROL_GROUP_BOX_W,
	 				CONTROL_GROUP_BOX_H - (CONTROL_GROUP_BORDER + 2), borderColorToShow);
		// Inner BG
		colorRect(	CONTROL_GROUP_START_X + CONTROL_GROUP_BORDER + ((CONTROL_GROUP_BOX_W + CONTROL_GROUP_BORDER+2) * k),
	 				CONTROL_GROUP_START_Y + CONTROL_GROUP_BORDER,
	 				CONTROL_GROUP_BOX_W - CONTROL_GROUP_BORDER*2,
	 				CONTROL_GROUP_BOX_H - UI_BORDER_GAP - CONTROL_GROUP_BORDER, UI_INNER_BG_COLOR);
		
		// shows text inside of box if a control group has units inside
		if (controlGroupArray[k].amount > 0 && controlGroupArray[k].amount < 10) {
			colorText(	controlGroupArray[k].amount,
			          	controlGroupTextStartX+ 20, // 20 pixels is centered for single digits
			          	controlGroupTextStartY,
			          	'white',
			          	GAME_UI_FONT);
		} else if (controlGroupArray[k].amount > 10) {
			colorText(	controlGroupArray[k].amount, 
			          	controlGroupTextStartX + 16, // 16 pixels is centered for single digits
			          	controlGroupTextStartY,
			          	'white',
			          	GAME_UI_FONT);
		}
	}

}

function miniMapUI() {
	// Border Outline
	colorRect(0,
	          canvas.height-MINIMAP_H - UI_BORDER_OUTLINE_SIZE,
	          MINIMAP_W + UI_BORDER_OUTLINE_SIZE,
	          MINIMAP_H + UI_BORDER_OUTLINE_SIZE,
	          UI_INNER_BG_COLOR);
	// Border
	colorRect(0,
	          canvas.height-MINIMAP_H,
	          MINIMAP_W,
	          MINIMAP_H,
	          UI_BORDER_COLOR);
	// Minimap Outline
	colorRect(0 + UI_BORDER_GAP - UI_BORDER_OUTLINE_SIZE,
	          canvas.height-MINIMAP_H + UI_BORDER_GAP - UI_BORDER_OUTLINE_SIZE,
	          MINIMAP_W - UI_BORDER_GAP*2 + UI_BORDER_OUTLINE_SIZE*2,
	          MINIMAP_H - UI_BORDER_GAP*2 + UI_BORDER_OUTLINE_SIZE*2,
	          UI_INNER_BG_COLOR);
	
	drawMiniMap();

	if (showFogOfWar) {
		drawFogOfWarOnMini();
	}

	drawCameraRectangle();
}

function drawCameraRectangle() {
	var scaledRectMultiplier = 0.10;
	var scaledPanMultiplierX = 0.208;
	var scaledPanMultiplierY = 0.258;

	var topLeftCornerX = MINIMAP_FIXED_CAMERA_OFFSET_X+(MOUSE_LEFT_EDGE_FROM_CENTER_BEFORE_PAN_X * scaledRectMultiplier) + (camPanX * scaledPanMultiplierX);
	var topLeftCornerY = MINIMAP_FIXED_CAMERA_OFFSET_Y+(MOUSE_TOP_EDGE_FROM_CENTER_BEFORE_PAN_Y * scaledRectMultiplier) + (camPanY * scaledPanMultiplierY);
	var bottomRightCornerX = MINIMAP_FIXED_CAMERA_OFFSET_X+(MOUSE_RIGHT_EDGE_FROM_CENTER_BEFORE_PAN_X * scaledRectMultiplier) + (camPanX * scaledPanMultiplierX);
	var bottomRightCornerY = MINIMAP_FIXED_CAMERA_OFFSET_Y+(MOUSE_BOTTOM_EDGE_FROM_CENTER_BEFORE_PAN_Y * scaledRectMultiplier) + (camPanY * scaledPanMultiplierY);

	coloredOutlineRectCornerToCorner (	topLeftCornerX,
										topLeftCornerY,
										bottomRightCornerX,
										bottomRightCornerY,
										'white');
}

// draw a mini world inside of the minimap region, scales with map size
function drawMiniMap() {
	for (var eachRow = 0; eachRow < WORLD_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < WORLD_COLS; eachCol++) {
			var arrayIndex = colRowToArrayIndex(eachCol, eachRow);
			var whatTileNeedsToBeDrawn = worldGrid[arrayIndex];
			var tileX = (eachCol * MINIMAP_TILE_W) + UI_BORDER_GAP;
			var tileY = (MINIMAP_TOP_Y + UI_BORDER_GAP) + (eachRow * MINIMAP_TILE_H);
			var tileWidthRoundedDown = Math.floor(MINIMAP_TILE_W);
			var tileHeightRoundedDown = Math.floor(MINIMAP_TILE_H);
			var colorHere;

			switch(whatTileNeedsToBeDrawn) {
				

				case WORLD_GRASS:
					colorHere = 'green';
					break;

				case WORLD_TREE:
					colorHere = 'brown';
					break;

				case PLAYER_BASE:
					colorHere = 'blue';
					break;

				case PLAYER_CAMP:
					colorHere = 'blue';
					break;

				case PLAYER_BARRACKS:
					colorHere = 'blue';
					break;

				case PLAYER_ARMORY:
					colorHere = 'blue';
					break;

				case ENEMY_BASE:
					colorHere = 'red';
					break;

				case ENEMY_CAMP:
					colorHere = 'red';
					break;

				case ENEMY_BARRACKS:
					colorHere = 'red';
					break;

				case ENEMY_ARMORY:
					colorHere = 'red';
					break;
			}
			colorRect(tileX,tileY, tileWidthRoundedDown,tileHeightRoundedDown, colorHere, 1); 
		}
	}
}

function drawFogOfWarOnMini() {
	for (var eachRow = 0; eachRow < COLLISION_ROWS; eachRow++) {
		for (var eachCol = 0; eachCol < COLLISION_COLS; eachCol++) {
			var arrayIndex = colRowToArrayIndex_Collisions(eachCol, eachRow);
			var whatTileNeedsToBeDrawn = fogOfWarGrid[arrayIndex];
			var tileX = (eachCol * (MINIMAP_TILE_W/2)) + UI_BORDER_GAP;
			var tileY = (MINIMAP_TOP_Y + UI_BORDER_GAP) + (eachRow * (MINIMAP_TILE_H/2));
			var tileWidthRoundedDown = Math.floor(MINIMAP_TILE_W);
			var tileHeightRoundedDown = Math.floor(MINIMAP_TILE_H);

			if (whatTileNeedsToBeDrawn == NOT_DISCOVERED) {
				colorRect(tileX,tileY, tileWidthRoundedDown,tileHeightRoundedDown, 'black', 1);
			}



		}
	}
}

function drawInfoBarBG() {
	// Border Outline
	colorRect(	canvas.width/2 - INFOBAR_W/2,
				canvas.height - INFOBAR_H - UI_BORDER_OUTLINE_SIZE,
				INFOBAR_W,
				INFOBAR_H + UI_BORDER_OUTLINE_SIZE, UI_INNER_BG_COLOR);
	// Border
	colorRect(	canvas.width/2 - INFOBAR_W/2,
				canvas.height - INFOBAR_H,INFOBAR_W,
				INFOBAR_H, UI_BORDER_COLOR);
	// Inner BG
	colorRect(	INFOBAR_TOP_LEFT_X,
				INFOBAR_TOP_LEFT_Y,
				INFOBAR_INNER_W, INFOBAR_INNER_H - UI_BORDER_GAP,
				UI_INNER_BG_COLOR);
}

function infoBarUI() {
	drawInfoBarBG();

	shownArmyText = false;

	for (var i = 0; i < selectedUnits.length; i++) {
		if (selectedUnits.length == 1) {
			// Icon
			canvasContext.drawImage(selectedUnits[i].unitIcon,
									INFOBAR_TOP_LEFT_X ,
									INFOBAR_TOP_LEFT_Y - 5);

			// Health Bar
			colorRect(	INFOBAR_TOP_LEFT_X + 10 - HEALTH_BAR_OUTLINE_OFFSET,
						INFOBAR_TOP_LEFT_Y + 90 - HEALTH_BAR_OUTLINE_OFFSET,
						INFOBAR_SINGLE_UNIT_HEALTH_W + HEALTH_BAR_OUTLINE_MARGIN,
						INFOBAR_SINGLE_UNIT_HEALTH_H + HEALTH_BAR_OUTLINE_MARGIN, 'black'); // outline rect
			
			colorRect(	INFOBAR_TOP_LEFT_X + 10,
						INFOBAR_TOP_LEFT_Y + 90,
						INFOBAR_SINGLE_UNIT_HEALTH_W,
						INFOBAR_SINGLE_UNIT_HEALTH_H, 'black'); // background rect

			colorRect(	INFOBAR_TOP_LEFT_X + 10,
						INFOBAR_TOP_LEFT_Y + 90,
						selectedUnits[i].percentHealthLeft * INFOBAR_SINGLE_UNIT_HEALTH_W,
						INFOBAR_SINGLE_UNIT_HEALTH_H, 'green'); // health rect

			// Health Bar Text
			colorText (	selectedUnits[i].currentHealth + '/' + selectedUnits[i].maxHealth,
						INFOBAR_TOP_LEFT_X + 33,
						INFOBAR_TOP_LEFT_Y + 99,
						'white', GAME_UI_HEALTH_BAR_TEXT);

			// Unit Type
			colorText (	'UnitType:',
						INFOBAR_TOP_LEFT_X + 102,
						INFOBAR_TOP_LEFT_Y + 16,
						'white', GAME_UI_FONT);
			colorText (	selectedUnits[i].unitType,
						INFOBAR_TOP_LEFT_X + 220,
						INFOBAR_TOP_LEFT_Y + 16,
						'white', GAME_UI_FONT);

			// Current Action
			colorText (	'Current Action:',
						INFOBAR_TOP_LEFT_X + 102,
						INFOBAR_TOP_LEFT_Y + 36,
						'white', GAME_UI_FONT);
			colorText (	convertStateToText(selectedUnits[i]),
						INFOBAR_TOP_LEFT_X + 220,
						INFOBAR_TOP_LEFT_Y + 36,
						'white', GAME_UI_FONT);

			// Damage
			colorText (	'Damage:',
						INFOBAR_TOP_LEFT_X + 102,
						INFOBAR_TOP_LEFT_Y + 56,
						'white', GAME_UI_FONT);
			colorText (	selectedUnits[i].currentDamage(),
						INFOBAR_TOP_LEFT_X + 220,
						INFOBAR_TOP_LEFT_Y + 56,
						'white', GAME_UI_FONT);

			// Attack Rate
			colorText (	'AttackRate:',
						INFOBAR_TOP_LEFT_X + 102,
						INFOBAR_TOP_LEFT_Y + 76,
						'white', GAME_UI_FONT);
			// parsefloat will stop repeating numbers from getting out of hand
			// toFixed(n), n = # of decimal places
			colorText (	parseFloat( (FRAMES_PER_SECOND / selectedUnits[i].currentAttackRate()) ).toFixed(2) + "per/sec",
						INFOBAR_TOP_LEFT_X + 220,
						INFOBAR_TOP_LEFT_Y + 76,
						'white', GAME_UI_FONT);

			// Attack Range
			colorText (	'AttackRange:',
						INFOBAR_TOP_LEFT_X + 102,
						INFOBAR_TOP_LEFT_Y + 96,
						'white', GAME_UI_FONT);
			colorText ( selectedUnits[i].attackRange + 'px',
						INFOBAR_TOP_LEFT_X + 220,
						INFOBAR_TOP_LEFT_Y + 96,
						'white', GAME_UI_FONT);

		// if multiple units are selected, show their icons
		} else {
			var iconSize = 33;
			var startHealthX = 	INFOBAR_TOP_LEFT_X + 4;
			var startHealthY = 	INFOBAR_TOP_LEFT_Y + 30;
			var gapBetweenRows = 35;
			var iconGap = 30;
			var healthBarGap = iconGap;

			// shows army count text if there are too many units for the infobar to show
			if (selectedUnits.length > INFOBAR_MAX_SELECTED_UNITS_PER_ROW*3) {
				if (shownArmyText == false) {
					colorText(	'ARMYCOUNT: ' + selectedUnits.length,
								INFOBAR_TOP_LEFT_X + 155,
								INFOBAR_TOP_LEFT_Y + INFOBAR_INNER_H/2,
								'white', GAME_UI_FONT);
					shownArmyText = true;
				}
			
			} else if (i < INFOBAR_MAX_SELECTED_UNITS_PER_ROW) {
				// draw each unit icon
				canvasContext.drawImage(selectedUnits[i].unitIcon,
										INFOBAR_TOP_LEFT_X + (i* iconGap),
										INFOBAR_TOP_LEFT_Y, iconSize, iconSize);

				// draw each health bar
				colorRect(	startHealthX + (i* healthBarGap) - HEALTH_BAR_OUTLINE_OFFSET,
							startHealthY - HEALTH_BAR_OUTLINE_OFFSET,
							INFOBAR_MULTIPLE_UNIT_HEALTH_W + HEALTH_BAR_OUTLINE_MARGIN,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H + HEALTH_BAR_OUTLINE_MARGIN, 'black'); // outline rect
			
				colorRect(	startHealthX + (i* healthBarGap),
							startHealthY,
							INFOBAR_MULTIPLE_UNIT_HEALTH_W,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H, 'black'); // background rect

				colorRect(	startHealthX + (i* healthBarGap),
							startHealthY,
							selectedUnits[i].percentHealthLeft * INFOBAR_MULTIPLE_UNIT_HEALTH_W,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H, 'green'); // health rect

			} else if (i < INFOBAR_MAX_SELECTED_UNITS_PER_ROW*2)  {
				canvasContext.drawImage(selectedUnits[i].unitIcon,
										INFOBAR_TOP_LEFT_X + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW)* iconGap),
										INFOBAR_TOP_LEFT_Y + gapBetweenRows, iconSize, iconSize);

				// draw each health bar
				colorRect(	startHealthX + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW)* healthBarGap) - HEALTH_BAR_OUTLINE_OFFSET,
							startHealthY - HEALTH_BAR_OUTLINE_OFFSET + gapBetweenRows,
							INFOBAR_MULTIPLE_UNIT_HEALTH_W + HEALTH_BAR_OUTLINE_MARGIN,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H + HEALTH_BAR_OUTLINE_MARGIN, 'black'); // outline rect
			
				colorRect(	startHealthX + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW)* healthBarGap),
							startHealthY + gapBetweenRows,
							INFOBAR_MULTIPLE_UNIT_HEALTH_W,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H, 'black'); // background rect

				colorRect(	startHealthX + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW)* healthBarGap),
							startHealthY + gapBetweenRows,
							selectedUnits[i].percentHealthLeft * INFOBAR_MULTIPLE_UNIT_HEALTH_W,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H, 'green'); // health rect

			} else if (i < INFOBAR_MAX_SELECTED_UNITS_PER_ROW*3) {
				canvasContext.drawImage(selectedUnits[i].unitIcon,
										INFOBAR_TOP_LEFT_X + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW*2)* iconGap),
										INFOBAR_TOP_LEFT_Y + gapBetweenRows*2, iconSize, iconSize);

				// draw each health bar
				colorRect(	startHealthX + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW*2)* healthBarGap) - HEALTH_BAR_OUTLINE_OFFSET,
							startHealthY - HEALTH_BAR_OUTLINE_OFFSET + (gapBetweenRows*2),
							INFOBAR_MULTIPLE_UNIT_HEALTH_W + HEALTH_BAR_OUTLINE_MARGIN,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H + HEALTH_BAR_OUTLINE_MARGIN, 'black'); // outline rect
			
				colorRect(	startHealthX + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW*2)* healthBarGap),
							startHealthY + (gapBetweenRows*2),
							INFOBAR_MULTIPLE_UNIT_HEALTH_W,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H, 'black'); // background rect

				colorRect(	startHealthX + ((i - INFOBAR_MAX_SELECTED_UNITS_PER_ROW*2)* healthBarGap),
							startHealthY + (gapBetweenRows*2),
							selectedUnits[i].percentHealthLeft * INFOBAR_MULTIPLE_UNIT_HEALTH_W,
							INFOBAR_MULTIPLE_UNIT_HEALTH_H, 'green'); // health rect
			}
		}
	}

	for (var i = 0; i < selectedBuildings.length; i++) {
		var shownBuildingText = false;

		// show building queue and icons if only one is selected
		if (selectedBuildings.length == 1) {
			var buildingName;
			if (selectedBuildings[i].isBase) {
				buildingName = 'BASE';
			} else if (selectedBuildings[i].isCamp) {
				buildingName = 'CAMP';
			} else if (selectedBuildings[i].isBarracks) {
				buildingName = 'BARRACKS';
			} else if (selectedBuildings[i].isArmory) {
				buildingName = 'ARMORY';
			}
			// Building Text
			colorText(	buildingName,
			          	INFOBAR_TOP_LEFT_X + 210,
			          	INFOBAR_TOP_LEFT_Y + 20,
			          	'white',
			          	GAME_UI_FONT);

			// Icon
			canvasContext.drawImage(selectedBuildings[i].buildingIcon,
									INFOBAR_TOP_LEFT_X + 10,
									INFOBAR_TOP_LEFT_Y + 10);

			// Health Bar
			colorRect(	INFOBAR_TOP_LEFT_X + 10 - HEALTH_BAR_OUTLINE_OFFSET,
						INFOBAR_TOP_LEFT_Y + 90 - HEALTH_BAR_OUTLINE_OFFSET,
						INFOBAR_SINGLE_UNIT_HEALTH_W + HEALTH_BAR_OUTLINE_MARGIN,
						INFOBAR_SINGLE_UNIT_HEALTH_H + HEALTH_BAR_OUTLINE_MARGIN, 'black'); // outline rect
			
			colorRect(	INFOBAR_TOP_LEFT_X + 10,
						INFOBAR_TOP_LEFT_Y + 90,
						INFOBAR_SINGLE_UNIT_HEALTH_W,
						INFOBAR_SINGLE_UNIT_HEALTH_H, 'black'); // background rect

			colorRect(	INFOBAR_TOP_LEFT_X + 10,
						INFOBAR_TOP_LEFT_Y + 90,
						selectedBuildings[i].percentHealthLeft * INFOBAR_SINGLE_UNIT_HEALTH_W,
						INFOBAR_SINGLE_UNIT_HEALTH_H, 'green'); // health rect

			// Health Bar Text
			colorText (	selectedBuildings[i].currentHealth + '/' + selectedBuildings[i].maxHealth,
						INFOBAR_TOP_LEFT_X + 27,
						INFOBAR_TOP_LEFT_Y + 99,
						'white', GAME_UI_HEALTH_BAR_TEXT);

			// Build Queue
			if (selectedBuildings[i].buildQueue.length > 0) {
				for (var j = 0; j < selectedBuildings[i].buildQueue.length; j++) {
					var iconGap = 60;
					var iconX = INFOBAR_TOP_LEFT_X + 100;
					var iconY = INFOBAR_TOP_LEFT_Y + 20;
					var queueY = INFOBAR_TOP_LEFT_Y + 70;
					var percentForUnitTimer;

					// if this is the current build queue, show current percent done
					if (j == 0) {
						percentForUnitTimer = selectedBuildings[i].percentDoneWithUnitTimer * INFOBAR_SINGLE_BUILDING_QUEUE_W
					} else {
						percentForUnitTimer = 1 * INFOBAR_SINGLE_BUILDING_QUEUE_W;
					}

					if (selectedBuildings[i].isArmory == false) {
						// draw unit Image
						canvasContext.drawImage(selectedBuildings[i].iconToShowLarger[j],
												iconX + (iconGap * j),
												iconY, 50, 50);
					}

					// draw buildQueue bar
					colorRect(	iconX  + (iconGap * j),
								queueY,
								INFOBAR_SINGLE_BUILDING_QUEUE_W,
								INFOBAR_SINGLE_BUILDING_QUEUE_H, 'black');

					colorRect(	iconX  + (iconGap * j),
								queueY,
								percentForUnitTimer,
								INFOBAR_SINGLE_BUILDING_QUEUE_H, 'blue');
				}
			}
		
		// if multiple buildings are selected, show icons
		} else {
			if (shownBuildingText == false) {
					colorText(	'BUILDING COUNT: ' + selectedBuildings.length,
								INFOBAR_TOP_LEFT_X + 155,
								INFOBAR_TOP_LEFT_Y + INFOBAR_INNER_H/2,
								'white', GAME_UI_FONT);
					shownBuildingText = true;
				}

		}
	}
}

function turnAllCommandBarTextOff() {
	textNeededForQ = false;
	textNeededForW = false;
	textNeededForE = false;
	textNeededForA = false;
	textNeededForS = false;
	textNeededForD = false;
	textNeededForZ = false;
	textNeededForX = false;
	textNeededForC = false;

	textForQ;
	textForW;
	textForE;
	textForA;
	textForS;
	textForD;
	textForZ;
	textForX;
	textForC;

	offsetForQ = 0;
	offsetForW = 0;
	offsetForE = 0;
	offsetForA = 0;
	offsetForS = 0;
	offsetForD = 0;
	offsetForZ = 0;
	offsetForX = 0;
	offsetForC = 0;

	priceTextForQ = null;
	priceTextForW = null;
	priceTextForE = null;
	priceTextForA = null;
	priceTextOffsetQ = 0;
	priceTextOffsetW = 0;
	priceTextOffsetE = 0;
	priceTextOffsetA = 0;
}

function convertStateToText(whichUnit) {

	if (whichUnit.currentState == PLAYER_STATE_NOT_BUSY) {
		return 'Not Busy';
	} else if (whichUnit.currentState == PLAYER_STATE_CHOPPING_WOOD) {
		return 'Chopping Wood';
	} else if (whichUnit.currentState == PLAYER_STATE_CARRYING_WOOD_TO_BASE) {
		return 'Carrying Wood To Base';
	} else if (whichUnit.currentState == PLAYER_STATE_WALKING_TO_TREE) {
		return 'Walking To Tree';
	} else if (whichUnit.currentState == PLAYER_STATE_WALKING_TO_BASE) {
		return 'Walking To Base';
	} else if (whichUnit.currentState == PLAYER_STATE_WALKING_TO_BUILD) {
		return 'Walking To Build';
	} else if (whichUnit.currentState == PLAYER_STATE_BUILDING) {
		var buildingToText;
		if (whichUnit.whatToBuild == BASE) {
			buildingToText = 'A Base';
		} else if (whichUnit.whatToBuild == CAMP) {
			buildingToText = 'A Camp';
		} else if (whichUnit.whatToBuild == BARRACKS) {
			buildingToText = 'A Barracks';
		} else if (whichUnit.whatToBuild == ARMORY) {
			buildingToText = 'A Armory';
		}

		return 'Building ' + buildingToText;

	} else if (whichUnit.currentState == PLAYER_STATE_ATTACKING_ENEMY_UNIT) {
		return 'Attacking Enemy Unit';
	} else if (whichUnit.currentState == PLAYER_STATE_ATTACKING_ENEMY_BUILDING) {
		return 'Attacking Enemy Building';
	} else if (whichUnit.currentState == PLAYER_STATE_ATTACK_MOVE) {
		return 'Looking For A Fight';
	} else {
		console.log('cannot find currentState text, add to convertStateToText');
	}
}
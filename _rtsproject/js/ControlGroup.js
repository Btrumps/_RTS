// WE SPLIT THIS CODE FROM KEYBOARDINPUT.JS

const KEY_1 = 49;
const KEY_2 = 50;
const KEY_3 = 51;
const KEY_4 = 52;
const KEY_5 = 53;
var keyPressed_1 = false;
var keyPressed_2 = false;
var keyPressed_3 = false;
var keyPressed_4 = false;
var keyPressed_5 = false;
var numberHasBeenPressed = false;

var currentSelectedGroup;

// if we have units/buildings selected and hit CTRL, add to control group
function setControlGroup() {
	
	if (selectedUnits.length > 0 && keyHeld_Ctrl && 
		keyHeld_Shift == false && numberHasBeenPressed) {
		
		// clear ALL units from the control group
		for (var i = 0; i < playerUnits.length; i++) {
			if (keyPressed_1) {
				playerUnits[i].controlGroup_1 = false;
			}
			if (keyPressed_2) {
				playerUnits[i].controlGroup_2 = false;
			}
			if (keyPressed_3) {
				playerUnits[i].controlGroup_3 = false;
			}
			if (keyPressed_4) {
				playerUnits[i].controlGroup_4 = false;
			}
			if (keyPressed_5) {
				playerUnits[i].controlGroup_5 = false;
			}
		}

		// clear ALL buildings from the control group
		for (var i = 0; i < playerBuildings.length; i++) {
			if (keyPressed_1) {
				playerBuildings[i].controlGroup_1 = false;
			}
			if (keyPressed_2) {
				playerBuildings[i].controlGroup_2 = false;
			}
			if (keyPressed_3) {
				playerBuildings[i].controlGroup_3 = false;
			}
			if (keyPressed_4) {
				playerBuildings[i].controlGroup_4 = false;
			}
			if (keyPressed_5) {
				playerBuildings[i].controlGroup_5 = false;
			}
		}
		// set the selected units to the control group
		for (var i = 0; i < selectedUnits.length; i++) {
			if (keyPressed_1) {
				selectedUnits[i].controlGroup_1 = true;
			}
			if (keyPressed_2) {
				selectedUnits[i].controlGroup_2 = true;
			}
			if (keyPressed_3) {
				selectedUnits[i].controlGroup_3 = true;
			}
			if (keyPressed_4) {
				selectedUnits[i].controlGroup_4 = true;
			}
			if (keyPressed_5) {
				selectedUnits[i].controlGroup_5 = true;
			}
		}
	}

	
	if (selectedBuildings.length > 0 && keyHeld_Ctrl && 
		keyHeld_Shift == false && numberHasBeenPressed) {

		for (var i = 0; i < playerUnits.length; i++) {
			if (keyPressed_1) {
				playerUnits[i].controlGroup_1 = false;
			}
			if (keyPressed_2) {
				playerUnits[i].controlGroup_2 = false;
			}
			if (keyPressed_3) {
				playerUnits[i].controlGroup_3 = false;
			}
			if (keyPressed_4) {
				playerUnits[i].controlGroup_4 = false;
			}
			if (keyPressed_5) {
				playerUnits[i].controlGroup_5 = false;
			}
		}
		for (var i = 0; i < playerBuildings.length; i++) {
			if (keyPressed_1) {
				playerBuildings[i].controlGroup_1 = false;
			}
			if (keyPressed_2) {
				playerBuildings[i].controlGroup_2 = false;
			}
			if (keyPressed_3) {
				playerBuildings[i].controlGroup_3 = false;
			}
			if (keyPressed_4) {
				playerBuildings[i].controlGroup_4 = false;
			}
			if (keyPressed_5) {
				playerBuildings[i].controlGroup_5 = false;
			}
		}

		// set the selected buildings to the control group
		for (var i = 0; i < selectedBuildings.length; i++) {
			if (keyPressed_1) {
				selectedBuildings[i].controlGroup_1 = true;
			}
			if (keyPressed_2) {
				selectedBuildings[i].controlGroup_2 = true;
			}
			if (keyPressed_3) {
				selectedBuildings[i].controlGroup_3 = true;
			}
			if (keyPressed_4) {
				selectedBuildings[i].controlGroup_4 = true;
			}
			if (keyPressed_5) {
				selectedBuildings[i].controlGroup_5 = true;
			}
		}
	}

}

// if we have units/buildings selected and hit SHIFT, add to control group
/* // this is turned off for now, as adding buildings and workers to same hotkey breaks things
function addToControlGroup() {
	if (selectedUnits.length > 0 && keyHeld_Shift &&
		keyHeld_Ctrl == false && numberHasBeenPressed) {
		for (var i = 0; i < selectedUnits.length; i++) {
			if (keyPressed_1) {
				selectedUnits[i].controlGroup_1 = true;
			}
			if (keyPressed_2) {
				selectedUnits[i].controlGroup_2 = true;
			}
			if (keyPressed_3) {
				selectedUnits[i].controlGroup_3 = true;
			}
			if (keyPressed_4) {
				selectedUnits[i].controlGroup_4 = true;
			}
			if (keyPressed_5) {
				selectedUnits[i].controlGroup_5 = true;
			}
		}
	}

	if (selectedBuildings.length > 0 && keyHeld_Shift &&
		keyHeld_Ctrl == false && numberHasBeenPressed) {
		for (var i = 0; i < selectedBuildings.length; i++) {
			if (keyPressed_1) {
				selectedBuildings[i].controlGroup_1 = true;
			}
			if (keyPressed_2) {
				selectedBuildings[i].controlGroup_2 = true;
			}
			if (keyPressed_3) {
				selectedBuildings[i].controlGroup_3 = true;
			}
			if (keyPressed_4) {
				selectedBuildings[i].controlGroup_4 = true;
			}
			if (keyPressed_5) {
				selectedBuildings[i].controlGroup_5 = true;
			}
		}
	}

}
*/
function useControlGroup() {
	if (numberHasBeenPressed && keyHeld_Shift == false
		&& keyHeld_Ctrl == false) {

		selectedUnits = [];
		selectedBuildings = [];

		if (keyPressed_1) {
			for (var i = 0; i < playerUnits.length; i++) {
				if (playerUnits[i].controlGroup_1) {
					selectedUnits.push(playerUnits[i]);
				}
			}

			for (var i = 0; i < playerBuildings.length; i++) {
				if (playerBuildings[i].controlGroup_1) {
					selectedBuildings.push(playerBuildings[i]);
				}
			}

			currentSelectedGroup = 1;

		} else if (keyPressed_2) {
			for (var i = 0; i < playerUnits.length; i++) {
				if (playerUnits[i].controlGroup_2) {
					selectedUnits.push(playerUnits[i]);
				}
			}

			for (var i = 0; i < playerBuildings.length; i++) {
				if (playerBuildings[i].controlGroup_2) {
					selectedBuildings.push(playerBuildings[i]);
				}
			}

			currentSelectedGroup = 2;

		} else if (keyPressed_3) {
			for (var i = 0; i < playerUnits.length; i++) {
				if (playerUnits[i].controlGroup_3) {
					selectedUnits.push(playerUnits[i]);
				}
			}

			for (var i = 0; i < playerBuildings.length; i++) {
				if (playerBuildings[i].controlGroup_3) {
					selectedBuildings.push(playerBuildings[i]);
				}
			}
			currentSelectedGroup = 3;

		} else if (keyPressed_4) {
			for (var i = 0; i < playerUnits.length; i++) {
				if (playerUnits[i].controlGroup_4) {
					selectedUnits.push(playerUnits[i]);
				}
			}

			for (var i = 0; i < playerBuildings.length; i++) {
				if (playerBuildings[i].controlGroup_4) {
					selectedBuildings.push(playerBuildings[i]);
				}
			}

			currentSelectedGroup = 4;

		} else if (keyPressed_5) {
			for (var i = 0; i < playerUnits.length; i++) {
				if (playerUnits[i].controlGroup_5) {
					selectedUnits.push(playerUnits[i]);
				}
			}

			for (var i = 0; i < playerBuildings.length; i++) {
				if (playerBuildings[i].controlGroup_5) {
					selectedBuildings.push(playerBuildings[i]);
				}
			}

			currentSelectedGroup = 5;
		}
	}
}
const CAM_SPEED = 15;
const CAMERA_BORDER_BEFORE_PAN = 50;
const MOUSE_LEFT_EDGE_FROM_CENTER_BEFORE_PAN_X = CAMERA_BORDER_BEFORE_PAN;
const MOUSE_RIGHT_EDGE_FROM_CENTER_BEFORE_PAN_X = CANVAS_WIDTH - CAMERA_BORDER_BEFORE_PAN;
const MOUSE_BOTTOM_EDGE_FROM_CENTER_BEFORE_PAN_Y = CAMERA_BORDER_BEFORE_PAN;
const MOUSE_TOP_EDGE_FROM_CENTER_BEFORE_PAN_Y = CANVAS_HEIGHT - CAMERA_BORDER_BEFORE_PAN;
const CAMERA_WIDTH = MOUSE_RIGHT_EDGE_FROM_CENTER_BEFORE_PAN_X - MOUSE_LEFT_EDGE_FROM_CENTER_BEFORE_PAN_X;
const CAMERA_HEIGHT = MOUSE_TOP_EDGE_FROM_CENTER_BEFORE_PAN_Y - MOUSE_BOTTOM_EDGE_FROM_CENTER_BEFORE_PAN_Y;

var camPanX = 0.0;
var camPanY = 0.0;
var cameraLock = false;


function instantCamFollow() {
	camPanX = mouseX;
	camPanY = mouseY;
}

function cameraFollow() {

	var cameraFocusCenterX = camPanX + canvas.width/2;
	var cameraFocusCenterY = camPanY + canvas.height/2;

	//var mouseDistFromCameraFocusX = mouseX - cameraFocusCenterX;
	//var mouseDistFromCameraFocusY = mouseY - cameraFocusCenterY;

	
	if (mouseScreenX > MOUSE_RIGHT_EDGE_FROM_CENTER_BEFORE_PAN_X) {
		camPanX += CAM_SPEED;
	}
	if (mouseScreenX < MOUSE_LEFT_EDGE_FROM_CENTER_BEFORE_PAN_X) {
		camPanX -= CAM_SPEED;
	}
	if (mouseScreenY > MOUSE_BOTTOM_EDGE_FROM_CENTER_BEFORE_PAN_Y) {
		camPanY += CAM_SPEED;
	}
	if (mouseScreenY < MOUSE_TOP_EDGE_FROM_CENTER_BEFORE_PAN_Y) {
		camPanY -= CAM_SPEED;
	}
	
	// blocks cam from showing out of bounds
	if (camPanX < 0) {
		camPanX = 0;
	}
	if (camPanY < 0) {
		camPanY = 0;
	}

	var maxPanRight = WORLD_COLS * WORLD_W - CANVAS_WIDTH;
	var maxPanTop = WORLD_ROWS * WORLD_H - CANVAS_HEIGHT;

	if (camPanX > maxPanRight) {
		camPanX = maxPanRight;
	}
	if (camPanY > maxPanTop) {
		camPanY = maxPanTop;
	}
}
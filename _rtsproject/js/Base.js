const BASE_BUY_COST = 350;
const BASE_MAX_HP = 750;
const BASE_BUILD_TIME_MAX = 750;

const WORKER_BUY_COST = 50;
const WORKER_BUILD_TIME = 360; // 12 sec orig

const BASE_DEFAULT_RALLY_OFFSET = 25;

function baseClass(x, y, whichWorker) {
	buildingClass.call(this, BASE);
	
	this.workerMakingThisBuilding = whichWorker;
	this.canHaveRallyPoint = true;
	this.buildTimeMax = BASE_BUILD_TIME_MAX;
	this.maxHealth = BASE_MAX_HP;

	this.x = x + WORLD_W / 2; // centered X
	this.y = y + WORLD_H / 2; // centered Y

	this.rallyPointX = this.x - BASE_DEFAULT_RALLY_OFFSET;
	this.rallyPointY = this.y - BASE_DEFAULT_RALLY_OFFSET;

}

baseClass.prototype = Object.create(buildingClass.prototype);
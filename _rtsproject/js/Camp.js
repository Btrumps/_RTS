const CAMP_BUY_COST = 100;
const CAMP_MAX_HP = 500;
const CAMP_BUILD_TIME_MAX = 400;

const SUPPLY_INCREASE_AMOUNT = 5;

function campClass(x, y, whichWorker) {
	buildingClass.call(this, CAMP);

	this.workerMakingThisBuilding = whichWorker;
	this.canHaveRallyPoint = false;
	this.buildTimeMax = CAMP_BUILD_TIME_MAX;
	this.maxHealth = CAMP_MAX_HP;

	this.x = x + WORLD_W / 2; // gives a centered x value
	this.y = y + WORLD_H / 2; // gives a centered y value
	
}

campClass.prototype = Object.create(buildingClass.prototype);
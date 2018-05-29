const BARRACKS_BUY_COST = 150;
const BARRACKS_MAX_HP = 500;
const BARRACKS_BUILD_TIME_MAX = 600;

const SPEARMAN_BUY_COST = 100;
const ARCHER_BUY_COST = 150;
const SPEARMAN_BUILD_TIME = 510; // 17 sec orig
const ARCHER_BUILD_TIME = 510; // 17 sec orig

const BARRACKS_DEFAULT_RALLY_OFFSET = 25;

function barracksClass(x, y, whichWorker) {
	buildingClass.call(this, BARRACKS);
	
	this.workerMakingThisBuilding = whichWorker;
	this.canHaveRallyPoint = true;
	this.buildTimeMax = BARRACKS_BUILD_TIME_MAX;
	this.maxHealth = BARRACKS_MAX_HP;

	this.x = x + WORLD_W / 2;
	this.y = y + WORLD_H / 2;

	this.rallyPointX = this.x + BARRACKS_DEFAULT_RALLY_OFFSET;
	this.rallyPointY = this.y + BARRACKS_DEFAULT_RALLY_OFFSET;

}

barracksClass.prototype = Object.create(buildingClass.prototype);
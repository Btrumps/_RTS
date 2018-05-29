const ARMORY_BUY_COST = 200;
const ARMORY_MAX_HP = 500;
const ARMORY_BUILD_TIME_MAX = 500;
const ARMORY_UPGRADE_BUILD_TIME = 650;

const DAMAGE = 1;
const ATTACK_RATE = 2;

const DAMAGE_UPGRADE_AMOUNT = 15;
const DAMAGE_UPGRADE_COST = 200;
const ATTACK_RATE_UPGRADE_AMOUNT = 5;
const ATTACK_RATE_UPGRADE_COST = 200;

var maxDamageUpgradeCount = 3;
var maxAttackRateUpgradeCount = 3;

var damageBoost = 0;
var damageUpgradeCost = DAMAGE_UPGRADE_COST;

var attackRateBoost = 0;
var attackRateUpgradeCost = ATTACK_RATE_UPGRADE_COST;

function armoryClass(x, y, whichWorker) {
	buildingClass.call(this, ARMORY);

	this.workerMakingThisBuilding = whichWorker;
	this.canHaveRallyPoint = false;
	this.buildTimeMax = ARMORY_BUILD_TIME_MAX;

	this.maxHealth = ARMORY_MAX_HP;

	this.x = x + WORLD_W / 2; // gives a centered x value
	this.y = y + WORLD_H / 2; // gives a centered y value

}

armoryClass.prototype = Object.create(buildingClass.prototype);


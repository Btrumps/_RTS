const ARCHER_BASE_SPEED = 4;
const ARCHER_MAX_HEALTH = 75;
const ARCHER_ATTACK_RANGE = 150;
const ARCHER_ATTACK_RATE = 30;
const ARCHER_ATTACK_DAMAGE = 35;

function archerClass(isPlayer, fromX,fromY, rallyX, rallyY) {
	unitClass.call(this);

	this.isPlayer = isPlayer;
	this.isArcher = true;
	this.maxHealth = ARCHER_MAX_HEALTH;
	this.unitIcon = archerIcon_Larger;
	this.currentState;

	this.unitClassReset = this.reset;
	this.reset = function() {
		this.unitClassReset();
		this.unitType = 'Archer';
		if (isPlayer) {
			this.idleAnim = playerArcherIdleAnim;
			this.idleLeftAnim = playerArcherIdleLeftAnim;
			this.walkLeftAnim = playerArcherWalkLeftAnim;
			this.walkRightAnim = playerArcherWalkRightAnim;
		} else {
			this.idleAnim = enemyArcherIdleAnim;
			this.idleLeftAnim = enemyArcherIdleLeftAnim;
			this.walkLeftAnim = enemyArcherWalkLeftAnim;
			this.walkRightAnim = enemyArcherWalkRightAnim;
		}

		this.attackRange = ARCHER_ATTACK_RANGE;
		this.damage = ARCHER_ATTACK_DAMAGE;
		this.attackRate = ARCHER_ATTACK_RATE;

		this.x = fromX;
		this.y = fromY;
		this.goToNear(rallyX, rallyY);
	}


	this.unitClassMove = this.move;
	this.move = function() {
		this.unitClassMove(ARCHER_BASE_SPEED);
	}

	this.superclassDraw = this.draw;
	this.draw = function() {
		this.superclassDraw();
	}
}

archerClass.prototype = Object.create(unitClass.prototype);
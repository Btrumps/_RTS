
const SPEARMAN_BASE_SPEED = 4;
const SPEARMAN_MAX_HEALTH = 140;
const SPEARMAN_ATTACK_RANGE = 50;
const SPEARMAN_ATTACK_RATE = 30;
const SPEARMAN_ATTACK_DAMAGE = 20;

function spearmanClass(isPlayer, fromX,fromY, rallyX, rallyY) {
	unitClass.call(this);

	this.isPlayer = isPlayer;
	this.isSpearman = true;
	this.maxHealth = SPEARMAN_MAX_HEALTH;
	this.unitIcon = spearmanIcon_Larger;
	this.currentState;

	this.unitClassReset = this.reset;
	this.reset = function() {
		this.unitClassReset();
		this.unitType = 'Spearman';
		if (isPlayer) {
			this.idleAnim = playerSpearmanIdleAnim;
			this.idleLeftAnim = playerSpearmanIdleLeftAnim;
			this.walkLeftAnim = playerSpearmanWalkLeftAnim;
			this.walkRightAnim = playerSpearmanWalkRightAnim;
		} else {
			this.idleAnim = enemySpearmanIdleAnim;
			this.idleLeftAnim = enemySpearmanIdleLeftAnim;
			this.walkLeftAnim = enemySpearmanWalkLeftAnim;
			this.walkRightAnim = enemySpearmanWalkRightAnim;
		}

		this.attackRange = SPEARMAN_ATTACK_RANGE;
		this.damage = SPEARMAN_ATTACK_DAMAGE;
		this.attackRate = SPEARMAN_ATTACK_RATE;

		this.x = fromX;
		this.y = fromY;
		this.goToNear(rallyX, rallyY);		
	}


	this.unitClassMove = this.move;
	this.move = function() {
		this.unitClassMove(SPEARMAN_BASE_SPEED);
	}

	this.superclassDraw = this.draw;
	this.draw = function() {
		this.superclassDraw();
	}
}

spearmanClass.prototype = Object.create(unitClass.prototype);
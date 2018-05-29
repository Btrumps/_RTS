const HEALTH_BAR_W_UNIT = 50;
const HEALTH_BAR_H_UNIT = 10;
const HEALTH_BAR_W_BUILDING = 75;
const HEALTH_BAR_H_BUILDING = 10;

const HEALTH_BAR_OUTLINE_OFFSET = 1;
const HEALTH_BAR_OUTLINE_MARGIN = 2;

function healthClass() {
	
	this.currentHealth;
	this.maxHealth;
	this.percentHealthLeft;

	this.healthBarX;
	this.healthBarY;

	this.healthBarW;
	this.healthBarH;

	this.drawHealthBar = function() {
		this.percentHealthLeft = this.currentHealth / this.maxHealth;

			colorRect(	this.healthBarX - HEALTH_BAR_OUTLINE_OFFSET,
						this.healthBarY - HEALTH_BAR_OUTLINE_OFFSET,
						this.healthBarW + HEALTH_BAR_OUTLINE_MARGIN,
						this.healthBarH + HEALTH_BAR_OUTLINE_MARGIN, 'black'); // outline rect
			
			colorRect(	this.healthBarX,
						this.healthBarY,
						this.healthBarW,
						this.healthBarH, 'black'); // background rect

			colorRect(	this.healthBarX,
						this.healthBarY,
						this.percentHealthLeft * this.healthBarW,
						this.healthBarH, 'green'); // health rect
	}
}
function sprite(options) {
    var that = {};
    var frameIndex = 0; // current frame to be displayed
    var tickCount = 0; // the number of updates since the current frame was first displayed
    var ticksPerFrame = options.ticksPerFrame || 0; // the number of updates until the next frame should be displayed
    var numberOfFrames = options.numberOfFrames || 1;

    that.context = options.context;
    that.image = options.image;
    that.loop = options.loop;
    that.width = options.width;
    that.height = options.height;

    that.update = function() {
        tickCount++;
        if (tickCount > ticksPerFrame) {
            tickCount = 0;

            // if the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
                frameIndex++; // go to the next frame
            } else if (that.loop) {
                frameIndex = 0;
            }
        }
    }
	
	that.reset = function() {
		tickCount = 0;
		frameIndex = 0;
	}

    that.render = function(x, y) {
        // clear the canvas
        // context.clearRect(0,0, that.width, that.height);

        that.context.drawImage(that.image, // source image
                               frameIndex * that.width / numberOfFrames, // source x
                               0, // source y
                               that.width / numberOfFrames, //source width
                               that.height, // source height
                               x, // destination x
                               y, // destination y
                               that.width / numberOfFrames, // destination width
                               that.height); // destination height
    }

    return that;
}

function updateAnimations() {
  playerWorkerIdleAnim.update();
  playerWorkerIdleLeftAnim.update();
  playerWorkerWalkLeftAnim.update();
  playerWorkerWalkRightAnim.update();
  playerWorkerChopLeftAnim.update();
  playerWorkerChopRightAnim.update();
  playerSpearmanIdleAnim.update();
  playerSpearmanIdleLeftAnim.update();
  playerSpearmanWalkLeftAnim.update();
  playerSpearmanWalkRightAnim.update();
  playerArcherIdleAnim.update();
  playerArcherIdleLeftAnim.update();
  playerArcherWalkLeftAnim.update();
  playerArcherWalkRightAnim.update();
  enemyWorkerIdleAnim.update();
  enemyWorkerIdleLeftAnim.update();
  enemyWorkerWalkLeftAnim.update();
  enemyWorkerWalkRightAnim.update();
  enemyWorkerChopLeftAnim.update();
  enemyWorkerChopRightAnim.update();
  enemySpearmanIdleAnim.update();
  enemySpearmanIdleLeftAnim.update();
  enemySpearmanWalkLeftAnim.update();
  enemySpearmanWalkRightAnim.update();
  enemyArcherIdleAnim.update();
  enemyArcherIdleLeftAnim.update();
  enemyArcherWalkLeftAnim.update();
  enemyArcherWalkRightAnim.update();

}

function setupSpriteSheets() {
    playerWorkerIdleAnim = sprite({         //WORKER
      context: canvasContext,
      width: 240,
      height: 40,
      image: playerWorkerIdle,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    playerWorkerIdleLeftAnim = sprite({         
      context: canvasContext,
      width: 240,
      height: 40,
      image: playerWorkerIdleLeft,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    playerWorkerWalkLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerWorkerWalkLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    playerWorkerWalkRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerWorkerWalkRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    playerWorkerChopLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerWorkerChopLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 6,
    });

    playerWorkerChopRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerWorkerChopRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 6,
    });

    playerSpearmanIdleAnim = sprite({         //SPEARMAN
      context: canvasContext,
      width: 240,
      height: 40,
      image: playerSpearmanIdle,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    playerSpearmanIdleLeftAnim = sprite({         
      context: canvasContext,
      width: 240,
      height: 40,
      image: playerSpearmanIdleLeft,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    playerSpearmanWalkLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerSpearmanWalkLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    playerSpearmanWalkRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerSpearmanWalkRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    playerArcherIdleAnim = sprite({         // ARCHER
      context: canvasContext,
      width: 240,
      height: 40,
      image: playerArcherIdle,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    playerArcherIdleLeftAnim = sprite({         
      context: canvasContext,
      width: 240,
      height: 40,
      image: playerArcherIdleLeft,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    playerArcherWalkLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerArcherWalkLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    playerArcherWalkRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: playerArcherWalkRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    // -------------- ENEMY ------------------

    enemyWorkerIdleAnim = sprite({
      context: canvasContext,
      width: 240,
      height: 40,
      image: enemyWorkerIdle,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 10,
    });

    enemyWorkerIdleLeftAnim = sprite({
      context: canvasContext,
      width: 240,
      height: 40,
      image: enemyWorkerIdleLeft,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 10,
    });

    enemyWorkerWalkLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemyWorkerWalkLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    enemyWorkerWalkRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemyWorkerWalkRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    enemyWorkerChopLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemyWorkerChopLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 6,
    });

    enemyWorkerChopRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemyWorkerChopRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 6,
    });

    enemySpearmanIdleAnim = sprite({         //SPEARMAN
      context: canvasContext,
      width: 240,
      height: 40,
      image: enemySpearmanIdle,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    enemySpearmanIdleLeftAnim = sprite({         //SPEARMAN
      context: canvasContext,
      width: 240,
      height: 40,
      image: enemySpearmanIdleLeft,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    enemySpearmanWalkLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemySpearmanWalkLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    enemySpearmanWalkRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemySpearmanWalkRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    enemyArcherIdleAnim = sprite({         // ARCHER
      context: canvasContext,
      width: 240,
      height: 40,
      image: enemyArcherIdle,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    enemyArcherIdleLeftAnim = sprite({        
      context: canvasContext,
      width: 240,
      height: 40,
      image: enemyArcherIdleLeft,
      loop: true,
      numberOfFrames: 6,
      ticksPerFrame: 8,
    });

    enemyArcherWalkLeftAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemyArcherWalkLeft,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });

    enemyArcherWalkRightAnim = sprite({
      context: canvasContext,
      width: 160,
      height: 40,
      image: enemyArcherWalkRight,
      loop: true,
      numberOfFrames: 4,
      ticksPerFrame: 2,
    });
}
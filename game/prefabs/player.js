var Drop = require('./drop')

MonsterParticle = function (game, x, y) {
  Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));
};

MonsterParticle.prototype = Object.create(Phaser.Particle.prototype);
MonsterParticle.prototype.constructor = MonsterParticle;

'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'playerMovements', 0);
  this.game = game;
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.anchor.setTo(0.5, 0.5);

  this.makeEmitter()

  this.animations.add('idle', [0], 1, false);
  this.animations.add('walk', [8,9,10,11,12,13,14], 10, true);
  this.animations.add('strafe', [0,1,2,3,4,5,6,7], 10, true);

  this.dropKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  this.dropKey2 = game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.dropKey3 = game.input.keyboard.addKey(Phaser.Keyboard.T);

  this.game.input.onDown.add(this.markLocation, this);
  this.game.input.onDown.add(this.emitParticles, this);

  this.dropKey.onDown.add(this.dropCircle, this);
  this.dropKey2.onDown.add(this.dropBelt, this);
  this.dropKey3.onDown.add(this.dropTimeBomb, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if (this.game.input.activePointer.isUp) {
    this.stopParticles()
  }
  if (this.markedLocationY && this.markedLocationX) {
    if (this.game.physics.arcade.distanceToXY(this, this.markedLocationX, this.markedLocationY) > 8) {
      if (this.game.input.activePointer.isDown) {
        // this.body.acceleration.x = 200;
      }
      this.game.physics.arcade.moveToXY(this, this.markedLocationX, this.markedLocationY, 100);
    } else {
      this.body.velocity.setTo(0);
      this.idle();
      this.markedLocationY = null;
      this.markedLocationX = null;
    }
  }
};

Player.prototype.emitParticles = function(pointer) {
  this.emitter.x = pointer.x;
  this.emitter.y = pointer.y;

  this.emitter.start(false, 400, 100);
}

Player.prototype.makeEmitter = function() {
  var game = this.game;
  // Create our bitmapData which we'll use as our particle texture
  var bmd = game.add.bitmapData(64, 64);
  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  radgrad.addColorStop(0, 'rgba(1, 159, 98, 1)');
  radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');
  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleShade', bmd);
  //  Create our emitter
  var emitter = game.add.emitter(0, 0)

  //  Here is the important line. This will tell the Emitter to emit our custom MonsterParticle class instead of a normal Particle object.
  emitter.particleClass = MonsterParticle;
  emitter.makeParticles();
  // emitter.minParticleSpeed.set(0, 300);
  // emitter.maxParticleSpeed.set(0, 400);
  emitter.setRotation(0, 0);
  emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
  // emitter.gravity = -200;

  this.emitter = emitter;
}

Player.prototype.stopParticles = function() {
  this.emitter.on = false;
  // this.emitter.kill();
}


Player.prototype.updateBitmapDataTexture = function() {
  game = this.game;
  // Get the bitmapData from the cache. This returns a reference to the original object
  var bmd = game.cache.getBitmapData('particleShade');

  bmd.context.clearRect(0, 0, 64, 64);

  //  createRadialGradient parameters: x, y, innerRadius, x, y, outerRadius
  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  var c = Phaser.Color.getRGB(Phaser.Color.getRandomColor(0, 255, 255));

  radgrad.addColorStop(0, Phaser.Color.getWebRGB(c));
  c.a = 0;
  radgrad.addColorStop(1, Phaser.Color.getWebRGB(c));

  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);

  //  All particles using this texture will update at the next render
  bmd.dirty = true;
}

Player.prototype.markLocation = function(pointer) {
  this.markedLocationX = pointer.x;
  this.markedLocationY = pointer.y;
  this.rotation = this.game.physics.arcade.angleToPointer(this, pointer) + 1.57079633;
  this.move();
}

Player.prototype.dropBelt = function() {
  new Drop(this.game, this, this.x - 25, this.y);
}

Player.prototype.dropTimeBomb = function() {
  var shape = this.game.add.graphics(0, 0)
  shape.lineStyle(2, 0x0000FF, 1);
  shape.beginFill(0xFFFF0B, 1)
  shape.drawCircle(this.x, this.y, 100)
  this.game.time.events.add(2000, shape.destroy, shape);
  this.game.time.events.add(4000, this.renderTimeBomb, this);

  this.bringToTop()
}

Player.prototype.renderTimeBomb = function() {
  var shape = this.game.add.graphics(0, 0)
  shape.lineStyle(2, 0x0000FF, 1);
  shape.beginFill(0xFFFF0B, 1)
  shape.drawCircle(this.x, this.y, 200);
  this.game.time.events.add(6000, shape.destroy, shape);

  this.bringToTop()
}

Player.prototype.dropCircle = function() {
  var shape = this.game.add.graphics(0, 0)
  shape.lineStyle(2, 0x0000FF, 1);
  shape.beginFill(0xFFFF0B, 1)
  shape.drawCircle(this.x, this.y, 100)
  this.game.time.events.add(2000, shape.destroy, shape);

  this.bringToTop()
}

Player.prototype.move = function() {
  this.animations.play('walk');
}

Player.prototype.strafe = function() {
  this.animations.play('strafe');
}

Player.prototype.idle = function() {
  this.animations.play("idle");
}

module.exports = Player;

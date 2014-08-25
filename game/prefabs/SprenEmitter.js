var Spren = require('./spren');

'use strict';

var SprenEmitter = function(game, x, y, frame) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y);
  this.width = 800;
  this.particleClass = Spren;
  this.makeParticles();
  this.minParticleSpeed.set(0, 300);
  this.maxParticleSpeed.set(0, 400);
  this.setRotation(0, 0);
  this.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
  this.gravity = -200;
  this.game.input.onDown.add(this.emitParticles, this);
  this.game.input.onUp.add(this.stopParticles, this);
};

SprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
SprenEmitter.prototype.constructor = SprenEmitter;

SprenEmitter.prototype.emitParticles = function(pointer) {
  this.x = pointer.x;
  this.y = pointer.y;
  this.start(false, 5000, 100);
}

SprenEmitter.prototype.stopParticles = function() {
  this.on = false;
}

SprenEmitter.prototype.updateBitmapDataTexture = function() {
  var bmd = this.game.cache.getBitmapData('particleShade');
  bmd.context.clearRect(0, 0, 64, 64);

  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  var c = Phaser.Color.getRGB(Phaser.Color.getRandomColor(0, 255, 255));

  radgrad.addColorStop(0, Phaser.Color.getWebRGB(c));
  c.a = 0;
  radgrad.addColorStop(1, Phaser.Color.getWebRGB(c));

  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);

  bmd.dirty = true;
}

module.exports = SprenEmitter;

var Spren = require('./spren');

'use strict';

var SprenEmitter = function(game, x, y, sprenCount) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y, sprenCount);
  this.game.add.existing(this);
  this.particleClass = Spren;
  this.makeParticles();
  this.minRotation = 0;
  this.maxRotation = 0;
  this.start(true, 200, null, 10);
};

SprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
SprenEmitter.prototype.constructor = SprenEmitter;

module.exports = SprenEmitter;

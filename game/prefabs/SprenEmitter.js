var Spren = require('./spren');

'use strict';

var sprenEmitter = function(game, x, y) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y, 100);
  this.game.add.existing(this);
  this.particleClass = Spren;
  this.makeParticles();
  this.minRotation = 0;
  this.maxRotation = 0;
  this.start(true, 200, null, 10);
};

sprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
sprenEmitter.prototype.constructor = sprenEmitter;

module.exports = sprenEmitter;

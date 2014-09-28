'use strict';

var Spren = function (game, x, y) {
  Phaser.Particle.call(this, game, x, y, "corona");
};

Spren.prototype = Object.create(Phaser.Particle.prototype);
Spren.prototype.constructor = Spren;

module.exports = Spren;

'use strict';

var Spren = function(game, x, y) {
  var bmd = game.add.bitmapData(64, 64);
  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  radgrad.addColorStop(0, 'rgba(1, 159, 98, 1)');
  radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');
  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);
  game.cache.addBitmapData('particleShade', bmd);

  Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));
};

Spren.prototype = Object.create(Phaser.Particle.prototype);
Spren.prototype.constructor = Spren;

Spren.prototype.update = function() {
};

module.exports = Spren;

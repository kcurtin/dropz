var Spren = require('./spren');

'use strict';

var SprenEmitter = function(game, x, y, sprenCount) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y);
  this.game.add.existing(this);

  var EXPLODE_DIAMETER = 40.0;
  this.gravity = 0;
  this.particleClass = Spren;
  this.makeParticles();

  for (var i = 0; i < 360; i=i+36) {
    var xsp = Math.cos(2 * Math.PI * i / 360.0) * EXPLODE_DIAMETER;
    this.setXSpeed(xsp, xsp);
    var ysp = Math.sin(2 * Math.PI * i / 360.0) * EXPLODE_DIAMETER;
    this.setYSpeed(ysp, ysp);
    this.start(true, 2000, null, 1);
    this.update();
  }
};

SprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
SprenEmitter.prototype.constructor = SprenEmitter;

SprenEmitter.prototype.dealDamage = function (particle, enemy) {
  particle.kill()
  enemy.damageHandler(particle.damageAmount);
}

module.exports = SprenEmitter;

'use strict';

var drops = [];

var Drop = function(game, player, x, y) {
  var beltBMD = game.add.bitmapData(400, 50);
  beltBMD.fill(191,64,64, 0.8);
  Phaser.Sprite.call(this, game, x, y, beltBMD);

  this.player = player;
  this.rotation = player.rotation;
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.anchor.setTo(.0005, 0.5);
  this.game.time.events.add(2000, this.destroy, this);
  this.removeExisting();
  this.game.add.existing(this);
  drops.push(this);
  this.player.bringToTop()
  window.drop = this;
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  this.game.physics.arcade.overlap(this, this.game.players, this.applyEffect, null, this);
};

Drop.prototype.applyEffect = function(drop, player) {
  this.game.physics.arcade.velocityFromAngle(this.angle, 300, this.player.body.velocity);
}
Drop.prototype.removeExisting = function() {
  // if (drops[0]) {
  //   drops[0].destroy();
  // }
}

module.exports = Drop;

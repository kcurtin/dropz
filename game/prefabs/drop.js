'use strict';

var Drop = function(game, player, x, y) {
  var beltBMD = game.add.bitmapData(50, 400);
  beltBMD.ctx.fillStyle = 'red';
  beltBMD.ctx.fillRect(0, 0, 50, 400);
  Phaser.Sprite.call(this, game, x, y, beltBMD);

  this.player = player
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.game.time.events.add(2000, this.destroy, this);
  this.game.add.existing(this);
  this.player.bringToTop()
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  this.game.physics.arcade.overlap(this, this.game.players, this.applyEffect, null, this);
};

Drop.prototype.applyEffect = function(drop, player) {
  player.body.velocity.y += 400;
}

module.exports = Drop;

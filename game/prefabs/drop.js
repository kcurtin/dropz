'use strict';

var Drop = function(game, player, x, y) {
  var belt = game.add.bitmapData(50, 400);
  // belt.fill(200, 100, 0, 1);
  belt.ctx.fillStyle = 'red';
  belt.ctx.beginPath();
  belt.ctx.fillRect(0, 0, 50, 400);
  belt.render();
  belt.refreshBuffer();
  // createPrimatives(spriteBMD, buttonBMD);
  // sprite = game.add.sprite(game.width /  2, game.height/2, spriteBMD);

  Phaser.Sprite.call(this, game, x, y, belt);
  this.game.physics.arcade.enable(this);
  debugger
  this.game.physics.arcade.collide(this, player, this.applyEffect, null, this);
  this.game.time.events.add(2000, this.destroy, this);
  this.game.add.existing(this);
  player.bringToTop()
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  // debugger
};

Drop.prototype.blah = function(drop, player) {
  console.log(player.body);
  console.log(drop.body);
}
Drop.prototype.applyEffect = function(drop, player) {
  debugger
  // var count = 0;
  // while (this.body.checkCollision.any) {
  //   console.log(this.body.checkCollision.any)
  //   if (count > 2000) { return }
  //   player.body.velocity.y += 400;
  //   count++;
  // }
}

module.exports = Drop;

var Drop = require('./drop')

'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'playerMovements', 0);
  this.game = game;
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.anchor.setTo(0.5, 0.5);

  this.animations.add('idle', [0], 1, false);
  this.animations.add('walk', [8,9,10,11,12,13,14], 10, true);
  this.animations.add('strafe', [0,1,2,3,4,5,6,7], 10, true);

  this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.dropKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  this.dropKey2 = game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.dropKey3 = game.input.keyboard.addKey(Phaser.Keyboard.T);

  game.input.onDown.add(this.moveSprite, this);

  this.downKey.onDown.add(this.moveLoad, this);
  this.upKey.onDown.add(this.moveLoad, this);
  this.leftKey.onDown.add(this.strafeLoad, this);
  this.rightKey.onDown.add(this.strafeLoad, this);
  this.dropKey.onDown.add(this.dropCircle, this);
  this.dropKey2.onDown.add(this.dropBelt, this);
  this.dropKey3.onDown.add(this.dropTimeBomb, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

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

Player.prototype.moveLoad = function() {
}

Player.prototype.strafeLoad = function() {
}

Player.prototype.update = function() {
  if (this.upKey.isDown)
  {
    this.body.velocity.y = -150;
  }
  else if (this.downKey.isDown)
  {
    this.body.velocity.y = +150;
  }
  else if (!this.upKey.isDown || !this.downKey.isDown)
  {
    this.body.velocity.y = 0;
  }

  if (this.leftKey.isDown)
  {
    this.body.velocity.x = -150;
  }
  else if (this.rightKey.isDown)
  {
    this.body.velocity.x = +150;
  }
  else if (!this.leftKey.isDown || !this.rightKey.isDown)
  {
    this.body.velocity.x = 0;
  }

  if (this.body.velocity.y != 0) {
    this.move();
  } else if (this.body.velocity.x != 0) {
    this.strafe();
  } else {
    this.idle();
  }
};

Player.prototype.move = function() {
  this.animations.play('walk');
}

Player.prototype.strafe = function() {
  this.animations.play('strafe');
}

Player.prototype.idle = function() {
  this.animations.play("idle");
}

Player.prototype.moveSprite = function (pointer) {
  if (tween && tween.isRunning) {
    tween.stop();
    // this.animations.play('idle');
  }

  // this.animations.play('walk');
  var angleInRadians = this.game.physics.arcade.angleToPointer(this, pointer);
  this.angle = angleInRadians * (180 / 3.14) + 90
  var duration = (this.game.physics.arcade.distanceToPointer(this, pointer) / 300) * 1000;
  var tween = this.game.add.tween(this).to({ x: pointer.x, y: pointer.y }, duration, Phaser.Easing.Linear.None, true);
}

module.exports = Player;

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

  this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.F);

  this.dropKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.dropKey2 = game.input.keyboard.addKey(Phaser.Keyboard.R);
  this.dropKey3 = game.input.keyboard.addKey(Phaser.Keyboard.T);

  this.game.input.onDown.add(this.markLocation, this);

  this.dropKey.onDown.add(this.dropCircle, this);
  this.dropKey2.onDown.add(this.dropBelt, this);
  this.dropKey3.onDown.add(this.dropTimeBomb, this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.body.velocity.y = 0;
  this.body.velocity.x = 0;
  this.body.angularVelocity = 0;

  if (this.upKey.isDown || this.downKey.isDown || this.leftKey.isDown || this.rightKey.isDown) {

    if (this.upKey.isDown) {
      this.game.physics.arcade.velocityFromAngle(this.angle, 100, this.body.velocity);
      this.move();
    }

    if (this.downKey.isDown) {
      this.game.physics.arcade.velocityFromAngle(this.angle, -100, this.body.velocity);
      this.move();
    }

    if (this.leftKey.isDown) {
      this.body.angularVelocity = -425;
      this.strafe();
    }

    if (this.rightKey.isDown) {
      this.body.angularVelocity = 425;
      this.strafe();
    }
  } else {
    this.idle();
  }

  // if (this.markedLocationY && this.markedLocationX) {
  //   if (this.game.physics.arcade.distanceToXY(this, this.markedLocationX, this.markedLocationY) > 8) {
  //     if (this.game.input.activePointer.isDown) {
  //       this.game.physics.arcade.accelerateToXY(this, this.markedLocationX, this.markedLocationY, 100, 500, 500);
  //     } else {
  //       this.game.physics.arcade.moveToXY(this, this.markedLocationX, this.markedLocationY, 100);
  //     }
  //   } else {
  //     this.body.velocity.setTo(0);
  //     this.body.acceleration.setTo(0);
  //     this.idle();
  //     this.markedLocationY = null;
  //     this.markedLocationX = null;
  //   }
  // }
};

Player.prototype.markLocation = function(pointer) {
  this.markedLocationX = pointer.x;
  this.markedLocationY = pointer.y;
  this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
  this.move();
}

Player.prototype.dropBelt = function() {
  new Drop(this.game, this, this.x, this.y);
}

Player.prototype.dropTimeBomb = function() {
  // var shape = this.game.add.graphics(0, 0)
  // shape.lineStyle(2, 0x0000FF, 1);
  // shape.beginFill(0xFFFF0B, 1)
  // shape.drawCircle(this.x, this.y, 100)
  // this.game.time.events.add(2000, shape.destroy, shape);
  // this.game.time.events.add(4000, this.renderTimeBomb, this);

  // this.bringToTop()
}

Player.prototype.renderTimeBomb = function() {
  // var shape = this.game.add.graphics(0, 0)
  // shape.lineStyle(2, 0x0000FF, 1);
  // shape.beginFill(0xFFFF0B, 1)
  // shape.drawCircle(this.x, this.y, 200);
  // this.game.time.events.add(6000, shape.destroy, shape);

  // this.bringToTop()
}

Player.prototype.dropCircle = function() {
  // var shape = this.game.add.graphics(0, 0)
  // shape.lineStyle(2, 0x0000FF, 1);
  // shape.beginFill(0xFFFF0B, 1)
  // shape.drawCircle(this.x, this.y, 100)
  // this.game.time.events.add(2000, shape.destroy, shape);

  // this.bringToTop()
}

Player.prototype.move = function() {
  this.animations.play('walk');
}

Player.prototype.strafe = function() {
  this.animations.play('strafe');
}

Player.prototype.idle = function() {
  this.animations.play("idle");
}

module.exports = Player;

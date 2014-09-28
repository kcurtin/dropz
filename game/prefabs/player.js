var Drop = require('./drop')
var sprenEmitter = require('../prefabs/sprenEmitter');

'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'playerMovements', 0);
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);
  this.game.add.existing(this);

  this.animations.add('idle', [0], 1, false);
  this.animations.add('walk', [8,9,10,11,12,13,14], 10, true);
  this.animations.add('strafe', [0,1,2,3,4,5,6,7], 10, true);

  this.mapKeyboardControls();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.game.physics.arcade.collide(this.emitter, this.game.enemies, this.dealDamage, null, this);

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
};

Player.prototype.anglePlayer = function(pointer) {
  this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
}

Player.prototype.dropBelt = function() {
  new Drop(this.game, this, this.x, this.y);
}

Player.prototype.particleBurst = function() {
  this.emitter = new sprenEmitter(this.game, this.x, this.y, 100);
  this.bringToTop();
}

Player.prototype.dealDamage = function(emitter, enemy) {
  enemy.damageHandler()
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

Player.prototype.mapKeyboardControls = function() {
  this.upKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.downKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.leftKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

  this.dropKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
  this.dropKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

  this.game.input.onDown.add(this.anglePlayer, this);
  this.dropKey.onDown.add(this.dropBelt, this);
  this.dropKey2.onDown.add(this.particleBurst, this);
}

module.exports = Player;

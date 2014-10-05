'use strict';

var HealthBar = require("./HealthBar");

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player2-move', 0);
  this.maxHealth = 100;
  this.game.enemies.add(this);
  this.game.physics.arcade.enableBody(this);
  this.body.immovable = true;
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);
  this.events.onKilled.add(this.deathHandler);
  this.health = 100;

  this.healthBar = new HealthBar(game, 0, -20, 64, 4, this.maxHealth, this);
  this.healthBar.anchor.setTo(0.5, 0.5);
  this.addChild(this.healthBar);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
};

Enemy.prototype.damageHandler = function (dmg) {
  this.damage(dmg);
  this.healthBar.updateHealth();
}

Enemy.prototype.deathHandler = function (enemy) {
  var coinsSmallSound = enemy.game.add.audio('coinsSmall');
  coinsSmallSound.play()
  var character = enemy.game.add.sprite(enemy.x - 32, enemy.y - 32, 'player2-die');
  character.animations.add('die', [0,1,2,3,4,5,6,7], 10, false);
  character.animations.play("die");
  // enemy.game.time.events.add(1000, enemy.game.enemies.addEnemy, enemy);
}

module.exports = Enemy;

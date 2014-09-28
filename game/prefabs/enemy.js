'use strict';

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player2-move', 0);
  this.game.enemies.add(this);
  this.game.physics.arcade.enableBody(this);
  this.body.immovable = true;
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);

  // this.hp = 20;
  // this.totalhp = 20;
  // this._lasthp = 0;
  // this.healthbar = game.add.graphics(0,0);
  // var x = (this.hp / this.totalhp) * 100;
  // var colour = this.rgbToHex((x > 50 ? 1-2*(x-50)/100.0 : 1.0) * 255, (x > 50 ? 1.0 : 2*x/100.0) * 255, 0);
  // var colour = this.rgbToHex((x > 50 ? 1-2*(x-50)/100.0 : 1.0) * 255, (x > 50 ? 1.0 : 2*x/100.0) * 255, 0);
  // this.healthbar.beginFill(colour);
  // this.healthbar.lineStyle(5, colour, 1);
  // this.healthbar.moveTo(0,-5);
  // this.healthbar.lineTo(64 * this.hp / this.totalhp, -5);
  // this.healthbar.endFill();
  // Enemy.prototype.rgbToHex = function (r, g, b) {
  //   return "0x" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  // }
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
};

Enemy.prototype.damageHandler = function () {
  var coinsSmallSound = this.game.add.audio('coinsSmall');
  coinsSmallSound.play()
  var character = this.game.add.sprite(this.x, this.y, 'player2-die');
  character.animations.add('die', [0,1,2,3,4,5,6,7], 10, false);
  this.kill();
  character.animations.play("die");
  this.game.time.events.add(1000, this.game.enemies.addEnemy, this);
}

Enemy.prototype.deathHandler = function () {
}

module.exports = Enemy;

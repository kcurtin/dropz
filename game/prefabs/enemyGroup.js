'use strict';

var Enemy = require('./enemy');

var enemyGroup = function(game) {
  Phaser.Group.call(this, game);
};

enemyGroup.prototype = Object.create(Phaser.Group.prototype);
enemyGroup.prototype.constructor = enemyGroup;

enemyGroup.prototype.update = function() {
};

enemyGroup.prototype.addEnemy = function() {
  new Enemy(this.game, 250, 250, 0);
};

enemyGroup.prototype.killEnemy = function(emitter, enemy) {
  var coinsSmallSound = this.game.add.audio('coinsSmall');
  coinsSmallSound.play()
  enemy.kill();
  var character = this.game.add.sprite(enemy.x, enemy.y, 'player2-die');
  character.animations.add('die', [0,1,2,3,4,5,6,7], 10, false);
  character.animations.play("die");
  // this.game.time.events.add(1000, this.game.enemies.addEnemy, this);
}


module.exports = enemyGroup;

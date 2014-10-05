'use strict';

var Enemy = require('./enemy');

var EnemyGroup = function(game) {
  Phaser.Group.call(this, game);
};

EnemyGroup.prototype = Object.create(Phaser.Group.prototype);
EnemyGroup.prototype.constructor = EnemyGroup;

EnemyGroup.prototype.update = function() {
};

EnemyGroup.prototype.addEnemy = function() {
  new Enemy(this.game, 250, 250, 0);
};

EnemyGroup.prototype.addRandEnemies = function(num) {
  for (var i = 0; i < num; i++) {
    var x = this.game.rnd.integerInRange(100, 770);
    var y = this.game.rnd.integerInRange(0, 570);
    new Enemy(this.game, x, y, 0);
  }
};

EnemyGroup.prototype.killEnemy = function(emitter, enemy) {
  var coinsSmallSound = this.game.add.audio('coinsSmall');
  coinsSmallSound.play()
  enemy.kill();
  var character = this.game.add.sprite(enemy.x, enemy.y, 'player2-die');
  character.animations.add('die', [0,1,2,3,4,5,6,7], 10, false);
  character.animations.play("die");
  // this.game.time.events.add(1000, this.game.enemies.addEnemy, this);
}


module.exports = EnemyGroup;

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

module.exports = enemyGroup;

'use strict';

var Player = require('../prefabs/player');
var EnemyGroup = require('../prefabs/EnemyGroup');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage("war2-wasteland-tiles", 'wastelandTiles');
    this.backGround = this.map.createLayer("Background");
    this.backGround.resizeWorld();

    var player = new Player(this.game, 150, 150, 0)

    this.game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

    var enemies = new EnemyGroup(this.game);
    this.game.enemies = enemies;
    enemies.addRandEnemies(10);
  },

  update: function() {
  },

  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;

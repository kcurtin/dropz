'use strict';

var Player = require('../prefabs/player');
var EnemyGroup = require('../prefabs/EnemyGroup');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage("war2-wasteland-tiles", 'wastelandTiles');

    var collideTile = function(sprite, thing) {
      console.log(sprite);
      console.log(thing);
    }

    // this.map.setTileIndexCallback(138, collideTile, this);
    this.map.setCollision(138);

    this.ground = this.map.createLayer("Ground");
    this.ground.resizeWorld();

    // var walkables = [127];
    // this.pathfinder = this.game.plugins.add(Phaser.Plugin.PathFinderPlugin);
    // this.pathfinder.setGrid(this.map.layers[0].data, walkables);

    var player = new Player(this.game, 150, 150, 0)
    this.player = player;

    this.game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

    var enemies = new EnemyGroup(this.game);
    this.game.enemies = enemies;
    enemies.addEnemy(600, 500)
    // enemies.addRandEnemies(10);
  },

  // findPathTo: function(tilex, tiley) {
  //   this.pathfinder.setCallbackFunction(function(path) {
  //     path = path || [];
  //     for(var i = 0, ilen = path.length; i < ilen; i++) {
  //       map.putTile(46, path[i].x, path[i].y);
  //     }
  //     var blocked = false;
  //   });

  //   this.pathfinder.preparePathCalculation([0,0], [tilex,tiley]);
  //   this.pathfinder.calculatePath();
  // },

  update: function() {
    this.game.physics.arcade.collide(this.player, this.ground);

    // var layer = this.ground;
    // this.findPathTo(layer.getTileX(this.player.x), layer.getTileY(this.player.y));
    // this.game.enemies.path = this.pathfinder.resultSet;
  },

  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;

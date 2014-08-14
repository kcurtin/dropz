'use strict';

var Player = require('../prefabs/player')

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage("grass-tiles-2-small", 'groundTiles');
    this.map.addTilesetImage("tree2-final", 'tree');

    this.backGround = this.map.createLayer("Background");
    this.foreGround = this.map.createLayer("Foreground");

    this.backGround.resizeWorld();
    this.foreGround.resizeWorld();

    var player = new Player(this.game, 150, 150, 0)
    this.game.add.existing(player);

    this.game.players = [];
    this.game.players.push(player);
  },

  update: function() {
  },

  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;

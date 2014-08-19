'use strict';

var Player = require('../prefabs/player');
var SprenEmitter = require('../prefabs/SprenEmitter');

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage("war2-wasteland-tiles", 'wastelandTiles');
    this.backGround = this.map.createLayer("Background");
    this.backGround.resizeWorld();

    var emitter = new SprenEmitter(this.game, 200, 200);
    this.game.add.existing(emitter);

    var player = new Player(this.game, 150, 150, 0)
    this.game.add.existing(player);
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);

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

'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.tilemap('lvl1', 'assets/dropz1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('groundTiles', 'assets/grass-tiles-2-small.png');
    this.load.image('tree', 'assets/tree2-final.png');

    this.load.spritesheet('playerMovements', 'assets/playerMovements.png', 64, 64, 16);

    this.onLoadComplete()
  },

  create: function() {
  },

  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },

  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;

'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.tilemap('lvl1', 'assets/wasteland1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image("wastelandTiles", "assets/war2-wasteland-tiles.png");

    this.coinsSmall = this.game.load.audio('coinsSmall', 'assets/coins_small.ogg');
    this.coinsBig =   this.game.load.audio('coinsBig', 'assets/coins_big.ogg');

    this.load.image('corona', 'assets/blue.png');

    this.load.spritesheet('playerMovements', 'assets/playerMovements2.png', 64, 64, 16);
    this.load.spritesheet('playerMovements2', 'assets/playerMovements2.png', 64, 64, 16);

    this.loadPlayers()
    this.loadEnemies()

    this.onLoadComplete()
  },

  create: function() {
  },

  loadPlayers: function() {
    this.load.spritesheet("player-cast-forward", "assets/players/player-cast-forward.png");
    this.load.spritesheet("player-cast-onehand", "assets/players/player-cast-onehand.png");
    this.load.spritesheet("player-cast", "assets/players/player-cast.png");
    this.load.spritesheet("player-die", "assets/players/player-die.png");
    this.load.spritesheet("player-move", "assets/players/player-move.png");
    this.load.spritesheet("player-strafe", "assets/players/player-strafe.png");
    this.load.spritesheet("player-wobble", "assets/players/player-wobble.png");
    this.load.spritesheet("player2-cast-forward", "assets/players/player2-cast-forward.png");
    this.load.spritesheet("player2-cast-onehand", "assets/players/player2-cast-onehand.png");
    this.load.spritesheet("player2-cast", "assets/players/player2-cast.png");
    this.load.spritesheet("player2-die", "assets/players/player2-die.png", 64, 64, 8);
    this.load.spritesheet("player2-move", "assets/players/player2-move.png", 64, 64, 8);
    this.load.spritesheet("player2-wobble", "assets/players/player2-wobble.png");
    this.load.spritesheet("player2-strafe_0", "assets/players/player2-strafe_0.png");
  },

  loadEnemies: function() {
    this.load.spritesheet("troll-attack-wounded", "assets/enemies/troll/troll-attack-wounded.png");
    this.load.spritesheet("troll-attack", "assets/enemies/troll/troll-attack.png");
    this.load.spritesheet("troll-death", "assets/enemies/troll/troll-death.png");
    this.load.spritesheet("troll-move-wounded", "assets/enemies/troll/troll-move-wounded.png");
    this.load.spritesheet("troll-move", "assets/enemies/troll/troll-move.png");
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

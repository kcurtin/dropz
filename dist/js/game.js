(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

//global variables
window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'dropz');

  // Game States
  game.state.add('boot', require('./states/boot'));
  game.state.add('gameover', require('./states/gameover'));
  game.state.add('menu', require('./states/menu'));
  game.state.add('play', require('./states/play'));
  game.state.add('preload', require('./states/preload'));
  

  game.state.start('boot');
};
},{"./states/boot":8,"./states/gameover":9,"./states/menu":10,"./states/play":11,"./states/preload":12}],2:[function(require,module,exports){
'use strict';

var Drop = function(game, player, x, y) {
  var beltBMD = game.add.bitmapData(400, 50);
  beltBMD.fill(191,64,64, 0.8);
  Phaser.Sprite.call(this, game, x, y, beltBMD);

  this.player = player;
  this.rotation = player.rotation;
  this.game.physics.arcade.enableBody(this);
  this.anchor.setTo(.0005, 0.5);
  this.game.time.events.add(1000, this.destroy, this);
  this.game.add.existing(this);
  this.player.bringToTop()
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  // this.game.physics.arcade.overlap(this, this.game.players, this.applyEffect, null, this);

  if (this.checkOverlap(this, this.player)){
    this.applyEffect(this, this.player);
  }
};

Drop.prototype.checkOverlap = function(spriteA, spriteB) {
  var boundsA = spriteA.getBounds();
  var boundsB = spriteB.getBounds();
  return Phaser.Rectangle.intersects(boundsA, boundsB);
}

Drop.prototype.applyEffect = function(drop, player) {
  this.game.physics.arcade.velocityFromAngle(this.angle, 350, player.body.velocity);
}

module.exports = Drop;

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{"./enemy":3}],5:[function(require,module,exports){
var Drop = require('./drop')
var sprenEmitter = require('../prefabs/sprenEmitter');

'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'playerMovements', 0);
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);
  this.game.add.existing(this);

  this.animations.add('idle', [0], 1, false);
  this.animations.add('walk', [8,9,10,11,12,13,14], 10, true);
  this.animations.add('strafe', [0,1,2,3,4,5,6,7], 10, true);

  this.mapKeyboardControls();
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.game.physics.arcade.collide(this.emitter, this.game.enemies, this.dealDamage, null, this);

  this.body.velocity.y = 0;
  this.body.velocity.x = 0;
  this.body.angularVelocity = 0;

  if (this.upKey.isDown || this.downKey.isDown || this.leftKey.isDown || this.rightKey.isDown) {

    if (this.upKey.isDown) {
      this.game.physics.arcade.velocityFromAngle(this.angle, 100, this.body.velocity);
      this.move();
    }

    if (this.downKey.isDown) {
      this.game.physics.arcade.velocityFromAngle(this.angle, -100, this.body.velocity);
      this.move();
    }

    if (this.leftKey.isDown) {
      this.body.angularVelocity = -425;
      this.strafe();
    }

    if (this.rightKey.isDown) {
      this.body.angularVelocity = 425;
      this.strafe();
    }

  } else {
    this.idle();
  }
};

Player.prototype.anglePlayer = function(pointer) {
  this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
}

Player.prototype.dropBelt = function() {
  new Drop(this.game, this, this.x, this.y);
}

Player.prototype.particleBurst = function() {
  this.emitter = new sprenEmitter(this.game, this.x, this.y, 100);
  this.bringToTop();
}

Player.prototype.dealDamage = function(emitter, enemy) {
  enemy.damageHandler()
}

Player.prototype.move = function() {
  this.animations.play('walk');
}

Player.prototype.strafe = function() {
  this.animations.play('strafe');
}

Player.prototype.idle = function() {
  this.animations.play("idle");
}

Player.prototype.mapKeyboardControls = function() {
  this.upKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.downKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.leftKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

  this.dropKey  = this.game.input.keyboard.addKey(Phaser.Keyboard.R);
  this.dropKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.W);

  this.game.input.onDown.add(this.anglePlayer, this);
  this.dropKey.onDown.add(this.dropBelt, this);
  this.dropKey2.onDown.add(this.particleBurst, this);
}

module.exports = Player;

},{"../prefabs/sprenEmitter":7,"./drop":2}],6:[function(require,module,exports){
'use strict';

var Spren = function (game, x, y) {
  Phaser.Particle.call(this, game, x, y, "corona");
};

Spren.prototype = Object.create(Phaser.Particle.prototype);
Spren.prototype.constructor = Spren;

module.exports = Spren;

},{}],7:[function(require,module,exports){
var Spren = require('./spren');

'use strict';

var sprenEmitter = function(game, x, y) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y, 100);
  this.game.add.existing(this);
  this.particleClass = Spren;
  this.makeParticles();
  this.minRotation = 0;
  this.maxRotation = 0;
  this.start(true, 200, null, 10);
};

sprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
sprenEmitter.prototype.constructor = sprenEmitter;

module.exports = sprenEmitter;

},{"./spren":6}],8:[function(require,module,exports){
'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
  },

  create: function() {
    this.game.input.maxPointers = 1;
    this.game.state.start('preload');
  }
};

module.exports = Boot;

},{}],9:[function(require,module,exports){
'use strict';

function GameOver() {}

GameOver.prototype = {
  preload: function () {
  },

  create: function () {
  },

  update: function () {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = GameOver;

},{}],10:[function(require,module,exports){
'use strict';

function Menu() {}

Menu.prototype = {
  preload: function() {

  },
  create: function() {
  },

  update: function() {
    if(this.game.input.activePointer.justPressed()) {
      this.game.state.start('play');
    }
  }
};

module.exports = Menu;

},{}],11:[function(require,module,exports){
'use strict';

var Player = require('../prefabs/player');
var enemyGroup = require('../prefabs/enemyGroup');

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

    var enemies = new enemyGroup(this.game);
    this.game.enemies = enemies;
    enemies.addEnemy();
  },

  update: function() {
  },

  clickListener: function() {
    this.game.state.start('gameover');
  }
};

module.exports = Play;

},{"../prefabs/enemyGroup":4,"../prefabs/player":5}],12:[function(require,module,exports){
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

},{}]},{},[1])
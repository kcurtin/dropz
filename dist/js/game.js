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
},{"./states/boot":10,"./states/gameover":11,"./states/menu":12,"./states/play":13,"./states/preload":14}],2:[function(require,module,exports){
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

},{"./enemy":6}],3:[function(require,module,exports){
'use strict';

var HealthBar = function(game, x, y, width, height, max, player) {
  this.max = max;
  this.backgroundColor = '#999';
  this.player = player;
  this.bmd = game.add.bitmapData(player.width, 5);

  Phaser.Sprite.call(this, game, x, y, this.bmd);
  this.updateHealth();
};

HealthBar.prototype = Object.create(Phaser.Sprite.prototype);
HealthBar.prototype.constructor = HealthBar;

HealthBar.prototype.update = function() {
};

HealthBar.prototype.updateHealth = function() {
  var percent = this.player.health / this.max;
  this.bmd.clear();
  this.bmd.ctx.beginPath();
  this.bmd.ctx.moveTo(0,0);
  this.bmd.ctx.rect(0,0, this.player.width, 5);
  this.bmd.ctx.closePath();
  this.bmd.ctx.fillStyle = this.backgroundColor;
  this.bmd.ctx.fill();
  this.bmd.ctx.beginPath();
  this.bmd.ctx.rect(0,0, this.player.width*percent, 5);
  this.bmd.ctx.fillStyle = this.colorBar(percent);
  this.bmd.ctx.fill();
  this.bmd.ctx.closePath();
  this.bmd.render();
  this.bmd.refreshBuffer();
}

HealthBar.prototype.colorBar = function(percent) {
  if (percent <= 0.25) {
    return '#ff7474'; //red
  }
  if (percent <= 0.75) {
    return '#eaff74'; //yellow
  }
  return '#74ff74'; //green
}

module.exports = HealthBar;

},{}],4:[function(require,module,exports){
var Spren = require('./spren');

'use strict';

var SprenEmitter = function(game, x, y, sprenCount) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y, sprenCount);
  this.game.add.existing(this);
  this.particleClass = Spren;
  this.makeParticles();
  this.minRotation = 0;
  this.maxRotation = 0;
  this.start(true, 200, null, 10);
};

SprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
SprenEmitter.prototype.constructor = SprenEmitter;

module.exports = SprenEmitter;

},{"./spren":9}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
'use strict';

var HealthBar = require("./HealthBar");

var Enemy = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'player2-move', 0);
  this.maxHealth = 100;
  this.game.enemies.add(this);
  this.game.physics.arcade.enableBody(this);
  this.body.immovable = true;
  this.body.collideWorldBounds = true;
  this.anchor.setTo(0.5, 0.5);
  this.events.onKilled.add(this.deathHandler);
  this.health = 100;

  this.healthBar = new HealthBar(game, 0, -20, 64, 4, this.maxHealth, this);
  this.healthBar.anchor.setTo(0.5, 0.5);
  this.addChild(this.healthBar);
};

Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.update = function() {
};

Enemy.prototype.damageHandler = function (dmg) {
  this.damage(dmg);
  this.healthBar.updateHealth();
}

Enemy.prototype.deathHandler = function (enemy) {
  var coinsSmallSound = enemy.game.add.audio('coinsSmall');
  coinsSmallSound.play()
  var character = enemy.game.add.sprite(enemy.x - 32, enemy.y - 32, 'player2-die');
  character.animations.add('die', [0,1,2,3,4,5,6,7], 10, false);
  character.animations.play("die");
  // enemy.game.time.events.add(1000, enemy.game.enemies.addEnemy, enemy);
}

module.exports = Enemy;

},{"./HealthBar":3}],7:[function(require,module,exports){
var Drop = require('./drop')
var Spell = require('./spell')
var SprenEmitter = require('../prefabs/SprenEmitter');

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
  // this.spell = new SprenEmitter(this.game, this.x, this.y, 1);
  this.spell = new Spell(this.game, this.x - this.width, this.y - this.height, 'corona');
  this.bringToTop();
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

},{"../prefabs/SprenEmitter":4,"./drop":5,"./spell":8}],8:[function(require,module,exports){
'use strict';

var Spell = function(game, x, y, key) {
  Phaser.Sprite.call(this, game, x, y, key);
  game.physics.enable(this, Phaser.Physics.ARCADE);
  this.enableBody = true;
  this.active = true;
  this.damageAmount = 25;
  game.add.existing(this);
  this.game.time.events.add(100, this.kill, this);
};

Spell.prototype = Object.create(Phaser.Sprite.prototype);
Spell.prototype.constructor = Spell;

Spell.prototype.update = function() {
  // this.game.physics.arcade.collide(this.spell, this.game.enemies, this.dealDamage, null, this);
  this.game.physics.arcade.overlap(this, this.game.enemies, this.dealDamage, null, this);

};

Spell.prototype.dealDamage = function(spell, enemy) {
  if (spell.active) {
    enemy.damageHandler(spell.damageAmount);
  }
  spell.active = false;
}


module.exports = Spell;

},{}],9:[function(require,module,exports){
'use strict';

var Spren = function (game, x, y) {
  Phaser.Particle.call(this, game, x, y, "corona");
};

Spren.prototype = Object.create(Phaser.Particle.prototype);
Spren.prototype.constructor = Spren;

module.exports = Spren;

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"../prefabs/EnemyGroup":2,"../prefabs/player":7}],14:[function(require,module,exports){
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
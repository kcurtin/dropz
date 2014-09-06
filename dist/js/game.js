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
},{"./states/boot":6,"./states/gameover":7,"./states/menu":8,"./states/play":9,"./states/preload":10}],2:[function(require,module,exports){
var Spren = require('./spren');

'use strict';

var SprenEmitter = function(game, x, y, frame) {
  Phaser.Particles.Arcade.Emitter.call(this, game, x, y);
  this.width = 800;
  this.particleClass = Spren;
  this.makeParticles();
  this.minParticleSpeed.set(0, 300);
  this.maxParticleSpeed.set(0, 400);
  this.setRotation(0, 0);
  this.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
  this.gravity = -200;
  this.game.input.onDown.add(this.emitParticles, this);
  this.game.input.onUp.add(this.stopParticles, this);
};

SprenEmitter.prototype = Object.create(Phaser.Particles.Arcade.Emitter.prototype);
SprenEmitter.prototype.constructor = SprenEmitter;

SprenEmitter.prototype.emitParticles = function(pointer) {
  this.x = pointer.x;
  this.y = pointer.y;
  this.start(false, 5000, 100);
}

SprenEmitter.prototype.stopParticles = function() {
  this.on = false;
}

SprenEmitter.prototype.updateBitmapDataTexture = function() {
  var bmd = this.game.cache.getBitmapData('particleShade');
  bmd.context.clearRect(0, 0, 64, 64);

  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  var c = Phaser.Color.getRGB(Phaser.Color.getRandomColor(0, 255, 255));

  radgrad.addColorStop(0, Phaser.Color.getWebRGB(c));
  c.a = 0;
  radgrad.addColorStop(1, Phaser.Color.getWebRGB(c));

  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);

  bmd.dirty = true;
}

module.exports = SprenEmitter;

},{"./spren":5}],3:[function(require,module,exports){
'use strict';

var drops = [];

var Drop = function(game, player, x, y) {
  var beltBMD = game.add.bitmapData(400, 50);
  beltBMD.fill(191,64,64, 0.8);
  Phaser.Sprite.call(this, game, x, y, beltBMD);

  this.player = player;
  this.rotation = player.rotation;
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.anchor.setTo(.0005, 0.5);
  this.game.time.events.add(2000, this.destroy, this);
  this.removeExisting();
  this.game.add.existing(this);
  drops.push(this);
  this.player.bringToTop()
  window.drop = this;
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  this.game.physics.arcade.overlap(this, this.game.players, this.applyEffect, null, this);
};

Drop.prototype.applyEffect = function(drop, player) {
  this.game.physics.arcade.velocityFromAngle(this.angle, 300, this.player.body.velocity);
}
Drop.prototype.removeExisting = function() {
  // if (drops[0]) {
  //   drops[0].destroy();
  // }
}

module.exports = Drop;

},{}],4:[function(require,module,exports){
var Drop = require('./drop')

'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'playerMovements', 0);
  this.game = game;
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.anchor.setTo(0.5, 0.5);

  this.animations.add('idle', [0], 1, false);
  this.animations.add('walk', [8,9,10,11,12,13,14], 10, true);
  this.animations.add('strafe', [0,1,2,3,4,5,6,7], 10, true);

  this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.F);

  this.dropKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.dropKey2 = game.input.keyboard.addKey(Phaser.Keyboard.R);
  this.dropKey3 = game.input.keyboard.addKey(Phaser.Keyboard.T);

  this.game.input.onDown.add(this.markLocation, this);

  this.dropKey.onDown.add(this.dropCircle, this);
  this.dropKey2.onDown.add(this.dropBelt, this);
  this.dropKey3.onDown.add(this.dropTimeBomb, this);
};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  this.body.velocity.y = 0;
  this.body.velocity.x = 0;
  this.body.angularVelocity = 0;

  if (this.upKey.isDown ||this.downKey.isDown || this.leftKey.isDown || this.rightKey.isDown) {
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

  // if (this.markedLocationY && this.markedLocationX) {
  //   if (this.game.physics.arcade.distanceToXY(this, this.markedLocationX, this.markedLocationY) > 8) {
  //     if (this.game.input.activePointer.isDown) {
  //       this.game.physics.arcade.accelerateToXY(this, this.markedLocationX, this.markedLocationY, 100, 500, 500);
  //     } else {
  //       this.game.physics.arcade.moveToXY(this, this.markedLocationX, this.markedLocationY, 100);
  //     }
  //   } else {
  //     this.body.velocity.setTo(0);
  //     this.body.acceleration.setTo(0);
  //     this.idle();
  //     this.markedLocationY = null;
  //     this.markedLocationX = null;
  //   }
  // }
};

Player.prototype.markLocation = function(pointer) {
  this.markedLocationX = pointer.x;
  this.markedLocationY = pointer.y;
  this.rotation = this.game.physics.arcade.angleToPointer(this, pointer);
  this.move();
}

Player.prototype.dropBelt = function() {
  new Drop(this.game, this, this.x, this.y);
}

Player.prototype.dropTimeBomb = function() {
  var shape = this.game.add.graphics(0, 0)
  shape.lineStyle(2, 0x0000FF, 1);
  shape.beginFill(0xFFFF0B, 1)
  shape.drawCircle(this.x, this.y, 100)
  this.game.time.events.add(2000, shape.destroy, shape);
  this.game.time.events.add(4000, this.renderTimeBomb, this);

  this.bringToTop()
}

Player.prototype.renderTimeBomb = function() {
  var shape = this.game.add.graphics(0, 0)
  shape.lineStyle(2, 0x0000FF, 1);
  shape.beginFill(0xFFFF0B, 1)
  shape.drawCircle(this.x, this.y, 200);
  this.game.time.events.add(6000, shape.destroy, shape);

  this.bringToTop()
}

Player.prototype.dropCircle = function() {
  var shape = this.game.add.graphics(0, 0)
  shape.lineStyle(2, 0x0000FF, 1);
  shape.beginFill(0xFFFF0B, 1)
  shape.drawCircle(this.x, this.y, 100)
  this.game.time.events.add(2000, shape.destroy, shape);

  this.bringToTop()
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

module.exports = Player;

},{"./drop":3}],5:[function(require,module,exports){
'use strict';

var Spren = function (game, x, y) {
  var bmd = game.add.bitmapData(64, 64);
  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  radgrad.addColorStop(0, 'rgba(1, 159, 98, 1)');
  radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');
  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);
  game.cache.addBitmapData('particleShade', bmd);
  Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));
};

Spren.prototype = Object.create(Phaser.Particle.prototype);
Spren.prototype.constructor = Spren;

module.exports = Spren;

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
    // this.game.add.existing(emitter);

    var player = new Player(this.game, 150, 150, 0)
    this.game.add.existing(player);
    this.game.camera.follow(player, Phaser.Camera.FOLLOW_TOPDOWN);
    window.player = player;

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

},{"../prefabs/SprenEmitter":2,"../prefabs/player":4}],10:[function(require,module,exports){
'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.tilemap('lvl1', 'assets/wasteland1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image("wastelandTiles", "assets/war2-wasteland-tiles.png");

    this.load.spritesheet('playerMovements', 'assets/playerMovements2.png', 64, 64, 16);
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

},{}]},{},[1])
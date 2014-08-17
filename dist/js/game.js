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
},{"./states/boot":4,"./states/gameover":5,"./states/menu":6,"./states/play":7,"./states/preload":8}],2:[function(require,module,exports){
'use strict';

var Drop = function(game, player, x, y) {
  var beltBMD = game.add.bitmapData(50, 400);
  beltBMD.ctx.fillStyle = 'red';
  beltBMD.ctx.fillRect(0, 0, 50, 400);
  Phaser.Sprite.call(this, game, x, y, beltBMD);

  this.player = player
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.game.time.events.add(2000, this.destroy, this);
  this.game.add.existing(this);
  this.player.bringToTop()
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  this.game.physics.arcade.overlap(this, this.game.players, this.applyEffect, null, this);
};

Drop.prototype.applyEffect = function(drop, player) {
  player.body.velocity.y += 400;
}

module.exports = Drop;

},{}],3:[function(require,module,exports){
var Drop = require('./drop')

MonsterParticle = function (game, x, y) {
  Phaser.Particle.call(this, game, x, y, game.cache.getBitmapData('particleShade'));
};

MonsterParticle.prototype = Object.create(Phaser.Particle.prototype);
MonsterParticle.prototype.constructor = MonsterParticle;

'use strict';

var Player = function(game, x, y, frame) {
  Phaser.Sprite.call(this, game, x, y, 'playerMovements', 0);
  this.game = game;
  this.game.physics.arcade.enableBody(this);
  this.body.collideWorldBounds = true
  this.anchor.setTo(0.5, 0.5);

  // this.makeParticle()

  this.animations.add('idle', [0], 1, false);
  this.animations.add('walk', [8,9,10,11,12,13,14], 10, true);
  this.animations.add('strafe', [0,1,2,3,4,5,6,7], 10, true);

  this.dropKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  this.dropKey2 = game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.dropKey3 = game.input.keyboard.addKey(Phaser.Keyboard.T);

  this.game.input.onDown.add(this.markLocation, this);
  this.game.input.onDown.add(this.makeParticle, this);

  this.dropKey.onDown.add(this.dropCircle, this);
  this.dropKey2.onDown.add(this.dropBelt, this);
  this.dropKey3.onDown.add(this.dropTimeBomb, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function() {
  if (this.markedLocationY && this.markedLocationX) {
    if (this.game.physics.arcade.distanceToXY(this, this.markedLocationX, this.markedLocationY) > 8) {
      if (this.game.input.activePointer.isDown) {
        // this.body.acceleration.x = 200;
      }
      this.game.physics.arcade.moveToXY(this, this.markedLocationX, this.markedLocationY, 100);
    } else {
      this.body.velocity.setTo(0);
      this.idle();
      this.markedLocationY = null;
      this.markedLocationX = null;
    }
  }
};

Player.prototype.makeParticle = function(pointer) {
  var game = this.game;
  // Create our bitmapData which we'll use as our particle texture
  var bmd = game.add.bitmapData(64, 64);
  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  radgrad.addColorStop(0, 'rgba(1, 159, 98, 1)');
  radgrad.addColorStop(1, 'rgba(1, 159, 98, 0)');
  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);
  //  Put the bitmapData into the cache
  game.cache.addBitmapData('particleShade', bmd);
  //  Create our emitter
  emitter = game.add.emitter(game.world.centerX, pointer.x, pointer.y);
  // emitter.width = 800;
  emitter.x = pointer.x;
  emitter.y = pointer.y;
  //  Here is the important line. This will tell the Emitter to emit our custom MonsterParticle class instead of a normal Particle object.
  emitter.particleClass = MonsterParticle;
  emitter.makeParticles();
  emitter.minParticleSpeed.set(0, 300);
  emitter.maxParticleSpeed.set(0, 400);
  emitter.setRotation(0, 0);
  emitter.setScale(0.1, 1, 0.1, 1, 12000, Phaser.Easing.Quintic.Out);
  emitter.gravity = -200;
  emitter.start(false, 2000, 100);
  game.input.onDown.add(this.updateBitmapDataTexture, this);
}

Player.prototype.updateBitmapDataTexture = function() {
  game = this.game;
  // Get the bitmapData from the cache. This returns a reference to the original object
  var bmd = game.cache.getBitmapData('particleShade');

  bmd.context.clearRect(0, 0, 64, 64);

  //  createRadialGradient parameters: x, y, innerRadius, x, y, outerRadius
  var radgrad = bmd.ctx.createRadialGradient(32, 32, 4, 32, 32, 32);
  var c = Phaser.Color.getRGB(Phaser.Color.getRandomColor(0, 255, 255));

  radgrad.addColorStop(0, Phaser.Color.getWebRGB(c));
  c.a = 0;
  radgrad.addColorStop(1, Phaser.Color.getWebRGB(c));

  bmd.context.fillStyle = radgrad;
  bmd.context.fillRect(0, 0, 64, 64);

  //  All particles using this texture will update at the next render
  bmd.dirty = true;
}

Player.prototype.markLocation = function(pointer) {
  this.markedLocationX = pointer.x;
  this.markedLocationY = pointer.y;
  this.rotation = this.game.physics.arcade.angleToPointer(this, pointer) + 1.57079633;
  this.move();
}

Player.prototype.dropBelt = function() {
  new Drop(this.game, this, this.x - 25, this.y);
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

},{"./drop":2}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

var Player = require('../prefabs/player')

function Play() {}
Play.prototype = {
  create: function() {
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.map = this.game.add.tilemap('lvl1');
    this.map.addTilesetImage("war2-wasteland-tiles", 'wastelandTiles');
    this.backGround = this.map.createLayer("Background");
    this.backGround.resizeWorld();

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

},{"../prefabs/player":3}],8:[function(require,module,exports){
'use strict';

function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
  preload: function() {
    this.load.tilemap('lvl1', 'assets/wasteland1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image("wastelandTiles", "assets/war2-wasteland-tiles.png");

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

},{}]},{},[1])
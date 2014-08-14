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
  var belt = game.add.bitmapData(50, 400);
  // belt.fill(200, 100, 0, 1);
  belt.ctx.fillStyle = 'red';
  belt.ctx.beginPath();
  belt.ctx.fillRect(0, 0, 50, 400);
  belt.render();
  belt.refreshBuffer();
  // createPrimatives(spriteBMD, buttonBMD);
  // sprite = game.add.sprite(game.width /  2, game.height/2, spriteBMD);

  Phaser.Sprite.call(this, game, x, y, belt);
  this.game.physics.arcade.enable(this);
  debugger
  this.game.physics.arcade.collide(this, player, this.applyEffect, null, this);
  this.game.time.events.add(2000, this.destroy, this);
  this.game.add.existing(this);
  player.bringToTop()
};

Drop.prototype = Object.create(Phaser.Sprite.prototype);
Drop.prototype.constructor = Drop;

Drop.prototype.update = function() {
  // debugger
};

Drop.prototype.blah = function(drop, player) {
  console.log(player.body);
  console.log(drop.body);
}
Drop.prototype.applyEffect = function(drop, player) {
  debugger
  // var count = 0;
  // while (this.body.checkCollision.any) {
  //   console.log(this.body.checkCollision.any)
  //   if (count > 2000) { return }
  //   player.body.velocity.y += 400;
  //   count++;
  // }
}

module.exports = Drop;

},{}],3:[function(require,module,exports){
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

  this.upKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
  this.downKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
  this.leftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
  this.rightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
  this.dropKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
  this.dropKey2 = game.input.keyboard.addKey(Phaser.Keyboard.E);
  this.dropKey3 = game.input.keyboard.addKey(Phaser.Keyboard.T);

  game.input.onDown.add(this.moveSprite, this);

  this.downKey.onDown.add(this.moveLoad, this);
  this.upKey.onDown.add(this.moveLoad, this);
  this.leftKey.onDown.add(this.strafeLoad, this);
  this.rightKey.onDown.add(this.strafeLoad, this);
  this.dropKey.onDown.add(this.dropCircle, this);
  this.dropKey2.onDown.add(this.dropBelt, this);
  this.dropKey3.onDown.add(this.dropTimeBomb, this);

};

Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

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

Player.prototype.moveLoad = function() {
}

Player.prototype.strafeLoad = function() {
}

Player.prototype.update = function() {
  if (this.upKey.isDown)
  {
    this.body.velocity.y = -150;
  }
  else if (this.downKey.isDown)
  {
    this.body.velocity.y = +150;
  }
  else if (!this.upKey.isDown || !this.downKey.isDown)
  {
    this.body.velocity.y = 0;
  }

  if (this.leftKey.isDown)
  {
    this.body.velocity.x = -150;
  }
  else if (this.rightKey.isDown)
  {
    this.body.velocity.x = +150;
  }
  else if (!this.leftKey.isDown || !this.rightKey.isDown)
  {
    this.body.velocity.x = 0;
  }

  if (this.body.velocity.y != 0) {
    this.move();
  } else if (this.body.velocity.x != 0) {
    this.strafe();
  } else {
    this.idle();
  }
};

Player.prototype.move = function() {
  this.animations.play('walk');
}

Player.prototype.strafe = function() {
  this.animations.play('strafe');
}

Player.prototype.idle = function() {
  this.animations.play("idle");
}

Player.prototype.moveSprite = function (pointer) {
  if (tween && tween.isRunning) {
    tween.stop();
    // this.animations.play('idle');
  }

  // this.animations.play('walk');
  var angleInRadians = this.game.physics.arcade.angleToPointer(this, pointer);
  this.angle = angleInRadians * (180 / 3.14) + 90
  var duration = (this.game.physics.arcade.distanceToPointer(this, pointer) / 300) * 1000;
  var tween = this.game.add.tween(this).to({ x: pointer.x, y: pointer.y }, duration, Phaser.Easing.Linear.None, true);
}

module.exports = Player;

},{"./drop":2}],4:[function(require,module,exports){

'use strict';

function Boot() {
}

Boot.prototype = {
  preload: function() {
    this.load.image('preloader', 'assets/preloader.gif');
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
    var style = { font: '65px Arial', fill: '#ffffff', align: 'center'};
    this.titleText = this.game.add.text(this.game.world.centerX,100, 'Game Over!', style);
    this.titleText.anchor.setTo(0.5, 0.5);

    this.congratsText = this.game.add.text(this.game.world.centerX, 200, 'You Win!', { font: '32px Arial', fill: '#ffffff', align: 'center'});
    this.congratsText.anchor.setTo(0.5, 0.5);

    this.instructionText = this.game.add.text(this.game.world.centerX, 300, 'Click To Play Again', { font: '16px Arial', fill: '#ffffff', align: 'center'});
    this.instructionText.anchor.setTo(0.5, 0.5);
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
    this.map.addTilesetImage("grass-tiles-2-small", 'groundTiles');
    this.map.addTilesetImage("tree2-final", 'tree');

    this.backGround = this.map.createLayer("Background");
    this.foreGround = this.map.createLayer("Foreground");

    this.backGround.resizeWorld();
    this.foreGround.resizeWorld();

    this.player = new Player(this.game, 150, 150, 0)
    this.game.add.existing(this.player);
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

    this.load.tilemap('lvl1', 'assets/dropz1.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('groundTiles', 'assets/grass-tiles-2-small.png');
    this.load.image('tree', 'assets/tree2-final.png');

    this.load.spritesheet('playerMovements', 'assets/playerMovements.png', 64, 64, 16);

    this.load.image('tree', 'assets/tree2-final.png');
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
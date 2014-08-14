'use strict';

var BootState, GameoverState, MenuState, PlayState, PreloadState, game;

window.onload = function () {
  game = new Phaser.Game(800, 600, Phaser.AUTO, 'dropz');

  game.state.add('boot', BootState);

  game.state.add('gameover', GameoverState);

  game.state.add('menu', MenuState);

  game.state.add('play', PlayState);

  game.state.add('preload', PreloadState);

  // game.state.add('boot', require('./states/boot'));
  // game.state.add('gameover', require('./states/gameover'));
  // game.state.add('menu', require('./states/menu'));
  // game.state.add('play', require('./states/play'));
  // game.state.add('preload', require('./states/preload'));


  game.state.start('boot');
};

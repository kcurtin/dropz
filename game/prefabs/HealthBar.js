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

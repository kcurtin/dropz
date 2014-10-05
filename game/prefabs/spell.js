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

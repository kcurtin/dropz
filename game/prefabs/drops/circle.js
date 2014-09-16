// Player.prototype.dropTimeBomb = function() {
//   // var shape = this.game.add.graphics(0, 0)
//   // shape.lineStyle(2, 0x0000FF, 1);
//   // shape.beginFill(0xFFFF0B, 1)
//   // shape.drawCircle(this.x, this.y, 100)
//   // this.game.time.events.add(2000, shape.destroy, shape);
//   // this.game.time.events.add(4000, this.renderTimeBomb, this);
//
//   // this.bringToTop()
// }
//
// Player.prototype.renderTimeBomb = function() {
//   // var shape = this.game.add.graphics(0, 0)
//   // shape.lineStyle(2, 0x0000FF, 1);
//   // shape.beginFill(0xFFFF0B, 1)
//   // shape.drawCircle(this.x, this.y, 200);
//   // this.game.time.events.add(6000, shape.destroy, shape);
//
//   // this.bringToTop()
// }
//
// Player.prototype.dropCircle = function() {
//   var emitter = this.game.add.emitter(this.x, this.y, 100);
//   emitter.makeParticles("corona", [1], 10, true);
//   emitter.minParticleSpeed.setTo(-300, -300);
//   emitter.maxParticleSpeed.setTo(300, 300);
//   emitter.setAlpha(0.3, 0.8);
//   emitter.setScale(0.5, 1);
//   emitter.gravity = 0;
//
//   this.emitter = emitter;
//   emitter.start(true, 200, null, 10);
//   // var shape = this.game.add.graphics(0, 0)
//   // shape.lineStyle(2, 0x0000FF, 1);
//   // shape.beginFill(0xFFFF0B, 1)
//   // shape.drawCircle(this.x, this.y, 100)
//   // this.game.time.events.add(2000, shape.destroy, shape);
//
//   // this.bringToTop()
// }
//

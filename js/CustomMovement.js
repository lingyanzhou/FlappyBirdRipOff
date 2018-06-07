function CustomMovement (gameObj, func) {
  this.gameObj = gameObj;
  this.func = func;
}

CustomMovement.prototype.tick = function (dt) {
  this.func(this.gameObj, dt);
}

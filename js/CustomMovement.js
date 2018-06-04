function CustomMovement (phxObj, func) {
  this.phxObj = phxObj;
  this.func = func;
}

CustomMovement.prototype.tick = function (dt) {
  this.func(dt, this.phxObj)
}

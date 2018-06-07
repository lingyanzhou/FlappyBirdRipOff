var Engine = Engine || Matter.Engine,
  Render = Render || Matter.Render,
  World = World || Matter.World,
  Bodies = Bodies || Matter.Bodies,
  Body = Body || Matter.Body,
  Events = Events || Matter.Events,
  Runner = Runner ||Matter.Runner;

function Sky(phxEngine, stage, objRegisters, customMovementRegister, width, height) {
  GameObject.call(this, phxEngine, stage, objRegisters, customMovementRegister);

  this.sprite = new PIXI.extras.TilingSprite(Sky.TEXTURES[0], width, height);
  this.sprite.tileScale.y = 2.5;
  this.sprite.tileScale.x = 2;
  this.customMovement = null;
}
Sky.prototype = Object.create(GameObject.prototype);

Sky.SPRITEFILES = ['img/sky.png'];
Sky.SPRITESID = ['sky'];
Sky.TEXTURES = [];

Sky.requestResources = function (loader) {
  for (var i = 0; i< Sky.SPRITESID.length; i++) {
    loader.add(Sky.SPRITESID[i], Sky.SPRITEFILES[i]);
  }
}

Sky.onResourceLoaded = function (loader, resources) {
  Sky.TEXTURES = [];
  for (var i = 0; i< Sky.SPRITESID.length; i++) {
    Sky.TEXTURES[i] = resources[Sky.SPRITESID[i]].texture;
  }
}

Sky.prototype.register = function () {
  this.stage.addChild(this.sprite);
  for (r of this.objRegisters) {
    r.push(this);
  }
  if (this.customMovementRegister != null && this.customMovement != null) {
    this.customMovementRegister.push(this.customMovement);
  }
}

Sky.prototype.unregister = function () {
  this.stage.removeChild(this.sprite);
  for (r of this.objRegisters) {
    r.splice(r.indexOf(this), 1);
  }
  if (this.customMovementRegister != null && this.customMovement != null) {
    this.customMovementRegister.splice(this.customMovementRegister.indexOf(this.customMovement), 1);
  }
}
